import jwt from "jsonwebtoken";

class Verification {
  static verifyToken = (req, res, next) => {
    const token = req.cookies["almauth"];

    // Check if the token is present
    if (!token) {
      return res.status(401).send("Access Denied");
    }

    try {
      // Verify the token
      const verified = jwt.verify(token, process.env.JWT_SECRET);

      // Set the verified user data in the request object
      req.user = verified;

      // Call the next middleware function
      return next();
    } catch (error) {
      // Handle any errors that may occur
      console.error(error);

      // Check if the error is due to an invalid token
      if (error.name === "JsonWebTokenError") {
        return res.status(400).send("Invalid Token");
      }

      // If it's a different type of error, return a 500 Internal Server Error response
      return res.status(500).send("Something went wrong.");
    }
  }
}

export default Verification;
