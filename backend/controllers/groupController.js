import groupModel from "../models/groupModel.js";
import { v4 as uuidv4 } from "uuid";

//Create group
const createGroup = async (req,res) => {
    try {
        const groupId = uuidv4();

        const group = new groupModel({
            groupId,
            host: req.userId,
            members: [req.userId],
            items: []
        });
        await group.save();

        res.json({success:true,groupId});

    } catch (error) {
        console.log(error);
        res.json({success:false});
    }
};

//join group
const joinGroup = async (req,res) => {
    const {groupId} = req.body;
    try {
        const group = await groupModel.findOne({groupId});

        if(!group){
            return res.json({success:false,message:"Group not found"});
        }

        if(!group.members.includes(req.userId)){
            group.members.push(req.userId);
            await group.save();
        }

        res.json({success:true, group});
    } catch (error) {
        console.log(error);
        res.json({success:false});
    }
};

export { createGroup, joinGroup };