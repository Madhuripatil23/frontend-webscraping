import React, { useEffect, useState } from 'react';

export default function ReportSummary({ company, ym }) {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!company || !ym) {
      setSummary(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Load the whole JSON file (e.g. LTIM.json) from public folder
    fetch('/LTIM.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load JSON file');
        return res.json();
      })
      .then(data => {
        // Assuming data structure: { [company]: { [ym]: { summary } } }
        const companyData = data[company];
        if (!companyData) throw new Error(`No data for company: ${company}`);

        const periodData = companyData[ym];
        if (!periodData) throw new Error(`No data for period: ${ym}`);

        setSummary(periodData.summary || null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [company, ym]);

  if (loading) return <p>Loading summary...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!summary) return <p>No summary available for {company} — {ym.replace('_', ' / ')}</p>;

  // Example display - adjust according to your summary structure
  const { metadata, financial_analysis } = summary;

  return (
    <section className="bg-white p-4 rounded shadow space-y-4">
      <h3 className="font-semibold text-lg">Metadata</h3>
      <ul className="list-disc pl-6 text-sm space-y-1">
        <li><strong>Company:</strong> {metadata?.company || company}</li>
        <li><strong>Report Generated On:</strong> {metadata?.report_generated_on || 'N/A'}</li>
      </ul>

      <h3 className="font-semibold text-lg">Performance Summary</h3>
      <p className="text-sm">{financial_analysis?.performance_summary || 'No performance summary available.'}</p>
    </section>
  );
}
