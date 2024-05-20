import React, { useEffect, useState } from "react";
import { Paginator } from "primereact/paginator";

export default function PaginatorComponent({ getData, setData, setLoading }) {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    if (page !== null) {
      getData({ perPage: rows, page: page + 1 }).then((response) => {
        console.log(response.data);
        setData(response.data.data);
        setTotalRecords(response.data.total);
        setLoading(false);
      });
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
