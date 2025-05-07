import { Router } from "express";

import { getCurrentUserController, 
        loginUserController, 
        logoutUserController, 
        registerUserController, 
        updateCurrentUserController, 
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
router.route("/me").get(isAuthenticated, getCurrentUserController);
router.route("/me/update").post(isAuthenticated, updateCurrentUserController);

export default router;