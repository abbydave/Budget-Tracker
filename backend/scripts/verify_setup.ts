import "dotenv/config";
import mongoose, { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../src/models/User";
import { Category } from "../src/models/Category";

const verifySetup = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI not defined in .env");
        }
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not defined in .env");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // 1. Create/Find User
        const email = "test@example.com";
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                email,
                passwordHash: "hashed_placeholder",
                firstName: "Test",
                lastName: "User",
            });
            console.log("Created Test User");
        } else {
            console.log("Found Test User");
        }

        // 2. Create/Find Category
        const categoryName = "Test Expense";
        let category = await Category.findOne({ userId: user._id, name: categoryName });
        if (!category) {
            category = await Category.create({
                userId: user._id,
                name: categoryName,
                type: "expense",
            });
            console.log("Created Test Category");
        } else {
            console.log("Found Test Category");
        }

        // 3. Generate Token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("\nDATA FOR TESTING:");
        console.log(`TOKEN=${token}`);
        console.log(`CATEGORY_ID=${category._id}`);
        console.log(`USER_ID=${user._id}`);

        // AUTOMATED TESTING
        console.log("\n--- STARTING AUTOMATED ENDPOINT TESTS ---");
        const API_URL = "http://localhost:3000/api";

        // 1. POST
        console.log("\n1. Testing POST /api/transaction...");
        const createRes = await fetch(`${API_URL}/transaction`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                categoryId: category._id,
                type: "expense",
                amount: 50,
                note: "Automated Test",
                date: new Date().toISOString()
            })
        });
        const createData = await createRes.json();
        console.log(`Status: ${createRes.status}`);
        if (!createRes.ok) console.error(JSON.stringify(createData));

        if (createRes.ok && createData._id) {
            const txId = createData._id;

            // 2. GET
            console.log("\n2. Testing GET /api/transaction...");
            const getRes = await fetch(`${API_URL}/transaction`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const getData = await getRes.json();
            console.log(`Status: ${getRes.status}, Count: ${getData.length}`);

            // 3. PUT
            console.log(`\n3. Testing PUT /api/transaction/${txId}...`);
            const putRes = await fetch(`${API_URL}/transaction/${txId}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify({ amount: 100, note: "Updated Note" })
            });
            console.log(`Status: ${putRes.status}`);

            // 4. DELETE
            console.log(`\n4. Testing DELETE /api/transaction/${txId}...`);
            const delRes = await fetch(`${API_URL}/transaction/${txId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            console.log(`Status: ${delRes.status}`);
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

verifySetup();
