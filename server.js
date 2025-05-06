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

//  Get a random proverb, optionally filtered by category or keyword
app.get("/proverbs/random", (req, res) => {
  const proverbs = readData();
  const { category, keyword } = req.query;

  let filtered = proverbs;

  if (category || keyword) {
    filtered = proverbs.filter((p) => {
      const categories = Array.isArray(p.category) ? p.category : [p.category];

      const matchesCategory = category
        ? categories.some((cat) => cat.toLowerCase() === category.toLowerCase())
        : true;

      const matchesKeyword = keyword
        ? Object.values(p).some((value) =>
            String(value).toLowerCase().includes(keyword.toLowerCase())
          )
        : true;

      return matchesCategory && matchesKeyword;
    });
  }

  if (filtered.length === 0) {
    return res.status(404).json({ message: "No matching proverbs found." });
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const randomProverb = filtered[randomIndex];
  res.json(randomProverb);
});

// Get a single proverb by ID
app.get("/proverbs/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const proverbs = readData();
  const foundProverb = proverbs.find((p) => p.id === id);
  if (foundProverb) {
    res.json(foundProverb);
  } else {
    res
      .status(404)
      .json({ message: `We cannot find this proverb with the given ID.` });
  }
});

//Add a new proverb
app.post("/proverb", (req, res) => {
  const newProverb = {
    id: Date.now(),
    textDari: req.body.textDari,
    textPashto: req.body.textPashto,
    textEnglish: req.body.textEnglish,
    meaning: req.body.meaning,
    category: req.body.category,
  };
  const proverbs = readData();
  proverbs.push(newProverb);
  fs.writeFileSync(dataPath, JSON.stringify(proverbs, null, 2));
  res.status(201).json(newProverb);
});

//Update an existing
app.put("/proverbs/:id", (req, res) => {
  const proverbId = parseInt(req.params.id);
  const updatedProverb = req.body;

  const proverbs = readData();
  const proverbIndex = proverbs.findIndex(
    (proverb) => proverb.id === proverbId
  );

  if (proverbIndex === -1) {
    return res
      .status(404)
      .json({ message: `Sorry, we can't find this proverb.` });
  }

  proverbs[proverbIndex] = { ...proverbs[proverbIndex], ...updatedProverb }; //spread operator😁
  fs.writeFileSync(dataPath, JSON.stringify(proverbs, null, 2));
  res.status(200).json(proverbs[proverbIndex]);
});

//Delete a proverb
app.delete("/proverbs/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const proverbs = readData();
  const index = proverbs.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Proverb not found." });
  }

  proverbs.splice(index, 1);
  fs.writeFileSync(dataPath, JSON.stringify(proverbs, null, 2));
  res.status(200).json({ message: "Proverb deleted successfully." });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
