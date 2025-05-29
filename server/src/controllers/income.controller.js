import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/asnyc-handler.js";
import { Income } from "../models/income.model.js";
import { ApiResponse } from "../utils/api-response.js";
import mongoose from "mongoose";

const addIncomeController = asyncHandler( async (req, res) => {

    const userId = req.user?.id
    const { source, amount, date, notes} = req.body

    const parseDate = new Date(date)
    if(isNaN(parseDate)){
        throw new ApiError(400, "Invalid date format")
    }

    const day = parseDate.getUTCDate();
    const month = parseDate.getMonth() + 1;
    const year = parseDate.getFullYear();

    const income = new Income({
        user: userId,
        source,
        amount,
        day,
        month,
        year,
        notes
    })

    const savedIncome = await income.save();

    return res.status(200).json(new ApiResponse(200, savedIncome, "Income saved successfully"))
});

const updateIncomeController = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;

    const updateIncomeData = {};
    const allowedFields = ["source", "amount", "notes", "date"];

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updateIncomeData[field] = req.body[field];
        }
    }

    if (updateIncomeData.date) {
        const parsedDate = new Date(updateIncomeData.date);
        if (isNaN(parsedDate)) {
            throw new ApiError(400, "Invalid date format");
        }

        updateIncomeData.day = parsedDate.getDate();
        updateIncomeData.month = parsedDate.getMonth() + 1;
        updateIncomeData.year = parsedDate.getFullYear();
    }

    if (Object.keys(updateIncomeData).length === 0) {
        throw new ApiError(400, "No field provided to update");
    }

    const updateIncome = await Income.findOneAndUpdate(
        { _id: id, user: userId },
        { $set: updateIncomeData },
        { new: true, runValidators: true }
    );

    if (!updateIncome) {
        throw new ApiError(404, "Income not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updateIncome, "Income updated successfully")
    );
});

const deleteIncomeController = asyncHandler( async (req, res) => {

    const { id } = req.params;
    const userId = req.user?.id;

    if(!userId){
        throw new ApiError(400, "User not logged in")
    }

    await Income.findOneAndDelete({
        _id: id, user: userId
    })

    return res.status(200).json(new ApiResponse(200, null, "Income deleted successfully"))

})

const getAllIncome = asyncHandler ( async (req, res) => {

    const userId = req.user?.id;

    const existingIncome = await Income.find({ user: userId })
    if(!existingIncome){
        throw new ApiError(404, "No income found");
    }

    return res.status(200).json(new ApiResponse(200, existingIncome, "All income fetched"));
})

const getAllIncomeBySource = asyncHandler( async (req, res) => {

    const { source } = req.params;
    const userId = req.user?.id;
    
    if(!source){
        throw new ApiError(400, "Income source should be provided")
    }

    const existingExpenseBySource = await Income.find({
        user: userId, source: source
    })

    if(!existingExpenseBySource){
        throw new ApiError(404, "No income found in this source")
    }

    return res.status(200)
        .json(new ApiResponse(200, existingExpenseBySource, "All income from this source is fetched"))

})

const getIncomeGroupByCategoryController = asyncHandler(async (req, res) => {

    const userId = mongoose.Types.ObjectId.createFromHexString(req.user.id);

    const result = await Income.aggregate([
        { $match: { user: userId } },
        {
            $group: {
                _id: "$source",
                total: { $sum: "$amount" }
            }
        },
        { $sort: { total: -1 } }
    ]);

    res.status(200).json(new ApiResponse(200, result, "Grouped income data"));
});

export {
    addIncomeController,
    updateIncomeController,
    deleteIncomeController,
    getAllIncome,
    getAllIncomeBySource,
    getIncomeGroupByCategoryController
}