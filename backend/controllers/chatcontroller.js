const asynchandler = require("express-async-handler");
const Chat = require("../models/Chatmodel");
const User = require("../models/Usermodel");


const accessChat = asynchandler(async (req,res)=>{
    const {userid} = req.body;

    if(!userid){
        console.log("UserID param not sent with the request");
        return res.sendStatus(400);
    }

    var ischat = await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userid}}},
        ],

    })
    .populate("users","-password").populate("latestMessage");

    ischat=await User.populate(ischat,{
        path:"latestMessage.sender",
        select:"name pic email",
    });

    if(ischat.length > 0){
        res.send(ischat[0]);
    }else{
        var chatData={
            chatName:"sender",
            isGroupChat:false,
            users: [req.user._id,userid],
        };

        try {
            const createdChat = await Chat.create(chatData);

            const fullChat =await Chat.findOne({_id :createdChat._id}).populate(
                "users",
                "-password"
            );
            res.status(200).send(fullChat); 
            
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
            
        }
    }

});

const fetchChats = asynchandler(async (req,res)=>{
    try {
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","=password")
        .populate("latestMessage")
        .sort({updatedAt : -1})
        .then(async (results)=>{
            results = await User.populate(results,{
                path: "latestMessage.sender",
                select : "name pic email",
            });

            res.status(200).send(results);
        })
        
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
        
    }
});

const createGroupChat = asynchandler(async (req,res)=>{
    if(!req.body.name || !req.body.users){
        res.status(400).send("Please fill all the Fields");
    }
    var users = JSON.parse(req.body.users);

    if(users.length <2){
        return res.status(400).send("More than 2 users are required to create a group");
    }

    users.push(req.user);

    try {
        const groupChat =  await Chat.create({
            chatName: req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
        
    } catch (error) {
        res.status(400);
    throw new Error(error.message);
        
    }
});

const renameGroup =  asynchandler(async (req,res)=>{
    if(!req.body.chatName){
        res.status(400).send("Please fill new Name for the Group");
    }
    const { chatId , chatName} =req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new:true,
        }


    ).populate("users","-password")
    .populate("groupAdmin","-password");
    

    if(!updatedChat){
        res.status(404);
        throw new Error("Group not found");

    }else{
        res.json(updatedChat);
    }

});

const removeFromGroup = asynchandler(async (req,res)=>{
    const { chatId , userId} =req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{users : userId},
        },
        {
            new:true
        }


    )
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!removed){
        throw new Error("User not found in Group");
    }
    else{
        res.json(removed);
    }

});

const addToGroup = asynchandler(async (req,res)=>{
    const { chatId , userId} =req.body;

    const added =await  Chat.findByIdAndUpdate(
        chatId,{
            $push:{users:userId},
        },
        {
            new : true
        }

    )
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!added) {
        res.status(404);
        throw new Error("User Not Found");

    }
    else
    {
        res.json(added);
    }
    
});

module.exports = {accessChat , fetchChats ,createGroupChat , renameGroup , removeFromGroup , addToGroup};