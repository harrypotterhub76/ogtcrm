import React, { useEffect, useState } from "react";
import { Paginator } from "primereact/paginator";

export default function PaginatorComponent({
  renderFunction,
  setLoading,
  first,
  setFirst,
  rows,
  setRows,
  page,
  setPage,
  totalRecords,
}) {
  useEffect(() => {
    if (page !== null) {
      renderFunction();
    }
  }, [page, rows]);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    setPage(event.page);
    setLoading(true);
  };
  console.log(totalRecords);
  return (
    <div className="card">
      <Paginator
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        rowsPerPageOptions={[1, 2, 5, 10]}
        onPageChange={onPageChange}
      />
    </div>
  );
}