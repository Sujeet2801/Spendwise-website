import { Router } from "express";
import { addExpense, deleteExpenseController, getExpenseByCategoryController, getExpenseByCategoryMonthController, getExpenseController, updateExpenseController } from "../controllers/expense.controller.js";
import { isAuthenticated } from '../middlewares/auth.middleware.js'

const router = Router();

router.route("/add").post( isAuthenticated, addExpense);
router.put("/expenses/:id", isAuthenticated, updateExpenseController);

router.route("/delete/:id").delete( isAuthenticated, deleteExpenseController)
router.route("/getall").get( isAuthenticated, getExpenseController )
router.route("/expense/:category").get( isAuthenticated, getExpenseByCategoryController)
router.route("/expenses/:category").get( isAuthenticated, getExpenseByCategoryMonthController)

export default router;
