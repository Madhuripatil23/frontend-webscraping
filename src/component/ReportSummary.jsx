import React, { useEffect, useState } from 'react';
import FinancialReport from './FinancialReport';
import { API_BASE_URL } from '../Api.js';


function ReportSummary({ reportId }) {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const userId =   sessionStorage.getItem("userId");
  
  useEffect(() => {
    if (!reportId) return;

    // Clear previous summary and error before new fetch
    setSummary(null);
    setError(null);

    console.log("Fetching summary for:", reportId);

    fetch(`${API_BASE_URL}/summary?reportId=${encodeURIComponent(reportId)}&userId=${encodeURIComponent(userId)}`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to load summary');
        return response.json();
      })
      .then(data => setSummary(data))
      .catch(err => {
        console.error("Error fetching summary:", err);
        setError(err.message);
      });
  }, [reportId]);

  if (error) return <p className="error-text">Error: {error}</p>;
  if (!summary) return <p>Loading summary...</p>;

  return (

    <div className="summary-box">
      <FinancialReport data={summary} />
    </div>
  );
}

export default ReportSummary;