import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const userSchema = new Schema({

    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowecase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        require: true,
        unique: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false 
    },
    emailVerificationToken: {
        type: String
    },
    emailVerificationExpiry: {
        type: Date
    },
    forgotPasswordToken: {
        type: String,
        default: false 
    },
    forgotPasswordExpiry: {
        type: Date,
    },
    refreshToken: {
        type: String
    }
}, {timestamps: true})

// hooks
userSchema.pre("save", async function ( next) {
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateTemporaryEmailToken = function(){
    const token = crypto.randomBytes(20).toString("hex")
    const tokenExpiry = Date.now() + (24 * 60 * 60 * 1000)
    return { token, tokenExpiry }
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({  _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateTemporaryToken = function(){
    const unHashedToken = crypto.randomBytes(20).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex")
    const tokenExpiry = Date.now() + (60 * 60 * 1000)
    
    return { unHashedToken, hashedToken, tokenExpiry }
}

export const User = mongoose.model("User", userSchema)