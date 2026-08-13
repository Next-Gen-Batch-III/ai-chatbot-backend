import allowedUserService from "./allowedUser.service.js";
import { AppError } from "../../errors/index.js";

class AllowedUserController {
    async createAllowedUser(req, res) {
        const { email } = req.body;

        try {
            const newUser = await allowedUserService.createAllowedUser(email);
            res.status(201).json({ data: newUser });
        } catch (error) {
            console.error("Error in AllowedUserController.createAllowedUser:", error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message, code: error.code });
            }
            res.status(500).json({ message: "An unexpected error occurred while adding the user" });
        }
    }

    async getAllowedUsers(req, res) {
        try {
            const allowedUsers = await allowedUserService.getAllowedUsers();
            res.status(200).json({ data: allowedUsers });
        } catch (error) {
            console.error("Error in AllowedUserController.getAllowedUsers:", error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message, code: error.code });
            }
            res.status(500).json({ message: "An unexpected error occurred while fetching users." });
        }
    }

    async isEmailAllowed(req, res) {
        const { email } = req.body;
        try {
            const isAllowed = await allowedUserService.isEmailAllowed(email);
            res.status(200).json({ data: { email, isAllowed } });
        } catch (error) {
            console.error("Error in AllowedUserController.isEmailAllowed:", error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message, code: error.code });
            }
            res.status(500).json({ message: "An unexpected error occurred while checking the email." });
        }
    }

    async updateAllowedUserStatus(req, res) {
        const { allowedUserId } = req.params;
        const { isActive } = req.body;
        try {
            const updatedUser = await allowedUserService.updateAllowedUserStatus(allowedUserId, isActive);
            res.status(200).json({ data: updatedUser });
        } catch (error) {
            console.error("Error in AllowedUserController.updateAllowedUserStatus:", error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message, code: error.code });
            }
            res.status(500).json({ message: "An unexpected error occurred while updating the allowed user status." });
        }
    }

    async deleteAllowedUser(req, res) {
        const { allowedUserId } = req.params;
        try {
            await allowedUserService.updateAllowedUserStatus(allowedUserId, false);
            res.status(204).end();
        } catch (error) {
            console.error("Error in AllowedUserController.deleteAllowedUser:", error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message, code: error.code });
            }
            res.status(500).json({ message: "An unexpected error occurred while deleting the allowed user." });
        }
    }

    async resetAllowedUserData(req, res) {
        const { allowedUserId } = req.params;
        try {
            await allowedUserService.resetAllowedUserData(allowedUserId);
            res.status(200).json({ message: "Allowed user data has been reset." });
        } catch (error) {
            console.error("Error in AllowedUserController.resetAllowedUserData:", error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message, code: error.code });
            }
            res.status(500).json({ message: "An unexpected error occurred while resetting allowed user data." });
        }
    }
}

export default new AllowedUserController();