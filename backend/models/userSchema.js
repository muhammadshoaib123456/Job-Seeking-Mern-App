import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name must contain at least 3 characters"],
    maxLength: [30, "Name must not exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true, // ✅ Ensures no duplicate emails
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: {
    type: Number,
    required: [true, "Please provide a valid phone number"],
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password must be at least 8 characters"],
    maxLength: [32, "Password must not exceed 32 characters"],
    select: false, // ✅ hide password by default
  },
  role: {
    type: String,
    required: true,
    enum: ["Job Seeker", "Employer"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Generate JWT token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);




// ✅ 1. Remember the structure of each Mongoose file:
// Every Mongoose model file generally contains:

// Schema definition

// Custom validations

// Middleware (pre, post)

// Custom instance methods (e.g., comparePassword, getJWT)

// Model export








