import { Router, Request, Response } from "express";
import { authenticate } from "../middlewares/auth";
import { Transaction } from "../models/Transaction";
import { Types } from "mongoose";

const router = Router();


const getMonthRange = (month: string) => {
const start = new Date(`${month}-01`);
const end = new Date(start);
end.setMonth(end.getMonth() + 1);

return { start, end };
};

/* GET /api/dashboard/summary?month=2025-03 */
router.get(
"/summary",
authenticate,
async (req: Request, res: Response) => {
try {
const { month } = req.query;
const userId = req.user!.id;

if (!month || typeof month !== "string") {
return res.status(400).json({ message: "Month is required" });
}

const { start, end } = getMonthRange(month);

const transactions = await Transaction.find({
userId: new Types.ObjectId(userId),
date: { $gte: start, $lt: end }
});

let totalIncome = 0;
let totalExpense = 0;

transactions.forEach(tx => {
if (tx.type === "income") totalIncome += tx.amount;
if (tx.type === "expense") totalExpense += tx.amount;
});

res.json({
totalIncome,
totalExpense,
balance: totalIncome - totalExpense
});
} catch (error) {
res.status(500).json({ message: "Failed to load dashboard summary" });
}
}
);

/* GET /api/dashboard/categories?month=2025-03&type=expense */
router.get(
"/categories",
authenticate,
async (req: Request, res: Response) => {
try {
const { month, type } = req.query;
const userId = req.user!.id;

if (!month || !type || typeof month !== "string") {
return res.status(400).json({ message: "Month and type are required" });
}

const { start, end } = getMonthRange(month);

const breakdown = await Transaction.aggregate([
{
$match: {
userId: new Types.ObjectId(userId),
type,
date: { $gte: start, $lt: end }
}
},
{
$group: {
_id: "$categoryId",
total: { $sum: "$amount" }
}
}
]);

res.json(breakdown);
} catch (error) {
res.status(500).json({ message: "Failed to load category breakdown" });
}
}
);

/* GET /api/dashboard/trends?startDate=2025-03-01&endDate=2025-03-31 */
router.get(
"/trends",
authenticate,
async (req: Request, res: Response) => {
try {
const { startDate, endDate } = req.query;
const userId = req.user!.id;

if (!startDate || !endDate) {
return res
.status(400)
.json({ message: "Start and end dates are required" });
}

const trends = await Transaction.aggregate([
{
$match: {
userId: new Types.ObjectId(userId),
type: "expense",
date: {
$gte: new Date(startDate as string),
$lte: new Date(endDate as string)
}
}
},
{
$group: {
_id: {
$dateToString: { format: "%Y-%m-%d", date: "$date" }
},
total: { $sum: "$amount" }
}
},
{ $sort: { _id: 1 } }
]);

res.json(trends);
} catch (error) {
res.status(500).json({ message: "Failed to load spending trends" });
}
}
);

export default router;
