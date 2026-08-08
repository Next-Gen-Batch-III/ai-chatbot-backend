import prisma from "../../configs/db.js";
import { NotFoundError, AppError} from "../../errors/index.js";


class AllowedUserService {
    async createAllowedUser(email) {
        try {
            email = email.trim().toLowerCase();
            const existingUser = await prisma.allowedUser.findUnique({
                where: { email },
            });

            if (existingUser) {
                if(existingUser.isActive) {
                    throw new AppError(`User with email ${email} already exists and is active.`, 409, "USER_ALREADY_EXISTS");
                }
                throw new AppError(`User with email ${email} already exists.`, 409, "USER_INACTIVE", { userId: existingUser.id});
            }

            const newUser = await prisma.allowedUser.create({
                data: { email, isActive: true },
            });

            return newUser;

        } catch (error) {
            console.error("Error in AllowedUserService.createAllowedUser:", error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("An unexpected error occurred while creating the allowed user.", 500, "INTERNAL_SERVER_ERROR");
        }
    }

    async getAllowedUsers() {
        try {
            const allowedUsers = await prisma.allowedUser.findMany();
            return allowedUsers;
        } catch (error) {
            console.error("Error in AllowedUserService.getAllowedUsers:", error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("An unexpected error occurred while fetching allowed users.", 500, "INTERNAL_SERVER_ERROR");
        }
    }

    async isEmailAllowed(email) {
        try {
            const allowedUser = await prisma.allowedUser.findUnique({
                where: { email },
            });

            if (!allowedUser || !allowedUser.isActive) {
                return false;
            }

            return true;
        } catch (error) {
            console.error("Error in AllowedUserService.isEmailAllowed:", error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("An unexpected error occurred while checking if the email is allowed.", 500, "INTERNAL_SERVER_ERROR");
        }
    }


    async updateAllowedUserStatus(allowedUserId, isActive) {
        try {
            const allowedUser = await prisma.allowedUser.findUnique({
                where: { id: allowedUserId },
            });

            if (!allowedUser) {
                throw new NotFoundError(`Allowed user with ID ${allowedUserId} not found.`);
            }

            const updatedUser = await prisma.allowedUser.update({
                where: { id: allowedUserId },
                data: { isActive },
            });
        } catch (error) {
            console.error("Error in AllowedUserService.updateAllowedUserStatus:", error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("An unexpected error occurred while updating the allowed user's status.", 500, "INTERNAL_SERVER_ERROR");
        }
    }

    async deleteAllowedUser(allowedUserId) {
        try {
            const allowedUser = await prisma.allowedUser.findUnique({
                where: { id: allowedUserId },
            });

            if (!allowedUser) {
                throw new NotFoundError(`Allowed user with ID ${allowedUserId} not found.`);
            }

            await prisma.allowedUser.delete({
                where: { id: allowedUserId },
            });

            return;
        } catch (error) {
            console.error("Error in AllowedUserService.deleteAllowedUser:", error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("An unexpected error occurred while deleting the allowed user.", 500, "INTERNAL_SERVER_ERROR");
        }
    }

    async resetAllowedUserData(allowedUserId) {
        try {
            const allowedUser = await prisma.allowedUser.findUnique({
                where: { id: allowedUserId },
            });

            if (!allowedUser) {
                throw new NotFoundError(`Allowed user with ID ${allowedUserId} not found.`);
            }

            await prisma.$transaction([
                prisma.user.deleteMany({ where: { email: allowedUser.email } }),
                prisma.allowedUser.update({ where: { id: allowedUserId }, data: { isActive: true } }),
            ])

            return allowedUser;
        } catch (error) {
            console.error("Error in AllowedUserService.resetAllowedUserData:", error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("An unexpected error occurred while resetting the allowed user's data.", 500, "INTERNAL_SERVER_ERROR");
        }
    }
}

export default new AllowedUserService();