import pool from "./mysql.js";
import getDateForContest from "../cal.js";

export async function pushContestData(contestId) {

    const contestData = await getDateForContest(contestId);


    const sql = `
    INSERT INTO contest_results
      (contest_id, handle, performance, delta, rating)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      performance = VALUES(performance),
      delta       = VALUES(delta),
      rating      = VALUES(rating)
  `;

    for (const user of contestData) {
        try {
            const [res] = await pool.execute(sql, [
                contestId,
                user.handle,
                user.performance,
                user.delta,
                user.rating || null
            ]);

            console.log(
                user.handle,
                "affected:", res.affectedRows,
                "changed:", res.changedRows
            );

        } catch (err) {
            console.error("❌ SQL ERROR for user:", user.handle);
            console.error("code:", err.code);
            console.error("errno:", err.errno);
            console.error("sqlState:", err.sqlState);
            console.error("sqlMessage:", err.sqlMessage);
            console.error("query:", err.sql);
            console.error("params:", [
                contestId,
                user.handle,
                user.performance,
                user.delta,
                user.rating
            ]);

            throw err; // rethrow so you don't silently ignore corruption
        }
    }

}
// await pushContestData(2176);

async function contestNeedsRefresh(contestId) {

    const [rows] = await pool.execute(
        `
        SELECT MAX(updated_at) AS last_update
        FROM contest_results
        WHERE contest_id = ?
        `,
        [contestId]
    );


    const lastUpdate = rows[0].last_update;
    if (!lastUpdate) {
        return true; // no data → must fetch
    }

    const diffMs = Date.now() - new Date(lastUpdate).getTime();

    const fiveMinutes = 5 * 60 * 1000;
    const tenHours = 10 * 60 * 60 * 1000;

    return fiveMinutes<diffMs  && diffMs <= tenHours;
}


// Do the query
export async function queryContestResults(contestID, userList) {

    if (!userList || userList.length === 0) {
        return [];
    }

    if(await contestNeedsRefresh(contestID)){
        await pushContestData(contestID);
    }


    const placeholders = userList.map(() => "?").join(",");

    const sql = `
        SELECT *
        FROM contest_results
        WHERE contest_id = ?
          AND handle IN (${placeholders})
    `;

    const [rows] = await pool.execute(sql, [
        contestID,
        ...userList
    ]);

    return rows;
}

// const queryList={
//     contestID:2176,
//     userList:["zzuqy","zz2745518585","zzzzzzzz"]
// }
// const ans=await queryData(queryList);
// console.log(ans)
