import { Expense } from "../models/expense.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/asnyc-handler.js";

const addExpense = asyncHandler( async (req, res) => {

    const { amount, category, date, notes } = req.body;
    const userId = req.user?.id;

    if (typeof amount !== "number" || amount < 0) {
        throw new ApiError(400, "Invalid or missing amount");
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
        throw new ApiError(400, "Invalid date format");
    }

    const day = parsedDate.getUTCDate();
    const month = parsedDate.getUTCMonth() + 1;
    const year = parsedDate.getUTCFullYear();

    const expense = new Expense({
        user: userId,
        amount,
        category,
        date: parsedDate,
        notes,
        day,
        month,
        year,
    });


    const savedExpense = await expense.save();

    return res
        .status(201)
        .json(new ApiResponse(201, savedExpense, "Expense added successfully"));
});

const updateExpenseController = asyncHandler( async (req, res) => {
    
    const { id } = req.params;
    const userId = req.user?.id;

    const updateData = {};
    const allowedFields = ["amount", "category", "date", "notes"];

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updateData[field] = req.body[field];
        }
    }

    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, "No fields provided to update");
    }

    const updatedExpense = await Expense.findOneAndUpdate(
        { _id: id, user: userId },
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedExpense) {
        throw new ApiError(404, "Expense not found or unauthorized");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedExpense, "Expense updated successfully"));
});

const deleteExpenseController = asyncHandler( async (req, res) => {

    const { id } = req.params;
    const userId = req.user?.id;

    if(!userId){
        throw new ApiError(400, "User not logged in");
    }

    await Expense.findByIdAndDelete( id )

    return res.status(200).json(new ApiResponse(200, null, "Expense deleted successfully"))

})

const getExpenseController = asyncHandler( async (req, res) => {

    const userId = req.user?.id
    
    const existingExpense = await Expense.find({ user: userId })
    console.log(existingExpense);
    
    if(!existingExpense){
        throw new ApiError(404, "No expenses found")
    }

    return res.status(200, existingExpense, "All expenses fetched")

})

const getExpenseByCategoryController = asyncHandler( async (req, res) => {

    const { category } = req.params;
    const userId = req.user?.id;
    
    const existingExpense = await Expense.find({ user: userId })
    
    if(!existingExpense.category === category){
        throw new ApiError(404, "No expense found in this category")
    }

    const result = await Expense.find({ 
        user: userId,
        category: category
    })

    res.status(200).json(new ApiResponse(200, result, "Expenses fetched"))
})

const getExpenseByCategoryMonthController = asyncHandler( async (req, res) => {
    
    const { month, year, day } = req.query;
    const { category } = req.params;
    const userId = req.user?.id;

    if (!category) {
        throw new ApiError(400, "Category is required");
    }
    
    const query = {
        user: userId,
        category,
    };

    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);
    if (day) query.day = parseInt(day);

    console.log(query);

    const result = await Expense.find(query);

    if (result.length === 0) {
        throw new ApiError(404, "No expenses found for the given filters");
    }

    res.status(200).json(new ApiResponse(200, result, "Expenses fetched"));
});

export {
    addExpense,
    updateExpenseController,
    deleteExpenseController,
    getExpenseController,
    getExpenseByCategoryController,
    getExpenseByCategoryMonthController
}