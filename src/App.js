// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css'; // Or 'App.css'

function Sidebar({ tree, onSelectPeriod }) {
  if (!tree || Object.keys(tree).length === 0) {
    return <p className="text-muted">No companies found.</p>;
  }

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Companies</h2>
      {Object.entries(tree).sort().map(([company, years]) => (
        <details key={company} className="company-details">
          <summary className="company-name">{company}</summary>
          <ul className="year-list">
            {Object.keys(years)
              .sort((a, b) => b.localeCompare(a))
              .map(ym => (
                <li key={ym}>
                  <a
                    href="#"
                    className="link"
                    onClick={e => {
                      e.preventDefault();
                      onSelectPeriod(company, ym, years[ym]);
                    }}
                  >
                    {ym.replace('_', ' / ')}
                  </a>
                </li>
              ))}
          </ul>
        </details>
      ))}
    </aside>
  );
}

function MainPane({ selected }) {
  if (!selected) {
    return <p className="text-muted">Select any period from the left-hand menu…</p>;
  }

  const { company, ym, paths } = selected;
  const { ppt, transcript } = paths;

  return (
    <main className="main-pane">
      <h2 className="main-title">{company} — {ym.replace('_', ' / ')}</h2>
      <div className="download-links">
        <a href={`/files/${ppt}`} className="btn blue">Download PPT</a>
        <a href={`/files/${transcript}`} className="btn green">Download Transcript</a>
      </div>
      <ReportSummary company={company} ym={ym} />
    </main>
  );
}

function ReportSummary({ company, ym }) {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!company || !ym) return;
    fetch('/LTIM.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load JSON');
        return response.json();
      })
      .then(data => setSummary(data))
      .catch(err => setError(err.message));
  }, [company, ym]);

  if (error) return <p className="error-text">Error: {error}</p>;
  if (!summary) return <p>Loading summary...</p>;

  const meta = summary.metadata;
  const analysis = summary.financial_analysis;

  return (
    <div className="summary-box">
      <h3 className="summary-title">Metadata</h3>
      <ul className="summary-list">
        <li><strong>Company:</strong> {meta.company}</li>
        <li><strong>Generated On:</strong> {meta.report_generated_on}</li>
      </ul>
      <h3 className="summary-title">Performance Summary</h3>
      <p>{analysis?.performance_summary || 'No summary available'}</p>
    </div>
  );
}

export default function App() {
  const [tree, setTree] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('/Tree.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load company tree');
        return res.json();
      })
      .then(data => setTree(data))
      .catch(() => setTree({}));
  }, []);

  return (
    <div className="app-container">
      <Sidebar tree={tree} onSelectPeriod={(company, ym, paths) => setSelected({ company, ym, paths })} />
      <MainPane selected={selected} />
    </div>
  );
}
