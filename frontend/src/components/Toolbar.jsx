import React from "react";
import { Button } from "react-bootstrap";
import * as XLSX from "xlsx";
import axios from "axios";

const Toolbar = ({ data, setData }) => {
  const applyFunction = (func) => {
    let newData = [...data];

    switch (func) {
      case "UPPER":
        newData = newData.map(row =>
          row.map(cell => (cell ? cell.toUpperCase() : ""))
        );
        break;
      case "LOWER":
        newData = newData.map(row =>
          row.map(cell => (cell ? cell.toLowerCase() : ""))
        );
        break;
      case "TRIM":
        newData = newData.map(row =>
          row.map(cell => (cell ? cell.trim() : ""))
        );
        break;
      case "REMOVE_DUPLICATES":
        newData = [...new Set(newData.map(JSON.stringify))].map(JSON.parse);
        break;
      case "FIND_AND_REPLACE":
        const findText = window.prompt("Enter text to find:");
        const replaceText = window.prompt("Enter replacement text:");
        if (findText !== null && replaceText !== null) {
          newData = newData.map(row =>
            row.map(cell =>
              cell ? cell.replace(new RegExp(findText, "g"), replaceText) : ""
            )
          );
        }
        break;
      default:
        break;
    }

    setData(newData);
  };

  // New function to save data to MongoDB using your deployed API
  const saveDataToMongoDB = async () => {
    try {
      await axios.post("https://googlesheet-031v.onrender.com/api/save", { data });
      alert("Data saved successfully!");
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to save data.");
    }
  };

  const deleteDataFromMongoDB = async () => {
    if (!window.confirm("Are you sure you want to delete all data?")) return;
    
    try {
      await axios.delete("https://googlesheet-031v.onrender.com/api/delete");
      setData([]);
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete data.");
    }
  };

  const downloadAsExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "SpreadsheetData.xlsx");
  };

  const uploadData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryString = e.target.result;
      const workbook = XLSX.read(binaryString, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setData(parsedData);
      alert("Data uploaded successfully!");
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="d-flex flex-wrap justify-content-center mb-3">
      <Button variant="primary" className="m-1" onClick={() => applyFunction("UPPER")}>
        🔠 UPPER
      </Button>
      <Button variant="secondary" className="m-1" onClick={() => applyFunction("LOWER")}>
        🔡 LOWER
      </Button>
      <Button variant="success" className="m-1" onClick={() => applyFunction("TRIM")}>
        ✂️ TRIM
      </Button>
      <Button variant="danger" className="m-1" onClick={() => applyFunction("REMOVE_DUPLICATES")}>
        🗑️ REMOVE DUPLICATES
      </Button>
      <Button variant="warning" className="m-1" onClick={() => applyFunction("FIND_AND_REPLACE")}>
        🔍 FIND & REPLACE
      </Button>
      <Button variant="info" className="m-1" onClick={downloadAsExcel}>
        📥 Download Excel
      </Button>
      <label className="btn btn-warning m-1">
        📤 Upload Data <input type="file" hidden onChange={uploadData} />
      </label>
      <Button variant="success" className="m-1" onClick={saveDataToMongoDB}>
        💾 Save Data
      </Button>
      <Button variant="dark" className="m-1" onClick={deleteDataFromMongoDB}>
        🗑 Delete
      </Button>
    </div>
  );
};

export default Toolbar;
