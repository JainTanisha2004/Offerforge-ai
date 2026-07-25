const userModel=require('../models/user.model');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const tokenBlacklistModel=require('../models/blacklist.model');
const cookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: process.env.NODE_ENV === "production",
};
const registerUserController=async(req,res)=>{


  const {username,email,password}=req.body;

  if(!username || !email || !password){
    return res.status(400).json({message:'All fields are required'});
  }

  const userExists=await userModel.findOne({$or:[{username},{email}]});

  if(userExists){
    return res.status(400).json({message:'Username or Email already exists'});
  }

  const hash=await bcrypt.hash(password, 10);

  const user= await userModel.create({
    username,
    email,
    password:hash
  })

  const token=jwt.sign({
    id:user._id,
    username:user.username,
  }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.cookie("token", token, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 });

  res.status(201).json({
    message:'User registered successfully',
    user:{
      id:user._id,
      username:user.username,
      email:user.email
    }
  });
}

const loginUserController=async(req,res)=>{
  const {email,password}=req.body;

  const user=await userModel.findOne({email});

  if(!user){
    return res.status(400).json({message:'Invalid email or password'});
  }

  const isPasswordValid=await bcrypt.compare(password, user.password);

  if(!isPasswordValid){
    return res.status(400).json({
      message: "Invalid email or password"
    })
  }

  const token=jwt.sign({
    id:user._id,
    username:user.username,
  }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.cookie("token", token, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 });

  res.status(200).json({
    message:"User logged in successfully",
    user:{
      id:user._id,
      username:user.username,
      email:user.email
    }
  })
}

const logoutUserController = async(req,res)=>{
  const token=req.cookies.token;

  if(token){
    await tokenBlacklistModel.create({token});
  }

  res.clearCookie("token", cookieOptions);

  res.status(200).json({
    message:"User logged out successfully"
  });
}

const getMeContoller=async (req,res)=>{
  const user=await userModel.findById(req.user.id);
  res.status(200).json({
    message:"User details fetched successfully.",
    user:{
      id:user._id,
      username:user.username,
      email: user.email
    }
  })
}

module.exports={registerUserController, loginUserController,logoutUserController, getMeContoller};
