import postgres from "postgres";

const db = postgres({
    db: "poketeam",
    host: "localhost",
    pass: "pass",
    user: "postgres",
    prepare: true,
    transform: {
        undefined: null,
    },
});

export default db;
