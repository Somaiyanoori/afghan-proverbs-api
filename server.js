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
//Get all proverbs
app.get("/proverbs", (req, res) => {
  const proverbs = readData();
  res.json(proverbs);
});

// Get a single proverb by ID
app.get("/proverbs/:id", (req, res) => {
  const id = parseInt(req.body.id);
  const proverbs = readData();
  const foundProverbs = proverbs.find((p) => p.id === id);
  if (foundProverbs) {
    res.json(foundProverbs);
  } else {
    res.status(404).json({ message: `we can not find this id sorry.` });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
