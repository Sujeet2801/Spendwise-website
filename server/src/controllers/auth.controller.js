import { asyncHandler } from "../utils/asnyc-handler.js";
import { User } from "../models/auth.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { sendVerificationEmail } from "../utils/mail.js";

const registerUserController = asyncHandler(async (req, res) => {
    
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User already exists with this email");
    }

    const { token, tokenExpiry } = User.prototype.generateTemporaryEmailToken()

    const newUser = await User.create({ 
        name, email, password, phone, 
        emailVerificationToken: token, 
        emailVerificationExpiry: tokenExpiry 
    });

    if (!newUser) {
        throw new ApiError(500, "User registration failed");
    }

    await sendVerificationEmail({
        email, name, verificationToken: token
    });

    const userData = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
    };

    return res.status(201).json(
        new ApiResponse(201, { user: userData }, "User registered successfully")
    );
});

const verifyEmailController = asyncHandler( async (req, res) => { 

    const { token } = req.params;

    const existingUser = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpiry: { $gt: Date.now() }
    })

    if (!existingUser) {
        throw new ApiError(400, "Invalid or Expired verification token");
    }

    existingUser.isEmailVerified = true;
    existingUser.emailVerificationToken = undefined;
    existingUser.emailVerificationExpiry = undefined;

    await existingUser.save({ validateBeforeSave: false });

    return res
        .status(200).json(new ApiResponse(200, null, "Email verified successfully"));
});

const loginUserController = asyncHandler( async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new ApiError(400, "User not exists");
    }

    const isMatch = await existingUser.isPasswordCorrect(password);
    if (!isMatch) {
        throw new ApiError(400, "Invalid email or password");
    }

    if (!existingUser.isEmailVerified) {
        throw new ApiError(403, "Please verify your email before logging in");
    }

    const token = await existingUser.generateRefreshToken();
    existingUser.refreshToken = token;

    await existingUser.save({ validateBeforeSave: false });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 7. Response
    return res.status(200).json(new ApiResponse(200, null, "Login successful"));
});

const logoutUserController = asyncHandler( async (req, res) => {

    const userId = req.user?.id

    const existingUser = await User.findById( userId );
    if(!existingUser){
        throw new ApiError(404, "User not exists")
    }

    existingUser.refreshToken = undefined;

    await existingUser.save({ validateBeforeSave: false })

    res.clearCookie("token");
    res.status(200).json(new ApiResponse(200, {}, "Logout successful"));
});


export { 
    registerUserController,
    verifyEmailController,
    loginUserController,
    logoutUserController,
};