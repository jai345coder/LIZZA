import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

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
    const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';

    // Generate a signed restock token (expires in 24 hours)
    const restockToken = jwt.sign(
      { purpose: 'restock-all' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    const restockUrl = `${serverUrl}/api/inventory/admin/restock-via-email?token=${restockToken}`;

    // items is a comma-separated string of item names
    const itemNames = items.split(',').map(name => name.trim()).filter(Boolean);

    const itemRows = itemNames.map(name =>
      `<tr>
        <td style="padding: 10px 16px; border-bottom: 1px solid #eee; color: #333;">${name}</td>
        <td style="padding: 10px 16px; border-bottom: 1px solid #eee; text-align: center;">
          <span style="background: #fee2e2; color: #dc2626; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">Low / Out</span>
        </td>
      </tr>`
    ).join('');

    await transporter.sendMail({
       from: `"Pizza App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "⚠️ ITEM SUPPLY OUT OF STOCK — Action Required",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 32px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">🚨 Stock Alert</h1>
            <p style="color: #fecaca; margin: 8px 0 0; font-size: 14px;">Some items need restocking urgently</p>
          </div>

          <!-- Body -->
          <div style="padding: 24px;">
            <p style="color: #555; font-size: 15px; margin: 0 0 20px;">
              The following <strong>${itemNames.length}</strong> item(s) are <strong style="color: #dc2626;">out of stock</strong> or running critically low:
            </p>

            <!-- Items Table -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background: #f9fafb;">
                  <th style="padding: 12px 16px; text-align: left; font-size: 13px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Item Name</th>
                  <th style="padding: 12px 16px; text-align: center; font-size: 13px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>

            <!-- Restock Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="${restockUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #16a34a, #15803d); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-size: 16px; font-weight: 700; letter-spacing: 0.3px; box-shadow: 0 4px 14px rgba(22,163,74,0.4);">
                📦 Restock All Items
              </a>
              <p style="color: #9ca3af; font-size: 12px; margin: 12px 0 0;">Click the button above to restock all out-of-stock items (sets stock to 50)</p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 16px 24px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">Pizza App Inventory System • Automated Alert</p>
          </div>
        </div>
      `
    })

    console.log(`✅ Out-of-stock reminder email sent to ${email}`);
  }catch(err){
    console.log("ERROR ⚠️ : ", err.message);
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