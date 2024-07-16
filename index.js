const pg = require('pg')
const express = require('express')
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_ice_cream')
const app = express();

const init = async () => {
    await client.connect();
    console.log("connected to database");

    let SQL = `DROP TABLE IF EXISTS note; CREATE TABLE notes(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        is_favorite BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
    );`;

    await client.query(SQL);
    console.log("tables created");

    SQL = ``

    await client.query(SQL);
    console.log("data seeded");

    const port = process.env.PORT || 3000;
    server.listen(port, () => console.log(`listening on port ${port}`));
};

init();