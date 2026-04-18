import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/userModels.js";

// Load environment variables
dotenv.config();

const migratePasswords = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://127.0.0.1:27017/placementDB");
    console.log("Connected to MongoDB");

    // Find all users with plain text passwords
    const users = await User.find({});
    console.log(`Found ${users.length} users to migrate`);

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of users) {
      try {
        // Check if password is already hashed (bcrypt hashes start with $2a$ or $2b$)
        if (user.password && (user.password.startsWith("$2a$") || user.password.startsWith("$2b$"))) {
          console.log(`Skipping user ${user.userName} - password already hashed`);
          skipped++;
          continue;
        }

        // Hash the plain text password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        // Update the user with the hashed password
        user.password = hashedPassword;
        await user.save();

        console.log(`Migrated password for user: ${user.userName} (${user.registerNo || user.mobileNo})`);
        migrated++;
      } catch (err) {
        console.error(`Error migrating user ${user.userName}:`, err.message);
        errors++;
      }
    }

    console.log("\n=== Migration Summary ===");
    console.log(`Total users: ${users.length}`);
    console.log(`Migrated: ${migrated}`);
    console.log(`Skipped (already hashed): ${skipped}`);
    console.log(`Errors: ${errors}`);
    console.log("========================\n");

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

// Run the migration
migratePasswords();
