import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import supabase from "../../configs/storage.js";
import { AppError, NotFoundError } from "../../errors/index.js";
import prisma from "../../configs/db.js";

class FileService {

    async extractTextFromFile(fileBuffer, fileType) {
        try {

            if (fileType === "application/pdf") {
                const data = await pdfParse(fileBuffer);
                return data.text;

            } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                const result = await mammoth.extractRawText({ buffer: fileBuffer });
                return result.value;

            } else if (fileType === "text/plain") {
                return fileBuffer.toString("utf-8");

            } else {
                throw new AppError("Unsupported file type for text extraction.", 400);
            }

        } catch (error) {
            console.error("Error extracting text from file:", error);
            throw new AppError("Failed to extract text from the file.", 500);
        }
    }
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

    async getFileContent(fileId) {
        try {
            const file = await prisma.file.findUnique({
                where: { id: fileId },
            });

            if(!file) {
                throw new NotFoundError(`File with ID ${fileId} not found.`);
            }

            const storagePath = file.fileUrl.split("/").pop();
            const { data, error } = await supabase.storage
                .from("documents")
                .download(storagePath);

            if(error) {
                console.error("Error downloading file from Supabase:", error);
                throw new AppError("Failed to download file.", 500);
            }

            const arrayBuffer = await data.arrayBuffer();
            const textContent = await this.extractTextFromFile(Buffer.from(arrayBuffer), file.fileType);
            return {
                id: file.id,
                title: file.title,
                content: textContent,
            }

        } catch (error) {
            console.error("Error in FileService.getFileContent:", error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError("An unexpected error occurred while fetching the file content.", 500);
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