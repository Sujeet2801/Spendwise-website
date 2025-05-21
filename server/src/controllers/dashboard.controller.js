import mongoose from 'mongoose';
import moment from 'moment';
import { Income } from '../models/income.model.js';
import { Expense } from '../models/expense.model.js';
import { asyncHandler } from '../utils/asnyc-handler.js';
import { ApiResponse } from '../utils/api-response.js';

const DashboardController = {

    getOverview: asyncHandler(async (req, res) => {

        const userId = mongoose.Types.ObjectId.createFromHexString(req.user.id);
        
        const [incomeSum] = await Income.aggregate([
            { $match: { user: userId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        
        const [expenseSum] = await Expense.aggregate([
            { $match: { user: userId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        res.json({
            totalIncome: incomeSum?.total || 0,
            totalExpenses: expenseSum?.total || 0,
            netSavings: (incomeSum?.total || 0) - (expenseSum?.total || 0)
        });
    }),

    getRecentTransactions: asyncHandler(async (req, res) => {

        const userId = req.user.id;

        const expenses = await Expense.find({ user: userId }).sort({ date: -1 }).limit(5);
        const incomes = await Income.find({ user: userId }).sort({ date: -1 }).limit(5);

        const transactions = [
            ...expenses.map(t => ({ ...t._doc, type: 'expense' })),
            ...incomes.map(t => ({ ...t._doc, type: 'income' }))
        ];
        console.log(transactions);

        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(transactions.slice(0, 10));
    }),

    getSummary: asyncHandler(async (req, res) => {

        // https://stackoverflow.com/questions/78290754/mongoose-types-objectid-is-deprecated?utm_source=chatgpt.com
        const userId = mongoose.Types.ObjectId.createFromHexString(req.user.id);
        
        const summary = await Expense.aggregate([
            {
                $match: {
                    user: userId,
                },
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount"}
                }
            },
            {
                $sort: {
                    total: -1
                }
            }
        ]);
        console.log(summary);
        
        return res.status(200).json(new ApiResponse(200, summary, "Summary fetched"))
    }),

};

export default DashboardController;
