import supabase from "../../configs/storage.js";
import { AppError, NotFoundError } from "../../errors/index.js";
import prisma from "../../configs/db.js";

class FileService {
    async uploadFile(file) {

        try {
            const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
            const storagePath = `${Date.now()}_${sanitizedFileName}`;

            const { data, error } = await supabase.storage
                .from("documents")
                .upload(storagePath, file.buffer, {
                    contentType: file.mimetype,
                });

            if (error) {
                console.error("Error uploading file to Supabase:", error);
                throw new AppError("Failed to upload file.", 500);
            }

            const { data: publicUrlData } = supabase.storage
                .from("documents")
                .getPublicUrl(storagePath);

            const publicURL = publicUrlData.publicUrl;

            if(!publicURL) {
                throw new AppError("Failed to retrieve public URL for the uploaded file.", 500);
            }

            const fileRecord = await prisma.file.create({
                data:{
                    title: file.originalname,
                    fileUrl: publicURL,
                    fileSize: file.size,
                    fileType: file.mimetype,
                    status: "PENDING"
                },
                select: {
                    id: true,
                    title: true,
                    fileUrl: true,
                    fileSize: true,
                    fileType: true,
                    status: true,
                }
            })

            return fileRecord;
        } catch (error) {
            console.error("Error in FileService.uploadFile:", error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("An unexpected error occurred while uploading the file.", 500);
        }
    }

    async getFile(){
        try {
            const files = await prisma.file.findMany({
                select: {
                    id: true,
                    title: true,
                    fileUrl: true,
                    fileSize: true,
                    fileType: true,
                    status: true,
                }
            });
            return files;
        } catch (error) {
            console.error("Error in FileService.getFile:", error);
            throw new AppError("An unexpected error occurred while fetching files.", 500);
        }
    }

    async updateFileStatus(fileId, status) {
        try {
            const file = await prisma.file.findUnique({
                where: { id: fileId },
            });
            if (!file) {
                throw new NotFoundError(`File not found.`);
            }
            const updatedFile = await prisma.file.update({
                where: { id: fileId },
                data: { status },
                select: {
                    id: true,
                    title: true,
                    fileUrl: true,
                    fileSize: true,
                    fileType: true,
                    status: true,
                }
            });
            return updatedFile;
        } catch (error) {
            console.error("Error in FileService.updateFileStatus:", error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("An unexpected error occurred while updating the file status.", 500);
        }
    }

    async deleteFile(fileId) {
        try {
            const file = await prisma.file.findUnique({
                where: { id: fileId },
            });
            if (!file) {
                throw new NotFoundError(`File not found.`);
            }
            const storagePath = file.fileUrl.split("/").pop();
            const { error } = await supabase.storage
                .from("documents")
                .remove([storagePath]);
            await prisma.file.delete({
                where: { id: fileId },
            });
            return;
        } catch (error) {
            console.error("Error in FileService.deleteFile:", error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("An unexpected error occurred while deleting the file.", 500);
        }
    }
}

export default new FileService();