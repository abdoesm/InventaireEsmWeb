import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    user?: DecodedUser;
  }
}

interface DecodedUser extends JwtPayload {
  id: string;
  role: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  console.log("🔹 Checking authorization...");

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("🚫 No token provided!");
    res.status(403).json({ success: false, message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      console.log("❌ Invalid token!", err);
      res.status(401).json({ success: false, message: "Invalid token" });
      return;
    }

    // ✅ Ensure `decoded` is of type `DecodedUser`
    const user = decoded as DecodedUser;
    
    console.log("✅ Token verified!", user);
    req.user = user;
    next();
  });
};
