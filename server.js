const express = require("express");
const request = require('request')

const app = express();

app.set("port", process.env.PORT || 3001);

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

app.get("/api/getDrivers", (req, res) => {
    const param = req.query.q;

    request({
        method: 'GET',
        url: `https://qa-interview-test.qa.splytech.io/api/drivers?latitude=51.5049375&longitude=-0.0964509&count=${param}`
    }, (error, response, body) => {
        if (error) throw new Error(error);
        console.log(response.statusCode) // 200
        console.log(body);
        res.json(body)
    });
});

app.listen(app.get("port"), () => {
    console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
