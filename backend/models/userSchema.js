import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength:[3, "name must contain at least 3 characater"],
        maxLength:[30, "name not be exceeded 30 characterss"]
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail, "please provide valid email"]
    },
    phone:{
        type:Number,
        required:[true, "please provide valid phone no"]
    },
    password:{
        type:String,
        required:true,
        minLength:[8, "password must contain 8 characters"],
        maxLength:[32, "password not exceed to 32 characters"],
        select: false
    },
    role:{
     type:String,
     required:true,
     enum:["Job Seeker", "Employer"]
    },
    date:{
        type:Date,
        default:Date.now,
    },
});

// Hashing the password
// 📌 What’s happening here:
// .pre("save", fn) runs before saving a document to MongoDB.

// If the password is not changed, we call next() to move on.

// If password is new or modified, we hash it using:


userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})





// 🧠 What it does:
// Adds a method .ComparePassword() to the user instance.

// It takes the password user entered (enteredPassword) and compares it to the hashed password stored in the DB using bcrypt.compare().


// comparing password
userSchema.methods.ComparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};




// 🧠 What it does:
// Adds method .geJWTTOKEN() to user instance.

// It signs a token (JWT) using:

// Payload: { id: this._id } → so token knows which user it belongs to

// Secret key from .env file

// Expiry time from .env



// generate a jwt token for authorization
userSchema.methods.getJWTTOKEN = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE,
    });
}



export const User = mongoose.model("User", userSchema);




// ✅ 1. Remember the structure of each Mongoose file:
// Every Mongoose model file generally contains:

// Schema definition

// Custom validations

// Middleware (pre, post)

// Custom instance methods (e.g., comparePassword, getJWT)

// Model export








