import mongoose from 'mongoose';
import moment from 'moment';
import { Income } from '../models/income.model.js';
import { Expense } from '../models/expense.model.js';

const DashboardController = {

    async getOverview(req, res) {

        try {
        const userId = mongoose.Types.ObjectId.createFromHexString(req.user.id);
        console.log(userId);
        
        const [incomeSum] = await Income.aggregate([
            { $match: { user: userId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        console.log(incomeSum);
        
        const [expenseSum] = await Expense.aggregate([
            { $match: { user: userId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        res.json({
            totalIncome: incomeSum?.total || 0,
            totalExpenses: expenseSum?.total || 0,
            netSavings: (incomeSum?.total || 0) - (expenseSum?.total || 0)
        });
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching overview' });
        }
    },

    async getRecentTransactions(req, res) {
        try {
        const userId = req.user.id;

        const expenses = await Expense.find({ user: userId }).sort({ date: -1 }).limit(5);
        const incomes = await Income.find({ user: userId }).sort({ date: -1 }).limit(5);

        const transactions = [
            ...expenses.map(t => ({ ...t._doc, type: 'expense' })),
            ...incomes.map(t => ({ ...t._doc, type: 'income' }))
        ];

        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(transactions.slice(0, 10));
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching transactions' });
        }
    },

    async getMonthlySummary(req, res) {
        try {
        const userId = req.user.id;
        const start = moment().startOf('month').toDate();
        const end = moment().endOf('month').toDate();

        const summary = await Expense.aggregate([
            {
            $match: {
                user: userId,
                date: { $gte: start, $lte: end }
            }
            },
            {
            $group: {
                _id: "$category",
                total: { $sum: "$amount" }
            }
            }
        ]);

        res.json(summary);
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching monthly summary' });
        }
    },

    async getSpendingTrends(req, res) {
        try {
        const userId = req.user._id;
        const start = moment().subtract(30, 'days').toDate();

        const trends = await Expense.aggregate([
            {
            $match: {
                user: userId,
                date: { $gte: start }
            }
            },
            {
            $group: {
                _id: {
                day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
                },
                total: { $sum: "$amount" }
            }
            },
            { $sort: { "_id.day": 1 } }
        ]);

        res.json(trends);
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching trends' });
        }
    },

    // async getBudgetProgress(req, res) {
    //     try {
    //     const userId = req.user.id;
    //     const monthStart = moment().startOf('month').toDate();
    //     const monthEnd = moment().endOf('month').toDate();

    //     const [budget] = await Budget.find({ user: userId }).limit(1);
    //     const [expenseSum] = await Expense.aggregate([
    //         {
    //         $match: {
    //             user: userId,
    //             date: { $gte: monthStart, $lte: monthEnd }
    //         }
    //         },
    //         { $group: { _id: null, total: { $sum: "$amount" } } }
    //     ]);

    //     const budgetAmount = budget?.amount || 0;
    //     const spent = expenseSum?.total || 0;
    //     const percentageUsed = budgetAmount > 0 ? ((spent / budgetAmount) * 100).toFixed(2) : 0;

    //     res.json({
    //         budget: budgetAmount,
    //         spent,
    //         remaining: budgetAmount - spent,
    //         percentageUsed
    //     });
    //     } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ message: 'Error fetching budget progress' });
    //     }
    // },

    async getTopCategories(req, res) {
        try {
        const userId = req.user.id;
        const start = moment().startOf('month').toDate();
        const end = moment().endOf('month').toDate();

        const topCategories = await Expense.aggregate([
            {
            $match: {
                user: userId,
                date: { $gte: start, $lte: end }
            }
            },
            {
            $group: {
                _id: "$category",
                total: { $sum: "$amount" }
            }
            },
            { $sort: { total: -1 } },
            { $limit: 5 }
        ]);

        res.json(topCategories);
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching top categories' });
        }
    },

    async getFinancialTips(req, res) {
        try {
        // Placeholder logic — could be dynamic based on user spending patterns
        const tips = [
            "Track subscriptions to avoid auto-renewals you do not use.",
            "Set a fixed budget for food delivery apps.",
            "Use UPI or debit card instead of credit to avoid overspending.",
            "Review your expenses weekly for better awareness.",
            "Split your savings before spending, not after."
        ];

        res.json({ tips });
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching financial tips' });
        }
    }
};

export default DashboardController;
