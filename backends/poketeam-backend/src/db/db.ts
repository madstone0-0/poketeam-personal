import postgres from "postgres";

const db = postgres({
    db: "poketeam",
    host: "localhost",
    pass: "",
    user: "postgres",
});

export default db;
