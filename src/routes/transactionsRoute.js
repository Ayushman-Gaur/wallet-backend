import express from "express";

import { createTransaction, deleteTransaction, getSummaryByUserId, getTransactionsByUserId } from "../controllers/transactionsController.js";

const router = express.Router();

router.get("/:userId",getTransactionsByUserId);



// this is for adding a transaction
// user will send title,amount,user_id,category
router.post("/",createTransaction);

// this is for deleting a transaction by id
router.delete("/:id",deleteTransaction)
// this is for getting the summary of transactions for a user
// user will send userId in the params
router.get("/summary/:userId",getSummaryByUserId)

export default router;