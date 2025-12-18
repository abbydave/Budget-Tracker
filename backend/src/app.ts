import express, { Request, Response } from "express"
import cors from "cors"

import authRouter from "./routes/auth.router"
import categoryRouter from "./routes/category.router"
import transactionRouter from "./routes/transaction.router"
import budgetRouter from "./routes/budget.router"
import dashboardRouter from "./routes/dashboard.router"
import profileRouter from "./routes/profile.router"

const app = express();

app.use(cors())

app.use(express.json());

app.get("/api", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Budget Tracker API!",
        data: null
    })
});

app.use("/api/auth", authRouter)
app.use("/api/categories", categoryRouter)
app.use("/api/transactions", transactionRouter)
app.use("/api/budgets", budgetRouter)
app.use("/api/dashboard", dashboardRouter)
app.use("/api/profile", profileRouter)

app.use((req: Request, res: Response) => {
    const url = req.url
    res.status(404).json({
        success: false,
        message: `Endpoints "${url}" does not exist`,
        data: null
    })
})




export default app