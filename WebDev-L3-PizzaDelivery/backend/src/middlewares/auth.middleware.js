import dotenv from "dotenv";
dotenv.config();
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js'

/**
 * @userAuthentication
 * @description:authenticate the user
 * @param {string} req.cookies.token
 * @param {string} req.header.authorization
 * @returns { 
 *    if(token found){ 
 *      return res.status(200).json({message:"Authorized",user})
 *    }else{
 *      return res.status(401).json({message:"Unauthorized"})
 *    }
 * }
 */
export async function userAuthentication(req ,res ,next){
      
      const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1]; 
      //console.log("🚀 ~ file: auth.middleware.js:21 ~ userAuthentication ~ token:", token) // Bearer <token>
      if(!token){
            return res.status(401).json({message:"Unauthorized"})
      }
      try {
            const decoded = jwt.verify(token , process.env.JWT_SECRET)
            if(!decoded){
                  return res.status(401).json({message:"Unauthorized"})
            }
            const user = await userModel.findById(decoded.id)
            if(!user){
                  return res.status(404).json({message:"User not found"})
            }
            req.user = user;
            next();
            
      } catch (err) {
            console.log("ERROR ⚠️: ",err);
            return res.status(401).json({message:"Unauthorized"})
      }
}