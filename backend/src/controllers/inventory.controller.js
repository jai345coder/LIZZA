import ItemModel from "../models/Item.model.js";
import jwt from 'jsonwebtoken';



/**
 * @create a new Pizza
 * @POST /api/inventory
 * @param {string} req.body.name 
 * @param {string} req.body.category
 * @param {number} req.body.price
 * @param {array} req.body.sizes
 * @param {array} req.body.toppings
 * @returns 
 */

export async function newRecipe(req, res) {
      const { name, category, img, isAvailable, description, basePrice, sizes, toppings } = req.body;

      const checkItem = await ItemModel.findOne({ name })

      if (checkItem) {
            return res.status(400).json({ message: "Item already exists" })
      }

      const newItem = new ItemModel({
            name,
            category,
            description,
            basePrice,
            sizes,
            toppings,
            img,
            isAvailable,
      })
      await newItem.save();

      return res.status(201).json({ message: "Item created successfully 🍕🍕🍕", newItem })




}

/**
 * @fetch all the menu
 * @GET /api/inventory
 * @param {string} req.body.name
 * @returns 
 */
export async function fetchMenu(req, res) {
     
      const allItems = await ItemModel.find({})
      return res.status(200).json({ message: "Items fetched successfully", allItems })
}


/**
 * @description get a single item from the menu
 * @param {string} req.params.id 
 * @returns 
 */
export async function fetchItem(req, res) {
      const { id } = req.params;
      const item = await ItemModel.findById(id);
      if (!item) {
            return res.status(404).json({ message: "Item not found" })
      }
      return res.status(200).json({ message: "Item fetched successfully", item })
}



/**
 * @description update the details of a single item from the menu
 * @param {string} req.params.id 
 * @param {string} req.body.name 
 * @param {string} req.body.category
 * @param {number} req.body.price
 * @param {array} req.body.sizes
 * @param {array} req.body.toppings
 * @returns 
 */
export async function updateItem(req, res) {
      try {
            const { id } = req.params;
            const { name, category, img, isAvailable, description, basePrice, sizes, toppings } = req.body;
            const item = await ItemModel.findByIdAndUpdate(id, req.body, { returnDocument: 'after', runValidators: true });
            if (!item) {
                  return res.status(404).json({ message: "Item not found" })
            }
            return res.status(200).json({ message: "Item updated successfully", item })
      } catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Internal server error" })
      }
}


/**
 * @description delete a single item from the menu
 * @param {string} req.params.id 
 * @returns 
 */
export async function deleteItem(req, res) {
      const { id } = req.params;
      const item = await ItemModel.findByIdAndDelete(id);
      if (!item) {
            return res.status(404).json({ message: "Item not found" })
      }
      return res.status(200).json({ message: "Item deleted successfully", item })
}


/**
 * 
 * @param {In-stock or out of stock} req 
 * @param {*} res 
 * @returns {boolean }
 */
export async function isAvailable(req, res) {
      try {
            const { id } = req.params;
            const { isAvailable } = req.body;
            const item = await ItemModel.findById(id);
            if (!item) {
                  return res.status(404).json({ message: "Item not found" })
            }
            item.isAvailable = isAvailable !== undefined ? isAvailable : !item.isAvailable;
            await item.save();
            return res.status(200).json({ message: `Item availability set to ${item.isAvailable}`, item });
      } catch (err) {
            return res.status(500).json({ message: "Error toggling availability", error: err.message });
      }
}


/**
 * @description filter the item based on the category
 * @param {string} req.params.category 
 * @returns 
 */
export async function filterItem(req, res) {
      const { category } = req.params;
      const filter = {};
      if (category) filter.category = category;
      const items = await ItemModel.find(filter);
      return res.status(200).json({ message: "Items filtered successfully", items });


}



/**
 * @add_item seend new item in inventory
 * 
 */



export async function addItem(req, res) {
      try {
            const payload = req.body;

            // support both single object and array of items
            const itemsToInsert = Array.isArray(payload) ? payload : [payload];

            for (const item of itemsToInsert) {
                  if (!item.name || !item.category || item.basePrice === undefined) {
                        return res.status(400).json({
                              message: "Each item must have name, category, and basePrice"
                        });
                  }
            }

            const createdItems = await ItemModel.insertMany(itemsToInsert);

            return res.status(201).json({
                  message: "Item(s) added successfully",
                  data: createdItems
            });
      } catch (error) {
            console.error(error);
            return res.status(500).json({
                  message: "Issue adding item(s)",
                  error: error.message
            });
      }
}



/**
 * @GET inventory/admin/item/outofstock
 * @param {input} fetch from @mongo filter items where @stock_less_than_5
 */

export async function itemOutotStocks(req ,res){
const  outStockItems = await ItemModel.find({stock:{$lt:5}}).select({"name":1,"stock":1,"_id":0})
/**
 * @$lt is used to find the items where the stock is less than 5
 * @select is used to select the  data you want to fetch 
 */
return res.status(200).json({
      message:"Items out of stock fetched successfully",
      data:outStockItems
});
}


/**
 * @description Restock all out-of-stock items (stock < 5 or unavailable).
 *              Sets stock back to 50 and marks them as available.
 * @POST /api/inventory/admin/restock-all
 * @access Private (admin only)
 */
export async function restockAllOutOfStock(req, res) {
      try {
            const result = await ItemModel.updateMany(
                  { $or: [{ stock: { $lt: 5 } }, { isAvailable: false }] },
                  { $set: { stock: 50, isAvailable: true } }
            );

            if (result.modifiedCount === 0) {
                  return res.status(200).json({
                        message: "All items are already in stock ✅",
                        modifiedCount: 0
                  });
            }

            return res.status(200).json({
                  message: `Successfully restocked ${result.modifiedCount} item(s) 📦`,
                  modifiedCount: result.modifiedCount
            });
      } catch (err) {
            console.error("Restock error:", err);
            return res.status(500).json({
                  message: "Failed to restock items",
                  error: err.message
            });
      }
}


/**
 * @description Restock all out-of-stock items via a signed token from the email link.
 *              This allows the admin to restock by simply clicking the button in the email.
 * @GET /api/inventory/admin/restock-via-email?token=xxx
 * @access Token-protected (no JWT auth needed — token is generated per email)
 */
export async function restockViaEmailToken(req, res) {
      try {
            const { token } = req.query;

            if (!token) {
                  return res.status(400).send(buildRestockHtmlPage('❌ Error', 'Missing restock token.', false));
            }

            // Verify the restock token
            let decoded;
            try {
                  decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (err) {
                  return res.status(401).send(buildRestockHtmlPage('❌ Token Expired', 'This restock link has expired or is invalid. Please wait for the next stock alert email.', false));
            }

            if (decoded.purpose !== 'restock-all') {
                  return res.status(403).send(buildRestockHtmlPage('❌ Invalid Token', 'This token is not valid for restocking.', false));
            }

            // Perform the restock
            const result = await ItemModel.updateMany(
                  { $or: [{ stock: { $lt: 5 } }, { isAvailable: false }] },
                  { $set: { stock: 50, isAvailable: true } }
            );

            if (result.modifiedCount === 0) {
                  return res.send(buildRestockHtmlPage('✅ Already In Stock', 'All items are already sufficiently stocked. No changes were made.', true));
            }

            return res.send(buildRestockHtmlPage(
                  '✅ Restocked Successfully!',
                  `${result.modifiedCount} item(s) have been restocked to 50 units and marked as available.`,
                  true
            ));
      } catch (err) {
            console.error('Restock via email error:', err);
            return res.status(500).send(buildRestockHtmlPage('❌ Server Error', 'Something went wrong. Please try again later.', false));
      }
}


/**
 * Helper to build a styled HTML response page for the email restock action
 */
function buildRestockHtmlPage(title, message, success) {
      const color = success ? '#16a34a' : '#dc2626';
      const bgGradient = success
            ? 'linear-gradient(135deg, #16a34a, #15803d)'
            : 'linear-gradient(135deg, #dc2626, #b91c1c)';
      const emoji = success ? '📦' : '⚠️';

      return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title} — Pizza App</title>
      </head>
      <body style="margin: 0; padding: 40px 20px; font-family: 'Segoe UI', Arial, sans-serif; background: #f3f4f6; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
            <div style="max-width: 480px; width: 100%; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.1); text-align: center;">
                  <div style="background: ${bgGradient}; padding: 40px 24px;">
                        <div style="font-size: 48px; margin-bottom: 12px;">${emoji}</div>
                        <h1 style="color: #fff; margin: 0; font-size: 22px; font-weight: 700;">${title}</h1>
                  </div>
                  <div style="padding: 32px 24px;">
                        <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0;">${message}</p>
                  </div>
                  <div style="background: #f9fafb; padding: 16px 24px; border-top: 1px solid #eee;">
                        <p style="color: #9ca3af; font-size: 12px; margin: 0;">Pizza App Inventory System</p>
                  </div>
            </div>
      </body>
      </html>
      `;
}
