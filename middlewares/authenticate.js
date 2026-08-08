import { getAuth } from "@clerk/express";
import prisma from "../configs/db.js";

const authenticate = async (req, res, next) => {
  try {
    const { userId, sessionClaims } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    const email = sessionClaims?.email;

    if (!email) {
      return res.status(400).json({ message: "Email not found in session claims" });
    }

    const allowedUser = await prisma.allowedUser.findUnique({
      where: { email: email },
    });

    if (!allowedUser || !allowedUser.isActive) {
      return res.status(403).json({ message: "User not allowed in the list"});
    }

    if(!user) {

      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: email,
        },
      });

    }
    req.userId = userId;
    req.role = user.role;
    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default authenticate;