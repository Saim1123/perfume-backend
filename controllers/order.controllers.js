import Stripe from "stripe";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, userId } = req.body;

    const productList = await Promise.all(
      items.map(async item => {
        const product = await Product.findById(item.product);
        return {
          price_data: {
            currency: "pkr",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100,
          },
          quantity: item.quantity,
        };
      }),
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: productList,
      mode: "payment",
      // success_url: `${process.env.FRONTEND_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      success_url: `${process.env.FRONTEND_URL}`,
      cancel_url: `${process.env.FRONTEND_URL}/carts`,
      metadata: {
        userId,
        shippingAddress: JSON.stringify(shippingAddress),
      },
    });

    res.status(200).json({ sessionUrl: session.url });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

export const confirmOrder = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];

    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const shippingAddress = JSON.parse(session.metadata.shippingAddress);

      const items = session.display_items.map(item => ({
        product: item.custom.name,
        quantity: item.quantity,
        price: item.amount / 100,
      }));

      const newOrder = new Order({
        userId,
        items,
        shippingAddress,
        totalPrice: session.amount_total / 100,
        paymentIntentId: session.payment_intent,
        status: "Pending",
      });

      await newOrder.save();

      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false, message: "Unknown event type" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Webhook error", error: error.message });
  }
};
