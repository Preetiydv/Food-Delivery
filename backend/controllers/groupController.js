import groupModel from "../models/groupModel.js";
import userModel from "../models/userModel.js";
import { v4 as uuidv4 } from "uuid";

//Create group
const createGroup = async (req, res) => {
  try {
    const groupId = uuidv4();

    const user = await userModel.findById(req.userId);

    const group = new groupModel({
      groupId,
      host: user.name,
      members: [{
        userId: req.userId,
        name: user.name,
        paymentStatus: "Pending"
      }],
      items: [],
    });
    await group.save();

    res.json({ success: true, groupId });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};

//join group
const joinGroup = async (req, res) => {
  const { groupId } = req.body;
  try {
    const group = await groupModel.findOne({ groupId });

    if (!group) {
      return res.json({ success: false, message: "Group not found" });
    }

    const user = await userModel.findById(req.userId);
    const alreadyJoined = group.members.some(member => member.userId === req.userId);
    if(!alreadyJoined){
      group.members.push({
        userId: req.userId,
        name: user.name,
        paymentStatus: "Pending"
      });
      await group.save();
    }

    res.json({ success: true, group });
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};

const getGroup = async (req, res) => {
  try {
    const { groupId } = req.body;

    const group = await groupModel.findOne({ groupId });

    if (!group) {
      return res.json({
        success: false,
        message: "Group not found",
      });
    }

    res.json({
      success: true,
      group,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

const addItemToGroup = async (req, res) => {
  try {
    const { groupId, item } = req.body;

    const group = await groupModel.findOne({ groupId });

    if (!group) {
      return res.json({
        success: false,
        message: "Group not found",
      });
    }

    group.items.push({
      userId: req.userId,
      itemId: item._id,
      name: item.name,
      quantity: 1,
      price: item.price,
    });

    await group.save();

    res.json({
      success: true,
      message: "Item added to group cart",
      group,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const placeGroupOrder = async (req, res) => {
  try {
    const { groupId } = req.body;
    const group = await groupModel.findOne({ groupId });
    if (!group) {
      return res.json({ success: false, message: "Group not found" });
    }
    group.status = "completed";
    await group.save();
    res.json({
      success: true,
      message: "Group Order placed successfully",
      group,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error placing group order" });
  }
};

export { createGroup, joinGroup, getGroup, addItemToGroup, placeGroupOrder };
