import { CurrencyCodes } from "validator/lib/isISO4217.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import groupModel from "../models/groupModel.js";
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


//placing user order from frontend
const placeOrder = async (req,res) =>{

    const frontend_url = "http://localhost:5173";

    try {
        const newOrder = new orderModel({
            userId:req.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.userId,{cartData:{}});

        // const line_items = req.body.items.map((item)=>({
        //     price_data:{
        //         currency:"inr",
        //         product_data:{
        //             name:item.name
        //         },
        //         unit_amount:item.price*100*80
        //     },
        //     quantity:item.quantity
        // }))
        // line_items.push({
        //     price_data:{
        //         currency:"inr",
        //         product_data:{
        //             name:"Delivery Charges"
        //         },
        //         unit_amount:2*100*80
        //     },
        //     quantity:1
        // })

        // const session = await stripe.checkout.sessions.create({
        //     line_items:line_items,
        //     mode:'payment',
        //     success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        //     cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        // })

        // res.json({success:true,session_url:session.url})

        return res.json({
            success: true,
            session_url: `http://localhost:5173/verify?success=true&orderId=${newOrder._id}`
        });

    }
    catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const verifyOrder = async (req,res) => {
    const {orderId,success} = req.body;
    try {
        if(success==="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            const groupId = req.body.groupId;
            if(groupId){
                const group = await groupModel.findOne({groupId});
            
            if(group){
                const member = group.members.find(member => member.userId.toString() === req.userId.toString());
                if(member){
                    member.paymentStatus = "Paid";
                    await group.save();
                }
            }
        }

            res.json({success:true,message:"Paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//user orders for frontend
const userOrders = async (req,res) => {
    try {
       const orders = await orderModel.find({userId:req.userId}).sort({date:-1})
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// listing orders for admin pannel
const listOrders = async(req,res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:true,message:"Error"})
    }
}

//api for updating order status
const updateStatus = async(req,res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}