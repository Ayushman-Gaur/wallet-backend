import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
    try{
        const {userId}=req.params;
        

        const transactions = await sql`
            SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
        `
        res.status(200).json(transactions);
    }catch(error){
        console.log("Error creating the transaction for a user",error)
        res.status(500).json({message:"Internal server error"});
    }
}


export async function createTransaction(req,res){
    // user will send title,amount,user_id
    try{
        const {title,amount,category,user_id}=req.body;
        if(!title || !user_id || !category || amount===undefined){
            return res.status(400).json({message:"All field are required"});
        }
        const transaction =await sql`
        INSERT INTO transactions(user_id,title,amount,category)
        VALUES(${user_id},${title},${amount},${category})
        RETURNING *
        `
        console.log(transaction)
        res.status(201).json(transaction[0]);
    }catch(error){
        console.log("Error creating the transaction",error)
        res.status(500).json({message:"Internal server error"});
    }
}


export async function deleteTransaction(req,res){
    try{
        const {id}= req.params;
        if(isNaN(parseInt(id))){
            return res.status(400).json({message:"Transaction ID is invalid"});
        }

        const result=await sql`
            DELETE FROM transactions WHERE id =${id} RETURNING *
        `;
        if(result.length==0){
            return res.status(404).json({message:"Transaction not found"});
        }
        res.status(200).json({message:"Transaction deleted successfully"});

    }catch(error){
        console.log("Error deleting the transaction",error)
        res.status(500).json({message:"Internal server error"});
    }
}

export async function getSummaryByUserId(req,res){
    try{
        const {userId}=req.params;
        const balanceResult= await sql`
            SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}
        `
        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0
        `
        const expensesResult = await sql`
            SELECT COALESCE(SUM(amount), 0) AS expenses FROM transactions WHERE user_id = ${userId} AND amount < 0
        `

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expensesResult[0].expenses
        });
    }catch(error){
        console.log("Error getting the transaction summary",error)
        res.status(500).json({message:"Internal server error"});
    }
}
