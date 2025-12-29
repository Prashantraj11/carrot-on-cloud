import "dotenv/config";
import express from "express";
import {queryContestResults} from "./db/db.js";
import cors from "cors";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is working"
    });
});

app.post("/contest", async (req, res) => {
    // if (!req.body) {
    //     return res.status(400).json({ error: "Missing request body" });
    // }
    let { contestId, userList } = req.body;

    // if (contestId === undefined) {
    //     return res.status(400).json({ error: "Missing contestId" });
    // }

    // contestId → number
    // users → array
    userList = userList.map(u => u.trim());


    try {
        const data = await queryContestResults(contestId, userList);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});



app.listen(3000);
