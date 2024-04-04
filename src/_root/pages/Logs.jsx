import React, { useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
import { Terminal } from "primereact/terminal";
import { TerminalService } from "primereact/terminalservice";
import { getLeads, getLogs } from "../../utilities/api";
import { InputTextarea } from "primereact/inputtextarea";

function Logs() {
  const [date, setDate] = useState(null);
  const [logs, setLogs] = useState(null);
  //   const [startDate, setStartDate] = useState(new Date());
  //   const [endDate, setEndDate] = useState(new Date());

  const commandHandler = (text) => {
    let response;
    let argsIndex = text.indexOf(" ");
    let command = argsIndex !== -1 ? text.substring(0, argsIndex) : text;

    switch (command) {
      case "date":
        response = "Today is " + new Date().toDateString();
        break;

      case "greet":
        response = "Hola " + text.substring(argsIndex + 1) + "!";
        break;

      case "random":
        response = Math.floor(Math.random() * 100);
        break;

      case "clear":
        response = null;
        break;

      default:
        response = "Unknown command: " + command;
        break;
    }

    if (response) TerminalService.emit("response", response);
    else TerminalService.emit("clear");
  };

  useEffect(() => {
    TerminalService.on("command", commandHandler);

    return () => {
      TerminalService.off("command", commandHandler);
    };
  }, []);

  useEffect(() => {
    var dateObject = new Date(date);

    // Получаем год, месяц и день из объекта даты
    var year = dateObject.getFullYear();
    var month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
    var day = ("0" + dateObject.getDate()).slice(-2);
    let formattedDate = year + "-" + month + "-" + day;
    console.log(formattedDate);
    getLogs(formattedDate)
      .then((response) => {
        const formattedLogs = response.data.join("\n\n");
        setLogs(formattedLogs);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [date]);

  const initStartDate = () => {
    const currentDate = new Date(); // Получить текущую дату и время
    const startToday = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    ); // Установить время на 00:00

    setDate(startToday);
  };

  useEffect(() => {
    initStartDate();
  }, []);

  //   function filterLeadsByDate(item) {
  //     const itemDate = new Date(item.dateArrived);
  //     return itemDate >= startDate && itemDate <= endDate;
  //   }

  return (
    <div className="" style={{ maxWidth: "100%", margin: "0 auto" }}>
      {/* <Toast ref={toast} /> */}

      <div>
        <h2 className="m-0">Логи брокеров</h2>

        <Calendar
          value={date}
          onChange={(e) => {
            setDate(e.value);
          }}
          readOnlyInput
        />
      </div>

      {/* <Terminal
        welcomeMessage={logs}
        prompt=""
        pt={{
          root: "bg-gray-900 text-white border-round",
          prompt: "text-gray-400 mr-2",
          command: "text-primary-300",
          response: "text-primary-300",
        }}
      /> */}

      <InputTextarea rows={35} cols={150} value={logs} />
    </div>
  );
}

export default Logs;
