import express, { NextFunction, Request, Response } from "express"
import authRouter from "./routes/auth"
import categoryRouter from "./routes/category"
import transactionRouter from "./routes/transaction"
import budgetRouter from "./routes/budget"
import dashboardRouter from "./routes/dashboard"

const app = express();

app.use(express.json());

app.get("/api", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Budget Tracker API!",
        data: null
    })
});

app.use("/api/auth", authRouter)
app.use("/api/category", categoryRouter)
app.use("/api/transaction", transactionRouter)
app.use("/api/budget", budgetRouter)
app.use("/api/dashboard", dashboardRouter)

app.use((req: Request, res: Response) => {
    const url = req.url
    res.status(404).json({
        success: false,
        message: `Endpoints "${url}" does not exist`,
        data: null
    })
})




export default app