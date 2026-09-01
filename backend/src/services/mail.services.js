import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_HOST_PASSWORD
  }
});

// Verify the connection configuration
/**
 * @transporter is used to transfer mail request to @smtp_Servers which are 
 * responsible for emails sent to the user's mail feed, using @transporter 
 * as the bridge between the @web_Server and the @smtp_server
 */
transporter.verify()
  .then(() => {
    console.log("Email transport is ready to send emails📬");
  })
  .catch((err) => {
    console.log("Email transporter verification failed");
    console.log(err);
  });






  
/**
 * @sendVerificationEmail  this function is used to send verification email to the user
 * @param {string} email - The email of the user to send the verification email to
 * @param {string} token - The verification token to send to the user
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = async (email, token) => {
  try {
    const verifyUrl = `${process.env.CLIENT_URL}/api/auth/verify-email/${token}`;

    await transporter.sendMail({
      from: `"Pizza App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `
        <h2>Email Verification</h2>
        <p>Click the link below to verify your account:</p>
        <a href="${verifyUrl}">Verify Email</a>
        <p>This link expires in 1 hour.</p>
      `
    });

    console.log("verifyUrl: ", verifyUrl);
    console.log("EMAIL SENT SUCCESSFULLY...");
  } catch (err) {
    console.log("ERROR ⚠️ : ", err.message);
  }
};


/**
 * outofStockReminderEmail for @Adminisrator
 * @param {string} email- email address of the admin
 * @param {string} verification token
 */

export const outOfStock_Reminder_Email = async (email , items)=>{
  try{
   // const supplyUrl = "";



    await transporter.sendMail({
       from: `"Pizza App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "ITEM SUPPLY OUT OF STOCK",

    })
  }catch(err){
    console.log("ERROR ⚠️ : ", err.message);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message
    })
  }
}









/**
 * @emailToResetPassword This function is used to send password reset email to the user
 * @param {string} email - The email of the user to send the password reset email to
 * @param {string} token - The password reset token to send to the user
 * @returns {Promise<void>}
 */


export const emailToResetPassword = async (email , token)=>{
    /**
     * @resetUrl is used to store the reset password url using env variable CLIENT_URL
     * @token to verify user
     * @CLIENT_URL : base url
     */
    const clientUrl = process.env.CLIENT_URL && !process.env.CLIENT_URL.includes('3000') 
        ? process.env.CLIENT_URL 
        : 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${token}`;

    await transporter.sendMail({
        from:`Pizza App <${process.env.EMAIL_USER}`,
        to:email,
        subject:`Reset Your Password`,
        html:`
            <h2>Reset Password</h2>
            <p>Click the link below to reset your password:</p>
            <a href=${resetUrl}>Reset Password</a>
            <p>This link expires in 1 hour.</p>
        `
    });
};