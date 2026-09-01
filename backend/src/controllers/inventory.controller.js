import ItemModel from "../models/Item.model.js";



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
























