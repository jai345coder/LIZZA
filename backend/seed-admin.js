

/**
 * @seed_admin_js
 * 
 * One-time script to create the admin account. This is NEVER exposed
 * as an @authorAPI endpoint — it's run manually from the terminal, once,
 * outside the live server. This satisfies the task requirement:
 ** @"Separate admin login (not accessible from the user registration flow)"
 *
 * Run with: node seed-admin.js
 */

import dotenv from "dotenv";
dotenv.config();
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import userModel from "./src/models/user.model.js"; // adjust path if different

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@pizzaapp.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin4657";
const ADMIN_USERNAME = "admin";

async function seedAdmin() {
  try {
    // ── Step 1: Connect to MongoDB ──────────────────────────────
    await mongoose.connect(process.env.MONGODB_URL); // adjust env var name if different
    console.log("🟢 Connected to MongoDB");

    // ── Step 2: Check if an admin already exists ────────────────
    // Prevents creating duplicate admin accounts if this script
    // accidentally gets run more than once.
    const existingAdmin = await userModel.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log("⚠️  Admin account already exists with this email. Aborting.");
      await mongoose.disconnect();
      return;
    }

    // ── Step 3: Hash the password ────────────────────────────────
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // ── Step 4: Create the admin user ────────────────────────────
    const admin = await userModel.create({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      isVerified: true // skip email verification for the admin account
    });

    console.log("✅ Admin account created successfully:");
    console.log("   Email:", admin.email);
    console.log("   Role:", admin.role);
    console.log("⚠️  Store the password securely — it will not be shown again.");

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.log("❌ ERROR seeding admin:", err);
    await mongoose.disconnect();
  }
}

seedAdmin();