import React from "react";
import { Table, Form, Button } from "react-bootstrap";

const Spreadsheet = ({ data, setData }) => {
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

  const computeFormula = (formula) => {
    try {
      // Handle function-based formulas like SUM(A1:A3)
      const functionMatch = formula.match(/(\w+)\((.*?)\)/);
      if (functionMatch) {
        const func = functionMatch[1].toUpperCase();
        const rangeStr = functionMatch[2];
        const values = getRangeValues(rangeStr);

        switch (func) {
          case "SUM": return values.reduce((a, b) => a + b, 0);
          case "PRODUCT": return values.reduce((a, b) => a * b, 1);
          case "MAX": return Math.max(...values);
          case "MIN": return Math.min(...values);
          default: return "ERROR";
        }
      }

      // Handle normal expressions like "A1 + B2"
      const parsedExpression = formula.slice(1).replace(/[A-Z]+\d+/g, (match) => getCellValue(match));
      return eval(parsedExpression);
    } catch {
      return "ERROR";
    }
  };

  const handleChange = (row, col, value) => {
    const newData = [...data];
    newData[row] = [...newData[row]];
    newData[row][col] = value;
    setData(newData);
  };

  const addMoreRow = () => {
    const newRow = new Array(data[0].length).fill("");
    setData([...data, newRow]);
  };

  const addMoreColumn = () => {
    const newData = data.map(row => [...row, ""]);
    setData(newData);
  };

  return (
    <div>
      <Table bordered>
        <thead>
          <tr>
            <th> </th>
            {data[0].map((_, index) => <th key={index}>{String.fromCharCode(65 + index)}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{rowIndex + 1}</td>
              {row.map((cell, colIndex) => {
                const displayValue = cell.startsWith("=") ? computeFormula(cell) : cell;
                return (
                  <td key={colIndex}>
                    <Form.Control 
                      type="text" 
                      value={displayValue} 
                      onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)} 
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-center mt-3">
        <Button variant="primary" onClick={addMoreRow} className="mx-2">➕ Add Row</Button>
        <Button variant="success" onClick={addMoreColumn} className="mx-2">➕ Add Column</Button>
      </div>
    </div>
  );
};

export default Spreadsheet;
