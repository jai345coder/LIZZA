import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import { sendVerificationEmail, emailToResetPassword } from "../services/mail.services.js";
export async function register(req, res) {
    try {
        console.log("BACKEND : checked");
        const { username, email, password, role } = req.body;

        //checking for valid inputs
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        //chack if user alredy exist s or not 
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }
        //hashing 
        const hash = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString("hex");
        //craeting new user 
        const newUser = await userModel.create({
            username,
            email,
            role,
            password: hash,
            isVerified: false,
            verificationToken,
            verificationTokenExpires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now,
        })
        //await newUser.save();

        await sendVerificationEmail(email, verificationToken);


        /**
         * @userToSend is used for hiding sensitive information like password and verificationToken and verificationTokenExpiry
         */
        const userToSend = newUser.toObject();
        delete userToSend.password;
        delete userToSend.verificationToken;
        delete userToSend.verificationTokenExpires;
        res.status(201).json({
            message: "User created successfully",
            userToSend,
        })
    } catch (err) {
        console.log("ERRROR :", err);
        return res.status(500).json({ message: "Internal server error" })
    }

}


/**
 * @verifyToekn this function is used to verify the email of the user
 * @route POST /api/auth/verify/:token
 * @param {
 *   
 * } req 
 * @param {*} res 
 * @returns 
 */

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await userModel.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: new Date() }
        });//compare data to data

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification token" });
        }

        user.isVerified = true;
        /**
         * @verificationToken remove the verification token after successful verification
         * @verificationTokenExpiry remove the verification token expiry after successful verification
         */
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.status(200).send(`
        <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #2a9d8f;">Email Verified Successfully ✅</h1>
          <p>You can now log in to your account.</p>
        </body>
      </html>
    `);
    } catch (err) {
        console.log("ERROR: ", err);
        return res.status(500).send (` <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #f60909ff;">Internal server error ❌</h1>
          <p>Internal server error</p>
        </body>
      </html> `);
    }
}






/**
 * @login :GET/api/auth/login
 * @param {string} email - The email of the user to login
 * @param {string} password - The password of the user to login
 * @returns {Promise<void> }
 */


export async function login(req, res) {
    try {
        console.log("BACKEND: CHECKED")
        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select('+password'); //password not be selected by default 
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }




        const verifyPassword = await bcrypt.compare(password, user.password);
        if (!verifyPassword) {
            return res.status(401).json({ message: "Invalid credentials" })
        }
        //DUE TO SOME ERROR IN @emailVerification this part of code in haulted */
        if (!user.isVerified) {
            return res.status(401).json({ message: "User is not verified" })
        }

        /**
         * @JWT_TOKEN : we need to generate a random token for the user to login
         * @id : This is the data you're embedding inside the token.
         * @JWT_SECRET : This is a private string (stored in your .env file, never hardcoded or committed to GitHub) that the server uses to cryptographically sign the token
         * @expiresIn : expiration claim to the token, valid for 1 day from the moment it's created.
         */

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // only secure in prod
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 24 * 60 * 60 * 1000
        });


        return res.status(200).json({ message: "User logged in successfully ✅", token, user })

    } catch (err) {
        console.log('ERROR :', err);
        return res.status(500).json({ message: "Internal server error" })
    }
}


















// /* 
//  * @route POST /api/auth/forgot-password
//  * @param {string} email - The email of the user to reset the password
//  * @returns {Promise<void>}
//  *

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;//user not able to login so he need to send an email where to send the reset pass link
        const userExist = await userModel.findOne({ email });
        if (!userExist) {
            return res.status(404).json({ message: "If that email is registered, a reset link has been sent" })
        }
        /**
         * @resetToken : we need to generate a random token for the user to reset the password
         * @resetTokenExpire : we need to generate a random token for the user to reset the password
         */
        console.log(userExist);

        const generateToken = crypto.randomBytes(32).toString("hex");
        const generateTokenExpire = new Date(Date.now() + 60 * 60 * 1000);
        //send email and token to function to send a mail to user to reset password
        await emailToResetPassword(email, generateToken);
        //updata user model with token and expiry date
        /**
         * find user with @email and update @resetToken and @resetTokenExpires
         */
        await userModel.updateOne({
            email
        }, {
            $set: {
                resetToken: generateToken,
                resetTokenExpires: generateTokenExpire
            }
        })
        res.status(200).json({ message: "Password reset email sent successfully" })

    } catch (err) {
        console.log("ERROR: ", err);
        return res.status(500).json({ message: "Internal server error" })
    }

}


/**
 * @PUT api/auth/reset-password
 * @param {string} email 
 * @param {string} new_Password
 */

export async function reset_password(req, res) {
    try {
        const token = req.params.token;
        const { newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }

        console.log("* TOKEN : ", token);
        const user = await userModel.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired token"
            });
        }

        const hashed_password = await bcrypt.hash(newPassword, 10);

        /** update the user @password and invalidate the @token */
        user.password = hashed_password;
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;

        await user.save();
        return res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (err) {
        console.log("ERROR: ", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}