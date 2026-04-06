const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
//mongoose.connect("mongodb+srv://adityasaahu_db_user:bCEE3vX32p7SA0fj@etech.4tjktih.mongodb.net/?appName=Etech")
//mongoose.connect("mongodb://localhost:27017/mydb")
mongoose.connect("mongodb+srv://adityasaahu_db_user:bCEE3vX32p7SA0fj@etech.4tjktih.mongodb.net/mydb?appName=Etech")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// --- User Schema & Model ---
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

// --- Routes ---

// Health check
app.get("/", (req, res) => {
    res.json({ message: "User Auth API running ", status: "OK" });
});

// POST /api/register — Save new user
app.post("/api/register", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if email already exists
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ error: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ fullName, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully ", userId: user._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// POST /api/login — Verify user credentials
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        res.json({ message: "Login successful ✅", userId: user._id, fullName: user.fullName });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// GET /api/users — List all registered users (debug/admin)
app.get("/api/users", async (req, res) => {
    const users = await User.find({}, { password: 0 }); // never return passwords
    if (users.length === 0) {
        return res.status(404).json({ error: "No users found" });
    }
    res.json(users);
});

// Start server on port 5002 (5000 is used by cart server)
app.listen(5002, () => {
    console.log("\n  User Auth Server running at http://localhost:5002");
    console.log("  Endpoints:");
    console.log("  POST   http://localhost:5002/api/register");
    console.log("  POST   http://localhost:5002/api/login");
    console.log("  GET    http://localhost:5002/api/users");
});