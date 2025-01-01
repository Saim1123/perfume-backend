import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // Check if token is available in cookies
    if (!req.cookies || !req.cookies.token) {
      return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
    }

    const token = req.cookies.token;

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ success: false, message: "Your session has expired. Please log in again." });
        }
        return res.status(401).json({ success: false, message: "Invalid session. Please log in." });
      }

      // Attach decoded user ID to the request
      req.userId = decoded.userId;
      next();
    });
  } catch (error) {
    console.error("Error in verifyToken middleware:", error);
    return res.status(500).json({ success: false, message: "Internal server error. Please try again." });
  }
};
