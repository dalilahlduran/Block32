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

server.use(express.json());
server.use(require("morgan")("dev"));

server.get("/api/flavors", async (req, res, next) => {
    try {
        const SQL = `SELECT * from Flavor ORDER BY created_at DESC;`;
        const response = await client.query(SQL);
        res.send(response.rows);
    } catch (err) {
        next(err);
    }
});

server.post("/api/flavors", async (req, res, next) => {
    try {
        const { name, is_favorite } = req.body;
        const SQL = `INSERT into Flavors (name, is_favorite) VALUES ($1, $2) RETURNING *;`;
        const response = await client.query(SQL, [name, is_favorite]);
        res.status(201).send(response.rows[0]);
    } catch (err) {
        next(err);
    }
});

server.put("/api/flavors/:id", async (req, res, next) => {
    try {
        const { name, is_favorite } = req.body;
        if (!name && !is_favorite){
            return res
            .status(400)
            .send({ message: "Please edit the name or favorite status"});
        }

        let SQL = ``;
        let response = ``;

        if  (name && is_favorite){
            SQL = `UPDATE Flavor
            SET name=$1, is_favorite=$2, updated_at=now()
            WHERE id=$3 RETURNING *`;

            response = await client.query(SQL, [name, is_favorite, req.params.id]);
        } else if (!name){
            SQL = `UPDATE Flavor
            SET is_favorite=$1, updated_at=now()
            WHERE id=$1 RETURNING *`;

            response = await client.query(SQL, [is_favorite, req.params.id]);
        } else {
            SQL = `UPDATE Flavor
            SET name=$1, updated_at=now()
            WHERE id=$1 RETURNING *`;

            response = await client.query(SQL, [name, req.params.id]);
        }
        res.send(response.rows[0]);
    } catch (err) {
        next(err);
    }
});

server.delete("/api/flavors/:id", async (req, res, next) => {
    try {
        const SQL = `DELETE from Flavor WHERE id=$1`;
        const response = await client.query(SQL, [req.params.id]);
        res.sendStatus(204);
    } catch (err) {
        next(err);        
    }
});