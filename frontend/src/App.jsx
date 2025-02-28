import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import FormulaBar from "./components/Formulabar";
import Spreadsheet from "./components/Spreadsheet";
import ChartComponent from "./components/ChartComponent";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  const [data, setData] = useState(Array(10).fill(Array(5).fill("")));
  const [formula, setFormula] = useState("");
  const [selectedCells, setSelectedCells] = useState([]);

  return (
    <div className="container-fluid p-3">
      <Header />
      <div className="d-flex flex-column align-items-center">
        <div className="mb-3 w-100 d-flex justify-content-center"> {/* Added margin-bottom */}
          <Toolbar data={data} setData={setData} />
        </div>
        <FormulaBar 
          formula={formula} 
          setFormula={setFormula} 
          selectedCells={selectedCells} 
          data={data} 
          setData={setData} 
        />
        <Spreadsheet data={data} setData={setData} setSelectedCells={setSelectedCells} />
        <ErrorBoundary>
          <ChartComponent data={data} />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default App;