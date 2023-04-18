const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dbserices = require("./db.js");
const db = dbserices.createDbConnection();
const { checkToken } = require("./functions/checkToken");
const { createToken } = require("./functions/createToken");
/*
const goods = [
  { name: "Test 1", description: "Some description", price: 12.0 },
  { name: "Test 2", description: "Some description", price: 2.0 },
  { name: "Test 3", description: "Some description", price: 1.0 },
  { name: "Test 4", description: "Some description", price: 32.0 },
  { name: "Test 5", description: "Some description", price: 1.0 },
  { name: "Test 6", description: "Some description", price: 0.5 },
];
*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send({ message: "hi" });
});

/*
function checkUserDb(email) {
  let users = [];

  db.each(
    `SELECT * FROM users WHERE email == (?)`,
    [email],
    function (error, row) {
      if (error) {
        console.error(error.message);
      }
      users.push(row);
    }
  );
  console.log(users)
  if(users.length == 0) return false
  return true;
}
*/
/*
function selectRows() {
  db.each(`SELECT * FROM users`, (error, row) => {
    if (error) {
      throw new Error(error.message);
    }
    console.log(row);
  });
}
*/

/*
function createToken(email) {
  const token = jwt.sign({ data: email }, "secretkey", { expiresIn: "10m" });
  return token;
}
*/
/*
function checkToken(token) {
    let t = ""
    for(let coockie of token.split(" ")){
      if(coockie.slice(0,5) == "token"){
        t = coockie.slice(6)
      }
    }
  const email = jwt.verify(t, "secretkey")
  
  return email;
}
*/
app.post("/checkToken", async (req, res) => {
    try {
        console.log(await checkToken(req.body.token));
        res.send({ status: "ok" });
    } catch (e) {
        console.log(e);
        res.send({ status: "tokenExpired", error: e });
    }
});

app.post("/categories", async (req, res) => {
    try {
        console.log(await checkToken(req.body.token));
        let categories = [];
        db.each(
            `SELECT DISTINCT category FROM goods`,
            [req.body.category],
            function (error, row) {
                if (error) {
                    console.error(error.message);
                }
                categories.push(row);
            },
            function (error, count) {
                res.send({ status: "ok", categories: categories });
            }
        );
    } catch (e) {
        console.log(e);
        res.send({ status: "tokenExpired", error: e });
    }
});

app.post("/goods", async (req, res) => {
    try {
        console.log(await checkToken(req.body.token));
        let goods = [];
        db.each(
            `SELECT * FROM goods WHERE category == (?)`,
            [req.body.category],
            function (error, row) {
                if (error) {
                    console.error(error.message);
                }
                goods.push(row);
            },
            function (error, count) {
                res.send({ status: "ok", goods: goods });
            }
        );
    } catch (e) {
        console.log(e);
        res.send({ status: "tokenExpired", error: e });
    }
});

app.post("/good", async (req, res) => {
    try {
        console.log(await checkToken(req.body.token));
        let good = {};
        db.each(
            `SELECT * FROM goods WHERE id == (?)`,
            [req.body.id],
            function (error, row) {
                if (error) {
                    console.error(error.message);
                }
                good = row;
            },
            function (error, count) {
                if(count > 0){
                    res.send({ status: "ok", good: good });
                }
                    
            }
        );
    } catch (e) {
        console.log(e);
        res.send({ status: "tokenExpired", error: e });
    }
});

app.post("/addGood", async (req, res) => {
    try {
        const email = await checkToken(req.body.token);
        let users = [];
        db.each(
            `SELECT * FROM users WHERE email == (?)`,
            [email],
            function (error, row) {
                if (error) {
                    console.error(error.message);
                }
                users.push(row);
            },
            function (error, count) {
                db.run(
                    `INSERT INTO goods (title, description, price, category, userId) VALUES (?, ?, ?, ?, ?)`,
                    [
                        req.body.title,
                        req.body.description,
                        req.body.price,
                        req.body.category,
                        users[0],
                    ],
                    function (error) {
                        if (error) {
                            console.error(error.message);
                        }
                        console.log(
                            `Inserted a row with the ID: ${this.lastID}`
                        );
                        res.send({
                            status: "ok",
                        });
                    }
                );
            }
        );
    } catch (e) {
        console.log(e);
        res.send({ status: "tokenExpired", error: e });
    }
});

app.post("/reg", (req, res) => {
    let users = [];
    db.each(
        `SELECT * FROM users WHERE email == (?)`,
        [req.body.email],
        function (error, row) {
            if (error) {
                console.error(error.message);
            }
            users.push(row);
        },
        function (error, count) {
            if (count > 0) {
                res.status(400).send("f");
            } else {
                db.run(
                    `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
                    [req.body.name, req.body.email, req.body.password],
                    function (error) {
                        if (error) {
                            console.error(error.message);
                        }
                        console.log(
                            `Inserted a row with the ID: ${this.lastID}`
                        );
                        res.send({
                            status: "ok",
                            token: createToken(req.body.email),
                        });
                    }
                );
            }
        }
    );
});

app.post("/reg", (req, res) => {
    let users = [];
    db.each(
        `SELECT * FROM users WHERE email == (?)`,
        [req.body.email],
        function (error, row) {
            if (error) {
                console.error(error.message);
            }
            users.push(row);
        },
        function (error, count) {
            if (count > 0) {
                res.status(400).send("f");
            } else {
                db.run(
                    `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
                    [req.body.name, req.body.email, req.body.password],
                    function (error) {
                        if (error) {
                            console.error(error.message);
                        }
                        console.log(
                            `Inserted a row with the ID: ${this.lastID}`
                        );
                        res.send({
                            status: "ok",
                            token: createToken(req.body.email),
                        });
                    }
                );
            }
        }
    );
});

app.post("/log", (req, res) => {
    let users = [];
    db.each(
        `SELECT * FROM users WHERE email == (?) AND password == (?)`,
        [req.body.email, req.body.password],
        function (error, row) {
            if (error) {
                console.error(error.message);
            }
            console.log(row);
            users.push(row);
        },
        function (error, count) {
            if (count > 0) {
                res.send({ status: "ok", token: createToken(req.body.email) });
            } else {
                res.status(404).send(error.message);
            }
        }
    );
});

app.listen(3000, () => {
    console.log("server started");
});
