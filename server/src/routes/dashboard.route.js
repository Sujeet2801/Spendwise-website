import express from 'express';
import DashboardController from '../controllers/dashboard.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(isAuthenticated);

router.get('/overview', DashboardController.getOverview);
router.get('/recent-transactions', DashboardController.getRecentTransactions);
router.get('/summary', DashboardController.getSummary);

export default router;