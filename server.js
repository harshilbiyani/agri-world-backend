const express = require("express");
const cors = require("cors");
const { loadCropExcel, getVillageOptions, matchCropData } = require("./excelReader");

const app = express();
app.use(cors());
app.use(express.json());

loadCropExcel();

app.get("/api/locations", (req, res) => {
  res.json(getVillageOptions());
});

app.post("/api/analyze", (req, res) => {
  const { district, block, village, ...input } = req.body;
  const result = matchCropData(district, block, village, input);
  if (!result) return res.status(404).json({ error: "Location not found." });
  res.json(result);
});

app.listen(5000, () => console.log("🚀 Backend running on http://localhost:5000"));