import React, { useEffect, useState } from "react";
import { Paginator } from "primereact/paginator";
import { postLead } from "../utilities/api";

export default function PaginatorComponent({ setLeads }) {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    if (page !== null) {
      postLead({ perPage: rows, page: page + 1 }).then((response) => {
        console.log(response.data);
        setLeads(response.data.data);
        setTotalRecords(response.data.total);
      });
    }
  }, [page, rows]);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
    setPage(event.page);
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
