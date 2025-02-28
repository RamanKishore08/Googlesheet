import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";

const ChartComponent = ({ data }) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [tableWidth, setTableWidth] = useState("100%");

  useEffect(() => {
    // Find table width dynamically
    const table = document.getElementById("spreadsheet-table");
    if (table) {
      setTableWidth(`${table.offsetWidth}px`);
    }
  }, [data]);

  useEffect(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return;

    try {
      if (chartInstance) chartInstance.destroy();

      const labels = data.map((_, index) => `Row ${index + 1}`);
      const dataset = data.map(row => parseFloat(row[0]) || 0);
      const colors = dataset.map(() => `hsl(${Math.random() * 360}, 70%, 60%)`);

      const newChartInstance = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [{ label: "Column A Values", data: dataset, backgroundColor: colors }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Data Visualization",
              font: { size: 18 },
              padding: { top: 10, bottom: 20 },
            },
          },
        },
      });

      setChartInstance(newChartInstance);
    } catch (error) {
      console.error("Chart Rendering Error:", error);
    }
  }, [data]);

  return (
    <div style={{ height: "400px", width: tableWidth, margin: "auto" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartComponent;
