import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    if (!req.cookies || !req.cookies.token) {
      return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
    }

    const token = req.cookies.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
    }

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("Error in verifyToken middleware:", error);
    return res.status(401).json({ success: false, message: "Unauthorized - token invalid or expired" });
  }
};
