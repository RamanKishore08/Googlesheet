const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://raman:1234@cluster0.0mvhw.mongodb.net/spreadsheetDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
const sheetSchema = new mongoose.Schema({
  spreadsheet: Array,
});

const Sheet = mongoose.model("Sheet", sheetSchema);

// Saving Data
app.post("/api/save", async (req, res) => {
  try {
    await Sheet.deleteMany({}); 
    const newSheet = new Sheet({ spreadsheet: req.body.data });
    await newSheet.save();
    res.status(200).json({ message: "Data saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Data
app.get("/api/load", async (req, res) => {
  try {
    const record = await Sheet.findOne();
    res.status(200).json({ data: record ? record.spreadsheet : [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delted Data
app.delete("/api/delete", async (req, res) => {
  try {
    await Sheet.deleteMany({});
    res.status(200).json({ message: "Data deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
