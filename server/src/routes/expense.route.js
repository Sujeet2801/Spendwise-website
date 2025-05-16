import { Router } from "express";
import { isAuthenticated } from '../middlewares/auth.middleware.js'
import { 
    addExpense, 
    deleteExpenseController, 
    updateExpenseController 
} from "../controllers/expense.controller.js";

import { validateUsingZodError } from "../middlewares/validate.middleware.js";
import { expenseSchema } from "../validators/expense.validate.js";

const router = Router();

router.use(isAuthenticated);

router
    .route("/expense/add")
    .post( validateUsingZodError(expenseSchema()), addExpense );

router
    .route("/expense/update/:id")
    .put( updateExpenseController );

router
    .route("/expense/delete/:id")
    .delete( deleteExpenseController)

export default router;