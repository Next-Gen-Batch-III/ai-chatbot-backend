import { getAuth } from "@clerk/express";

const authenticate = (req, res, next) => {
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
}

export default authenticate;
