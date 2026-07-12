import {
  Router,
  type NextFunction,
  type RequestHandler,
  type Request,
  type Response,
} from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { LoginSchema, SignUpSchema } from "../validators/auth.validator.js";
import { AuthService } from "../services/auth.service.js";

const authRouter = Router();

const signUpHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const registeredUser = await AuthService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: "Validation success! Payload is secure.",
      data: registeredUser,
    });
  } catch (error) {
    next(error);
  }
};

const loginHandler: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sessionData = await AuthService.loginUser(req.body);
    res.status(200).json({
      success: true,
      message: "Authentication successful",
      data: sessionData,
    });
  } catch (error) {
    next(error);
  }
};

authRouter.post("/signup", validate(SignUpSchema), signUpHandler);
authRouter.post("/login", validate(LoginSchema), loginHandler);

export default authRouter;
