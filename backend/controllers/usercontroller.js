const asyncHandler = require("express-async-handler");
const User = require("../models/Usermodel");
const generateToken = require("../config/generatetoken");

const registeruser=asyncHandler(async (req,res)=>{
    const { username, email, password, pic } = req.body;
    

    if(!username || !email || !password){
        
        res.status(400);
        throw new Error("Please enter all the Fields");
    }

    const userExists = await User.findOne({email});
    
    if(userExists){
        res.status(400);
    throw new Error("User already exists");
    }

    const user = await User.create({
        username,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          pic: user.pic,
          token: generateToken(user._id),
        });
      } else {
        res.status(400);
        throw new Error("User not found");
      }
})


const authUser = asyncHandler(async (req,res)=>{
    const {email, password} =req.body;

    const user=await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
          username: user.username,
          email: user.email,
          pic: user.pic,
          token: generateToken(user._id),

        })
    }
    else{
      res.status(400);
      throw new Error("Wrong Email or password");
    }


});

const allUsers=asyncHandler(async(req,res)=>{
  const keyword = req.query.search?{
    $or:[
      {username : {$regex :req.query.search ,$options : "i" }},
      {email : {$regex :req.query.search ,$options : "i" }},
    ],
  }
  : {};

  const users = await User.find(keyword).find({_id :{$ne:req.user._id}});
  res.send(users);
});

module.exports = {registeruser,authUser, allUsers};