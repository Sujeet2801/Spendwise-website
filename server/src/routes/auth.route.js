import { Router } from "express";

import { loginUserController, 
        logoutUserController, 
        registerUserController, 
        verifyEmailController 
    } from "../controllers/auth.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { userLoginSchema, userRegistrationSchema } from "../validators/auth.validate.js";
import { validateUsingZodError } from "../middlewares/validate.middleware.js";

const router = Router();

router.route("/register").post( validateUsingZodError(userRegistrationSchema()), registerUserController);
router.route("/verify/:token").get(verifyEmailController);
router.route("/login").post( validateUsingZodError(userLoginSchema()),loginUserController);
router.route("/logout").get( isAuthenticated, logoutUserController);

export default router;