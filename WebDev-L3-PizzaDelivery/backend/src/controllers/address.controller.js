import AddressModel from "../models/Address.model.js";


/**
 * @add a new address
 * @param {string} req.body.user 
 * @param {string} req.body.fullAddress
 * @param {string} req.body.city
 * @param {string} req.body.pincode
 * @param {string} req.body.phone
 * @param {boolean} req.body.isDefault
 * @returns 
 */
export async function addAddress(req, res) {
      try {
            const userID = req.user._id;
            const { label, fullAddress, city, pincode, phone, isDefault } = req.body;

            // if (!userID || !fullAddress || !city || !pincode || !phone) {
            //       return res.status(400).json({ message: "All fields are required" });
            // }

            const existingAddress = await AddressModel.findOne({ userID, fullAddress, city, pincode, phone, isDefault });

            if (existingAddress) {
                  return res.status(400).json({ message: "Address already exists" });
            }
            const newAddress = await AddressModel.create({
                  userID,
                  label,
                  fullAddress,
                  city,
                  pincode,
                  phone,
                  isDefault
            })
            //await newAddress.save();
            return res.status(201).json({
                  message: "Address added successfully",
                  newAddress
            });
      } catch (err) {
            console.log("ERROR ⚠️: ", err);
            return res.status(500).json({ message: "Internal server error" })
      }
}


/**
 * @get all the addresses of a user
 * @param {string} req.params.user 
 * @returns 
 */
export async function getALLAddress(req, res) {
      try {
            const userID = req.user._id || req.user.id;

            if (!userID) {
                  return res.status(400).json({ message: "User ID is required" });
            }

            const allAddress = await AddressModel.find({ userID });
            return res.status(200).json({ message: "Addresses fetched successfully", addresses: allAddress });
      } catch (err) {
            console.log("ERROR ⚠️: ", err);
            return res.status(500).json({ message: "Internal server error" });
      }
}


/**
 * @get a single address
 * @param {string} req.params.id    
 * @returns 
 */
export async function getAddress(req, res) {
      try {
            const addressId = req.params.id;
            const userId = req.user._id || req.user.id; // from auth middleware

            const address = await AddressModel.findOne({ _id: addressId, userID: userId });

            if (!address) {
                  return res.status(404).json({ message: 'Address not found or not yours' });
            }

            return res.status(200).json({ message: "Address fetched successfully", address });
      } catch (err) {
            console.log("ERROR ⚠️: ", err);
            return res.status(500).json({ message: "Internal server error" })
      }
}



/**
 * @update an address
 * @param {string} req.params.id 
 * @param {string} req.body.fullAddress
 * @param {string} req.body.city
 * @param {string} req.body.pincode
 * @param {string} req.body.phone
 * @param {boolean} req.body.isDefault
 * @returns 
 */


export async function updateAddress(req, res) {
      try {
            const addressID = req.params.id;
            let userID = req.user._id || req.user.id;
            const { fullAddress, city, pincode, phone, isDefault } = req.body;

            if (!addressID) {
                  return res.status(400).json({ message: "Address ID is required" });
            }

            const address = await AddressModel.findOneAndUpdate(
                  { _id: addressID, userID: userID },
                  { fullAddress, city, pincode, phone, isDefault },
                  { returnDocument: 'after', runValidators: true }
            );
            if (!address) {
                  return res.status(404).json({ message: "Address not found or not yours" });
            }
            return res.status(200).json({ message: "Address updated successfully", address });
      } catch (err) {
            console.log("ERROR ⚠️: ", err);
            return res.status(500).json({ message: "Internal server error" });
      }
}



/**
 * @mark an address as default
 * @param {string} req.params.id 
 * @returns 
 */
export async function markDefaultAddress(req, res) {
      try {
            const addressID = req.params.id;
            const userID = req.user._id || req.user.id;
            
            if (!addressID) {
                  return res.status(400).json({ message: "Address ID is required" });
            }


            const address = await AddressModel.findOneAndUpdate(
                  { _id: addressID, userID: userID },
                  { isDefault: true },
                  { returnDocument: 'after', runValidators: true }
            );
            if (!address) {
                  return res.status(404).json({ message: "Address not found or not yours" });
            }
            return res.status(200).json({ message: "Address marked as default successfully", address });
      } catch (err) {
            console.log("ERROR ⚠️: ", err);
            return res.status(500).json({ message: "Internal server error" });
      }
}
