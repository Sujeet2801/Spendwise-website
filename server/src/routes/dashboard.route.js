// routes/dashboard.routes.js

import express from 'express';
import DashboardController from '../controllers/dashboard.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js'; // Adjust the path as needed

const router = express.Router();

// Protect all routes with authentication middleware
router.use(isAuthenticated);

router.get('/overview', DashboardController.getOverview);
router.get('/recent-transactions', DashboardController.getRecentTransactions);
router.get('/monthly-summary', DashboardController.getMonthlySummary);
router.get('/spending-trends', DashboardController.getSpendingTrends);
router.get('/budget-progress', DashboardController.getBudgetProgress);
router.get('/top-categories', DashboardController.getTopCategories);
router.get('/financial-tips', DashboardController.getFinancialTips);

export default router;
