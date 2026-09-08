import jsonwebtoken from "jsonwebtoken";

export function authMiddleware(req, res, next) {

    // Get Authorization header
    const authorization = req.headers.authorization;

    // Check whether Authorization header exists
    if (!authorization) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    // Check Bearer token
    if (!authorization.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Invalid authorization format."
        });
    }

    // Get the token
    const token = authorization.split(" ")[1];

    try {

        // Verify JWT
        const decodedUser = jsonwebtoken.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store decoded user information
        req.user = decodedUser;

        // Continue to the next function
        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token."
        });

    }
}