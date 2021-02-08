const pg = require("pg");
const express = require("express");

const app = express();

app.get("/", async (req, res, next) => {
  try {
    const response = await client.query(`SELECT * FROM brand;`);
    const brands = response.rows;
    res.send(`
    <html>
    <head>
    </head>
    <body>
    <h1>Sneaker World</h1>
    <ul>
    ${brands
      .map(
        (brand) => `
    <li>
    <a href='/brands/${brand.id}'>
    ${brand.name}
    </a>
    </li>`
      )
      .join("")}
    </ul>
    </body>
    </html>
    `);
  } catch (error) {
    next(error);
  }
});

const port = process.env.PORT || 3000;

const client = new pg.Client("postgres://localhost/sneaker_world_db");

const syncAndSeed = async () => {
  const SQL = `

  DROP TABLE IF EXISTS sneaker;
  DROP TABLE IF EXISTS brand;
  CREATE TABLE brand(
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL
  );
  CREATE TABLE sneaker(
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand_id INTEGER REFERENCES brand(id)
  );
  INSERT INTO brand(id, name) VALUES(1, 'Nike');
  INSERT INTO brand(id, name) VALUES(2, 'Converse');
  INSERT INTO brand(id, name) VALUES(3, 'Adidas');
  INSERT INTO sneaker(id, name, brand_id) VALUES(1, 'Air Jordan', 1);
  INSERT INTO sneaker(id, name, brand_id) VALUES(2, 'Air Max', 1);
  INSERT INTO sneaker(id, name, brand_id) VALUES(3, 'Chuck Taylor', 2);
  INSERT INTO sneaker(id, name, brand_id) VALUES(4, 'One Star', 2);
  INSERT INTO sneaker(id, name, brand_id) VALUES(5, 'Air Max', 1);
  INSERT INTO sneaker(id, name, brand_id) VALUES(6, 'Air Max', 1);
  `;
  await client.query(SQL);
};

const setUp = async () => {
  try {
    await client.connect();
    await syncAndSeed();
    console.log("connect to db");
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
setUp();
