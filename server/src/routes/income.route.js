import { Router } from "express";
import { addIncomeController, deleteIncomeController, getAllIncome, getAllIncomeBySource, updateIncomeController } from "../controllers/income.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/add-income").post( isAuthenticated, addIncomeController )
router.route("/add-income/:id").delete( isAuthenticated, deleteIncomeController )
router.route("/update-income/:id").put( isAuthenticated, updateIncomeController)
router.route("/all").get( isAuthenticated, getAllIncome )
router.route("/add/:source").get( isAuthenticated, getAllIncomeBySource )

export default router;