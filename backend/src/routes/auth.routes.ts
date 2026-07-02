import { Router, type NextFunction, type RequestHandler, type Request, type Response } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { SignUpSchema } from "../validators/auth.validator.js";


const authRouter = Router();

const signUpHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(201).json({
            success: true,
            message: "Validation success! Payload is secure.",
            data: req.body,
        });
    } catch (error) {
        next(error);
    }
}

authRouter.post("/signup", validate(SignUpSchema), signUpHandler);

export default authRouter;