import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { 
    addIncomeController, 
    deleteIncomeController, 
    updateIncomeController 
} from "../controllers/income.controller.js";
import { validateUsingZodError } from "../middlewares/validate.middleware.js";
import { incomeSchema } from "../validators/income.validate.js";

const router = Router();

router.use( isAuthenticated )

router
    .route("/income/add")
    .post( validateUsingZodError(incomeSchema()), isAuthenticated, addIncomeController )

router
    .route("/income/delete/:id")
    .delete( isAuthenticated, deleteIncomeController )

router
    .route("/income/update/:id")
    .put( isAuthenticated, updateIncomeController)

export default router;