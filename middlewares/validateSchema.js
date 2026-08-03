import { ZodError } from "zod";

const validateSchema = (schema) => {
    return async (req, res, next) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
                file: req.file
            });

            if(parsed.body) {
                req.body = parsed.body;
            }
            if(parsed.query) {
                req.query = Object.assign(req.query, parsed.query);
            }

            if(parsed.params) {
                req.params = Object.assign(req.params, parsed.params);
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.issues.map((err) => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                });
            }

            return next(error);
        }
    }
};

export default validateSchema;