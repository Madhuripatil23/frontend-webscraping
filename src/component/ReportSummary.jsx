import React, { useEffect, useState } from "react";
import FinancialReport from "./FinancialReport";
import { API_BASE_URL } from "../Api.js";

function ReportSummary({ reportId }) {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (!reportId) return;

    setSummary(null);
    setError(null);
    
    console.log("Fetching summary for:", reportId);

    fetch(
      `${API_BASE_URL}/summary?reportId=${encodeURIComponent(
        reportId
      )}&userId=${encodeURIComponent(userId)}`
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load summary");
        return response.json();
      })
      .then((data) => setSummary(data))
      .catch((err) => {
        console.error("Error fetching summary:", err);
        setError(err.message);
      });
  }, [reportId]);



  if (error) {
    return (
      <div className=".errorStyle">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="loadingStyle">
        <span>Loading summary...</span>
      </div>
    );
  }

  return (
    <div className="summary-box">
      <FinancialReport data={summary} />
    </div>
  );
}

export default ReportSummary;
