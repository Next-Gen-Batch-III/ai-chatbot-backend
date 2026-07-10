import express from "express";
import { getAuth } from "@clerk/express";


const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        const { userId, sessionClaims } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userRole = sessionClaims?.metadata?.role || 'user';
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    }
}

export default checkRole;