import { rateLimit } from "express-rate-limit";

export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    keyGenerator: (req) => req.userId,
    message: {
        status: 429,
        error: "Too many requests, please try again later.",
    }
});

export const aiRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    keyGenerator: (req) => req.userId,
    message: {
        status: 429,
        error: "Too many requests to AI service, please try again later.",
    }
});