import express from "express";
import { addAddress ,  getALLAddress , getAddress , updateAddress , markDefaultAddress} from "../controllers/address.controller.js";
const router = express.Router();




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
router.post("/add-address/:userID", addAddress);

/**
 * @get all the addresses of a user
 * @param {string} req.params.user +
 * @returns 
 */
router.get("/get-all-address/:userID", getALLAddress);

/**
 * @get a single address
 * @param {string} req.params.id 
 * @returns 
 */
router.get("/get-address/:id", getAddress);

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
router.put("/update-address/:id", updateAddress);

/**
 * @mark an address as default
 * @param {string} req.params.id 
 * @returns 
 */
router.put("/mark-default-address/:id", markDefaultAddress);


export default router;