import express from "express";
import { getAuth } from "@clerk/express";
import prisma from "../configs/db.js";


const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.role || !allowedRoles.includes(req.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        }
        next();
    }
}

export default checkRole;