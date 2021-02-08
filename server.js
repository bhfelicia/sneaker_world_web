const { client, syncAndSeed } = require("./db");
const express = require("express");
const path = require("path");
const html = require("html-template-tag");

const app = express();

app.use(express.static(path.join(__dirname, "/assets")));

app.get("/", async (req, res, next) => {
  try {
    const response = await client.query(`SELECT * FROM brand;`);
    const brands = response.rows;
    res.send(html`<!DOCTYPE html>
      <html>
        <head>
          <link rel="stylesheet" href="styles.css" />
        </head>
        <body>
          <h1>Sneaker World</h1>
          <h2>Brands:</h2>
          <ul>
            ${brands.map(
              (brand) => `
    <li>
    <a href='/brands/${brand.id}'>
    ${brand.name}
    </a>
    </li>`
            )}
          </ul>
        </body>
      </html> `);
  } catch (error) {
    next(error);
  }
});

const port = process.env.PORT || 3000;

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
