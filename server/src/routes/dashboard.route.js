import express from 'express';
import DashboardController from '../controllers/dashboard.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(isAuthenticated);

router.get('/overview', DashboardController.getOverview);
router.get('/recent-transactions', DashboardController.getRecentTransactions);
router.get('/summary', DashboardController.getSummary);
router.get('/spending-trends', DashboardController.getSpendingTrends);
router.get('/top-categories', DashboardController.getTopCategories);
router.get('/financial-tips', DashboardController.getFinancialTips);

export default router;