import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const db = postgres(process.env.DATABASE_URL || "postgres://USER:PASS@localhost:5432/poketeam ", {
    ssl: false,
    prepare: true,
    transform: {
        undefined: null,
    },
});

export default db;
