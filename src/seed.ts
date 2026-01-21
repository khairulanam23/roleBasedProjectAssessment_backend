import bcrypt from "bcryptjs";
import User from "./models/User";
import connectDB from "./config/db";

const seed = async () => {
  await connectDB();
  const email = "admin@example.com";
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash("adminpassword", 10);
  const admin = new User({
    name: "Admin User",
    email,
    password: hashedPassword,
    role: "ADMIN",
    status: "ACTIVE",
  });
  await admin.save();
  console.log("Admin user seeded");
  process.exit(0);
};

seed().catch((err) => console.error(err));
