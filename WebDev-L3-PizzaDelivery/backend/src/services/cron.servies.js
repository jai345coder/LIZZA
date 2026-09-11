import cron from 'node-cron'
import ItemModel from '../models/Item.model.js'
// z
import { outOfStock_Reminder_Email } from './mail.services.js';

const checkOut_outOfStock = async () => {
      try {
            console.log("⏰ Running cron task: Checking out-of-stock items...");

            // find items out of stock or low stock (< 5 or unavailable)
            const OutOfStockItm = await ItemModel.find({
                  $or: [
                        { stock: { $lt: 5 } },
                        { isAvailable: false }
                  ]
            });

            if (OutOfStockItm.length > 0) {
                  console.log(`⚠️ Found ${OutOfStockItm.length} out-of-stock item(s). Sending email to admin...`)
                  /**
                   * send a mail to @admin using @outOfStock_Reminder_Email
                   */
                  const adminEmail = process.env.ADMIN_EMAIL || "prashanttiwari5738@gmail.com";
                  const itemsList_OOS = OutOfStockItm.map(item => item.name).join(",");//OOS --> out of stock

                  /**  send the mail to @ADMIN  */
                  await outOfStock_Reminder_Email(adminEmail, itemsList_OOS);

            } else {
                  console.log("✅ All items have sufficient stock.")
            }
      } catch (err) {
            console.log("ERROR :", err);
      }
}





/**
 * @setCronJOBS --> set a function add the @jobs to be done at poinyt of completing the time cyclegiven jobs are excuted repeatdly
 * 
 */

export const initCronJOBS = () => {
      cron.schedule('*/15 * * * *', async () => {
            console.log("\n🔔 [CRON TRIGGERED] Executing scheduled maintenance jobs...")

            //excute @jobs
            await Promise.all([
                  checkOut_outOfStock()
            ]);
            console.log("✅ [CRON FINISHED] Maintenance complete.\n");
      });
      console.log("🚀 Scheduled jobs initialized (Running every 15 minutes).");

}

