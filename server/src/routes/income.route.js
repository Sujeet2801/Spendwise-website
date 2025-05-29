import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { 
    addIncomeController, 
    deleteIncomeController, 
    getAllIncome, 
    getAllIncomeBySource, 
    updateIncomeController,
    getIncomeGroupByCategoryController
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

router
    .route("/incomes")
    .get( isAuthenticated, getAllIncome )

router
    .route("/income/:source")
    .get( isAuthenticated, getAllIncomeBySource )

router
    .route("/income/group/category")
    .get( getIncomeGroupByCategoryController )

export default router;