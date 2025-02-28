import React from "react";
import { Form, Button } from "react-bootstrap";

const FormulaBar = ({ formula, setFormula, data, setData }) => {
  const colToIndex = (col) => col.charCodeAt(0) - "A".charCodeAt(0);

  const parseCell = (cellStr) => {
    const col = cellStr[0].toUpperCase();
    const row = parseInt(cellStr.slice(1)) - 1;
    return { row, col: colToIndex(col) };
  };

  const getCellValue = (cellStr) => {
    const { row, col } = parseCell(cellStr);
    return parseFloat(data[row]?.[col]) || 0;
  };

  const getRangeValues = (rangeStr) => {
    const [startStr, endStr] = rangeStr.split(":");
    const start = parseCell(startStr);
    const end = parseCell(endStr);
    let values = [];

    for (let r = start.row; r <= end.row; r++) {
      for (let c = start.col; c <= end.col; c++) {
        values.push(parseFloat(data[r]?.[c]) || 0);
      }
    }
    return values;
  };

  const evaluateFormula = () => {
    if (!formula.includes("=")) return;

    try {
      const [targetCell, expression] = formula.split("=").map(s => s.trim());
      const { row: targetRow, col: targetCol } = parseCell(targetCell);

      const newData = [...data];
      newData[targetRow][targetCol] = `=${expression}`;

      setData(newData);
    } catch (error) {
      console.error("Formula Error:", error);
    }
  };

  return (
    <div className="mb-3 d-flex justify-content-center w-100 px-3"> 
      {/* ✅ Ensures full width */}
      <Form.Control 
        type="text" 
        value={formula} 
        onChange={(e) => setFormula(e.target.value)} 
        placeholder="Enter formula (e.g., C2 = SUM(A1:A3), B2 = A1 * B3)"
        className="flex-grow-1" 
        style={{
          maxWidth: "900px",
          fontSize: "16px",
          padding: "10px"
        }}  
      />
      <Button onClick={evaluateFormula} className="ms-2">Apply</Button>
    </div>
  );
};

export default FormulaBar;
