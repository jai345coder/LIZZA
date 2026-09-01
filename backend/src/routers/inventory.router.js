import express from "express";
import { newRecipe, addItem, fetchMenu, itemOutotStocks ,  fetchItem, updateItem, deleteItem, isAvailable, filterItem } from "../controllers/inventory.controller.js";
import { adminOnlyMiddleware } from "../middlewares/adminOnly.middleware.js";
import { userAuthentication } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * POST /api/inventory/admin/add-item
 * @description Create a new pizza/menu item
 * @access Private (admin only)
 */
router.post("/admin/add-item", userAuthentication, adminOnlyMiddleware, newRecipe);

/**
 * PATCH /api/inventory/:id/available
 * @description Toggle whether an item is available for ordering
 * @access Private (admin only)
 */
router.patch("/:id/available", userAuthentication, adminOnlyMiddleware, isAvailable);

/**
 * GET /api/inventory/fetch-menu
 * @description Fetch the full menu — accessible to any user
 * @access Public / Authenticated
 */
router.get("/fetch-menu", fetchMenu);

/**
 * GET /api/inventory/fetch-item/:id
 * @description Fetch a single item's details
 * @access Public / Authenticated
 */
router.get("/fetch-item/:id", fetchItem);

/**
 * PUT /api/inventory/admin/update-item/:id
 * @description Update an existing item's details
 * @access Private (admin only)
 */
router.put("/admin/update-item/:id", userAuthentication, adminOnlyMiddleware, updateItem);

/**
 * DELETE /api/inventory/delete-item/:id
 * @description Delete a menu item
 * @access Private (admin only)
 */
router.delete("/delete-item/:id", userAuthentication, adminOnlyMiddleware, deleteItem);

/**
 * GET /api/inventory/category/:category
 * @description Filter menu items by category (PIZZA, Sides, DRINKS, DESSERTS)
 */
router.get("/category/:category", filterItem);

/**
 * POST /api/inventory/seed-item
 * @description One-time/bulk seeding of inventory items
 * @access Private (admin only)
 */
router.post("/admin/seed-item", userAuthentication, adminOnlyMiddleware, addItem);




/**
 * @GET inventory/admin/items/out-stock
 */

router.get("/admin/items/out-stock", userAuthentication , adminOnlyMiddleware , itemOutotStocks);
export default router;