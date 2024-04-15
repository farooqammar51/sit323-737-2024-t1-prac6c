const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "calculator-microservice" },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

const app = express();

app.set("view engine", "hbs");
app.set("public_html", path.join(__dirname, "public_html"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var error;
var result;
var num1;
var num2;
var disableInput = false;

app.get("/", (req, res) => {
  num1 = 0;
  num2 = 0;
  res.render("home", { num1, num2 });
});

app.post("/add", (req, res) => {
  num1 = parseFloat(req.body.num1);
  num2 = parseFloat(req.body.num2);

  logger.log({
    level: "info",
    message: `New add operation requested: ${num1} add ${num2}`,
  });

  if (isNaN(num1) || isNaN(num2)) {
    num1 = 0;
    num2 = 0;
    error = "Invalid input. Please provide + values.";
    return res.render("home", { error, num1, num2 });
  }

  result = num1 + num2;
  res.render("home", { num1, num2, result });
});

app.post("/subtract", (req, res) => {
  num1 = parseFloat(req.body.num1);
  num2 = parseFloat(req.body.num2);

  logger.log({
    level: "info",
    message: `New add operation requested: ${num1} - ${num2}`,
  });

  if (isNaN(num1) || isNaN(num2)) {
    num1 = 0;
    num2 = 0;
    error = "Invalid input. Please provide numeric values.";
    return res.render("home", { error, num1, num2 });
  }

  result = num1 - num2;
  res.render("home", { num1, num2, result });
});

app.post("/multiply", (req, res) => {
  num1 = parseFloat(req.body.num1);
  num2 = parseFloat(req.body.num2);

  logger.log({
    level: "info",
    message: `New add operation requested: ${num1} * ${num2}`,
  });

  if (isNaN(num1) || isNaN(num2)) {
    num1 = 0;
    num2 = 0;
    error = "Invalid input. Please provide numeric values.";
    return res.render("home", { error, num1, num2 });
  }

  result = num1 * num2;
  res.render("home", { num1, num2, result });
});

app.post("/divide", (req, res) => {
  num1 = parseFloat(req.body.num1);
  num2 = parseFloat(req.body.num2);

  logger.log({
    level: "info",
    message: `New add operation requested: ${num1} / ${num2}`,
  });

  if (num2 == 0) {
    num1 = 0;
    num2 = 0;

    error = "Cannot divide by 0";
    return res.render("home", { error, num1, num2 });
  } else if (isNaN(num1) || isNaN(num2)) {
    num1 = 0;
    num2 = 0;

    error = "Invalid input. Please provide numeric values.";
    return res.render("home", { error, num1, num2 });
  }

  result = num1 / num2;
  res.render("home", { num1, num2, result });
});

app.post("/exponentiate", (req, res) => {
  num1 = parseFloat(req.body.num1);
  num2 = parseFloat(req.body.num2);

  logger.log({
    level: "info",
    message: `New exponentiate operation requested: ${num1} to the power of ${num2}`,
  });

  if (isNaN(num1) || isNaN(num2)) {
    num1 = 0;
    num2 = 0;
    error = "Invalid input. Please provide numeric values.";
    return res.render("home", { error, num1, num2 });
  }

  result = Math.pow(num1, num2);
  res.render("home", { num1, num2, result });
});

app.post("/sqrt", (req, res) => {
  disableInput = true;
  const info = "Disabled second input temporarily, click reset to enable";
  num1 = parseFloat(req.body.num1);

  logger.log({
    level: "info",
    message: `New square root operation requested: sqrt(${num1})`,
  });

  if (isNaN(num1)) {
    error = "Invalid input. Please provide a numeric value.";
    return res.render("home", { error, disableInput, info, num1 });
  }

  if (num1 < 0) {
    error = "Cannot calculate square root of a negative number.";
    return res.render("home", { error, disableInput, info, num1 });
  }

  const result = Math.sqrt(num1);
  res.render("home", { num1, result, disableInput, info });
});

app.post("/modulo", (req, res) => {
  const num1 = parseFloat(req.body.num1);
  const num2 = parseFloat(req.body.num2);

  logger.log({
    level: "info",
    message: `New modulo operation requested: ${num1} % ${num2}`,
  });

  if (isNaN(num1) || isNaN(num2)) {
    error = "Invalid input. Please provide numeric values.";
    return res.render("home", { error, num1, num2 });
  }

  if (num2 === 0) {
    error = "Cannot divide by zero.";
    return res.render("home", { error, num1, num2 });
  }

  const result = num1 % num2;
  res.render("home", { num1, num2, result });
});

app.post("/factorial", (req, res) => {
  disableInput = true;
  const info = "Disabled second input temporarily, click reset to enable";
  num1 = parseInt(req.body.num1);

  logger.log({
    level: "info",
    message: `New factorial operation requested: ${num1}!`,
  });

  if (isNaN(num1) || num1 < 0) {
    error = "Invalid input. Please provide a non-negative integer.";
    return res.render("home", { error, disableInput, info, num1 });
  }

  let result = 1;
  for (let i = 2; i <= num1; i++) {
    result *= i;
  }

  res.render("home", { num1, result, disableInput, info, num1 });
});

app.post("/reset", (req, res) => {
  error = "";
  result = "";
  num1 = 0;
  num2 = 0;
  disableInput = false;

  res.render("home", { num1, num2, error, result, disableInput });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
