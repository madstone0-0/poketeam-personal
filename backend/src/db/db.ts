import postgres from "postgres";

const db = postgres({
    db: process.env.DB || "poketeam_dev",
    host: process.env.HOST || "localhost",
    pass: process.env.PASS || "password",
    user: process.env.USER || "user",
    prepare: true,
    transform: {
        undefined: null,
    },
});

export default db;
