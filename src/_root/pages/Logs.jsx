import React, { useContext, useEffect, useRef, useState } from "react";
import { Calendar } from "primereact/calendar";
import { getLogs } from "../../utilities/api";
import { InputTextarea } from "primereact/inputtextarea";
import { TitleContext } from "../../context/TitleContext";

function Logs() {
  const [date, setDate] = useState(null);
  const [logs, setLogs] = useState(null);
  const hasRendered = useRef(false);
  const { setTitleModel } = useContext(TitleContext);

  useEffect(() => {
    initStartDate();
    setTitleModel("Логи брокеров");
  }, []);

  useEffect(() => {
    if (hasRendered.current) {
      var dateObject = new Date(date);

      var year = dateObject.getFullYear();
      var month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
      var day = ("0" + dateObject.getDate()).slice(-2);
      let formattedDate = year + "-" + month + "-" + day;
      console.log(formattedDate);
      getLogs(formattedDate)
        .then((response) => {
          const formattedLogs = response.data.map((log) => log.response_text);
          setLogs(formattedLogs.join("\n\n"));
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      hasRendered.current = true;
    }
  }, [date]);

  const initStartDate = () => {
    const currentDate = new Date();
    const startToday = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    setDate(startToday);
  };

  return (
    <div className="" style={{ maxWidth: "100%", margin: "0 auto" }}>
      {/* <Toast ref={toast} /> */}

      <div>
        <h2 className="m-0">Логи брокеров</h2>

        <Calendar
          value={date}
          locale="ru"
          onChange={(e) => {
            setDate(e.value);
          }}
          readOnlyInput
        />
      </div>
      <InputTextarea rows={35} cols={150} value={logs} />
    </div>
  );
}

export default Logs;
