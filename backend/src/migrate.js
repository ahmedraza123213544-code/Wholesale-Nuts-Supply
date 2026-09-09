import { pool } from "./db.js";
import { migrate } from "./migrate-lib.js";

migrate()
  .then(async () => {
    console.log("Database migrated successfully.");
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await pool.end();
    process.exit(1);
  });
