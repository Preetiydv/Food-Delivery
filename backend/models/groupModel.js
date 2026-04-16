import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    groupId: {type:String,required:true,unique:true},
    host: {type:String,required:true}, 
    members: [{type:String}], 
    items: [{
        userId: String,
        itemId: String,
        name: String,
        qunatity: Number,
        price: Number
    }],
    status: {type:String,default:"active"}

},{timestamps:true});

const groupModel = mongoose.models.group || mongoose.model("group",groupSchema);

export default groupModel;