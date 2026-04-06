import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://preetiyadavpanihar:Pa9350251613@cluster0.ijnmyqj.mongodb.net/Food-delivery').then(()=>console.log("db connected"));
}
