import React, { useState } from "react";

const formatValue = (v) =>
  typeof v === "number" ? v.toLocaleString() : v ?? "-";

const Table = ({ data = null, headers = null, rows = null }) => {
  const [sortConfig, setSortConfig] = useState(null);

  const hasData = Array.isArray(data) && data.length > 0;

  const finalHeaders = headers || (hasData ? Object.keys(data[0]) : null);
  const finalRows = rows || (hasData ? data.map((d) => Object.values(d)) : null);

  const noHeaders = !finalHeaders;
  const noRows = !finalRows || finalRows.length === 0;

  if (noHeaders && noRows) {
    return <p>No data available</p>;
  }

  // Only sort if rows exist
  const sortedRows =
    !noHeaders && !noRows && sortConfig
      ? [...finalRows].sort((a, b) => {
          const i = sortConfig.index;
          const dir = sortConfig.direction === "asc" ? 1 : -1;
          const aVal = a[i];
          const bVal = b[i];
          const aStr = aVal != null ? aVal.toString() : "";
          const bStr = bVal != null ? bVal.toString() : "";
          const aNum = parseFloat(aStr.replace(/[^\d.-]/g, ""));
          const bNum = parseFloat(bStr.replace(/[^\d.-]/g, ""));
          if (!isNaN(aNum) && !isNaN(bNum)) return dir * (aNum - bNum);
          return dir * aStr.localeCompare(bStr);
        })
      : finalRows;

  const onSort = (index) => {
    if (noHeaders || noRows) return;
    setSortConfig((current) =>
      current && current.index === index && current.direction === "asc"
        ? { index, direction: "desc" }
        : { index, direction: "asc" }
    );
  };

  return (
    <table>
      {finalHeaders && (
        <thead>
          <tr>
            {finalHeaders.map((h, i) => (
              <th
                key={i}
                onClick={() => onSort(i)}
                style={{ cursor: noRows ? "default" : "pointer" }}
              >
                {h}
                {!noRows && sortConfig?.index === i
                  ? sortConfig.direction === "asc"
                    ? " ▲"
                    : " ▼"
                  : ""}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {noRows ? (
          <tr>
            <td
              colSpan={finalHeaders?.length || 1}
              style={{ textAlign: "center" }}
            >
              No data available
            </td>
          </tr>
        ) : (
          sortedRows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{formatValue(cell)}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default Table;
