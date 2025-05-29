import { Router } from "express";
import { isAuthenticated } from '../middlewares/auth.middleware.js'
import { 
    addExpense, 
    deleteExpenseController, 
    getExpenseByCategoryController, 
    getExpenseByCategoryMonthController, 
    getExpenseController, 
    updateExpenseController,
    getExpenseGroupByCategoryController
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

router
    .route("/expenses")
    .get( getExpenseController )

router
    .route("/expense/:category")
    .get( getExpenseByCategoryController)

router
    .route("/expenses/:category")
    .get( getExpenseByCategoryMonthController)

router
    .route("/expense/group/category")
    .get( getExpenseGroupByCategoryController )

export default router;