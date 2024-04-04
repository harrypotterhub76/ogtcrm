import { Knob } from "primereact/knob";
import { Toast } from "primereact/toast";
import React, { useState } from "react";
import { getOffers } from "../../utilities/api";
import { useEffect } from "react";
import { useRef } from "react";
import { Chart } from "primereact/chart";

function Dashboard() {
  const [value, setValue] = useState(10);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const toast = useRef(null);

  const showToast = (severity, text) => {
    toast.current.show({
      severity: severity,
      detail: text,
      life: 2000,
    });
  };

  useEffect(() => {
    renderOffers();
  }, []);

  const renderOffers = () => {
    getOffers()
      .then((response) => {
        setOffers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        showToast("error", "Ошибка при загрузке оферов");
      });
  };

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const data = {
      labels: [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
      ],
      datasets: [
        {
          label: "Лиды",
          data: [
            65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56, 55, 40, 65, 59, 80,
            81, 56, 55, 40, 56, 55, 40,
          ],
          fill: false,
          borderColor: documentStyle.getPropertyValue("--primary-500"),
          tension: 0.4,
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  return (
    <div className="" style={{ maxWidth: "100%", margin: "0 auto" }}>
      <Toast ref={toast} />
      <div>
        <h2 className="m-0">Дашборд</h2>
      </div>
      <div className="flex flex-wrap gap-4">
        {offers.map((offer) => {
          if (offer.active) {
            return (
              <div className="flex flex-column align-items-center">
                <h3>{offer.name}</h3>
                <Knob
                  value={offer.current_cap}
                  max={offer.cap}
                  readOnly
                  size={100}
                  valueTemplate={`${offer.current_cap}/${offer.cap}`}
                />
              </div>
            );
          }
        })}
      </div>

      <div className="card">
        <Chart type="line" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default Dashboard;
