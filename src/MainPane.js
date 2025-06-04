import React from 'react';
import ReportSummary from './ReportSummary';

export default function MainPane({ selected }) {
  if (!selected) {
    return <p className="text-gray-500 p-6">Select any period from the left-hand menu…</p>;
  }

  const { company, ym, paths } = selected;
  const { ppt, transcript } = paths;

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">
        {company} — {ym.replace('_', ' / ')}
      </h2>
      <div className="mb-6 space-x-4">
        <a
          href={`/files/${ppt}`}
          className="bg-blue-600 text-white px-4 py-1 rounded shadow hover:bg-blue-700"
          download
        >
          Download PPT
        </a>
        <a
          href={`/files/${transcript}`}
          className="bg-green-600 text-white px-4 py-1 rounded shadow hover:bg-green-700"
          download
        >
          Download Transcript
        </a>
      </div>
      <ReportSummary company={company} ym={ym} />
    </main>
  );
}
