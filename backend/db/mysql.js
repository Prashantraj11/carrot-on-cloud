import "dotenv/config";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "insha",
    database: "carrot",
    port:"3306",
});


// 🔥 HARD PROOF TEST
const conn = await pool.getConnection();
console.log("✅ MySQL connected to DB:", conn.config.database);
conn.release();


export default pool;
