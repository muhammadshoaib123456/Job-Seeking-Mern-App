import mongoose from "mongoose";

export const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "jobseekingggggg"
    }).then(()=>{
        console.log("mongo db connected succeffuly")
    }).catch((err)=>{
        console.log(`error occured while connecting database ${err}`)
    })
}