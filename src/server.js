import express from "express";
import dotenv from "dotenv";
import { initDB} from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js";

dotenv.config();
const app = express();

if (process.env.NODE_ENV === "production") job.start(); // Start the cron job


// middleware express.js
app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 5001;



app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

// this is for initializing the database
// it will create a table if it does not exist



// this is for getting all the transactions of a user
// user will send userId in the params

app.use("/api/transactions",transactionsRoute);


initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is up and running on PORT:", PORT);
    });
})