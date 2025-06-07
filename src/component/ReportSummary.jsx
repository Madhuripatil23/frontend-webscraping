import React, { useEffect, useState } from 'react';
import MetadataSection from './MetadataSection';
import DataExteactionSection from './DataExtractionSection';
import FinancialReport from './FinancialReport';

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

    fetch(`http://localhost:5090/api/scrapper/summary?reportId=${encodeURIComponent(reportId)}&userId=${encodeURIComponent(userId)}`)
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

  // const meta = summary?.metadata || {};
  // const analysis = summary?.financial_analysis || {};

  const {metadata,data_extraction,financial_analysis} = summary; 
  
  return (
    // <div className="summary-box">
    //   <h3 className="summary-title">Metadata</h3>
    //   <ul className="summary-list">
    //     <li><strong>Company:</strong> {meta.company}</li>
    //     <li><strong>Generated On:</strong> {meta.report_generated_on}</li>
    //   </ul>
    //   <h3 className="summary-title">Performance Summary</h3>
    //   <p>{analysis.performance_summary || 'No summary available'}</p>
    //   <h3 className="summary-title">Segment Geographic Deep Dive</h3>
    //   <p>{analysis.segment_geographic_deep_dive || 'No summary available'}</p>
    // </div>
    <div className="summary-box">
      <FinancialReport data={summary} />
      {/* <h1>Financial Report </h1>
      <MetadataSection data={metadata} />
      <br />
      <DataExteactionSection data={data_extraction} finData={financial_analysis} />
      <FinancialAnalysisSection data={financial_analysis} /> */}
    </div>
  );
}

export default ReportSummary;
