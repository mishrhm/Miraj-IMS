import type { RequestHandler, Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";


export const validate = (schema: ZodType): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            })
            next();
        } catch (error: any) {
            res.status(400).json({
                error: {
                    message: "Validation Pipeline Rejected Request",
                    details: error.errors?.map((e: any) => ({
                        location: e.path[0],
                        field: e.path[1],
                        issue: e.message,
                    })),
                }
            })
        }
    }
}