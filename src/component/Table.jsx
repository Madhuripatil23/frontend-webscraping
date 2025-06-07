import React from "react";

const Table = ({ headers = [], rows = [] }) => {
  if (!Array.isArray(headers) || !Array.isArray(rows)) {
    return <p className="text-red-600 text-sm">Invalid table data.</p>;
  }

  const hasHeaders = headers.length > 0;

  return (
    <table className="min-w-full table-auto border border-gray-300 text-sm mb-4">
      {hasHeaders && (
        <thead>
          <tr className="bg-gray-200">
            {headers.map((h, idx) => (
              <th key={idx} className="px-3 py-2 border text-center font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={headers.length || 2} className="text-center py-2 text-gray-500">
              No data available
            </td>
          </tr>
        ) : (
          rows.map((row, i) => (
            <tr key={i} className={i % 2 ? "bg-gray-50" : ""}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-3 py-1 border ${hasHeaders ? "text-center" : "text-left font-medium first:text-gray-700"}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default Table;
