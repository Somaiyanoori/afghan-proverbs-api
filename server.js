import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const PORT = 3000;
const dataPath = "./data/proverbs.json"; // Path to the data file

// Ensure the data directory exists
if (!fs.existsSync("./data")) {
  console.log("Data directory does not exist");
}

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Read data from the file
const readData = () => {
  try {
    const data = fs.readFileSync(dataPath);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading data:", error);
    return [];
  }
};
//All data
app.get("/proverbs", (req, res) => {
  const proverbs = readData();
  res.json(proverbs);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
