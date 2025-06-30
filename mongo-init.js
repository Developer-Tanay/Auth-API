// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Get environment variables with fallbacks for development
const dbName = process.env.MONGO_INITDB_DATABASE || "auth_db";
const username = process.env.MONGODB_USERNAME || "auth_user";
const password = process.env.MONGODB_PASSWORD || "auth_password";

// Switch to the auth database
db = db.getSiblingDB(dbName);

// Create the auth user with read/write permissions
db.createUser({
  user: username,
  pwd: password,
  roles: [
    {
      role: "readWrite",
      db: dbName,
    },
  ],
});

// Create initial collections (optional)
db.createCollection("users");
db.createCollection("sessions");

// Add indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ verificationToken: 1 });
db.users.createIndex({ resetPasswordToken: 1 });
db.users.createIndex({ createdAt: 1 });

print("Database initialization completed successfully!");
