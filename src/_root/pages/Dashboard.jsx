import { Knob } from "primereact/knob";
import { Toast } from "primereact/toast";
import React, { useContext, useState } from "react";
import { getOffers, getLeadsForChart, getStats } from "../../utilities/api";
import { useEffect } from "react";
import { useRef } from "react";
import { Chart } from "primereact/chart";
import { TitleContext } from "../../context/TitleContext";

function Dashboard() {
  const [value, setValue] = useState(10);
  const [offers, setOffers] = useState([]);
  const [stats, setStats] = useState([]);

  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [leads, setLeads] = useState([]);

  const toast = useRef(null);
  const ref = useRef(0);

  const { setTitleModel } = useContext(TitleContext);

  const showToast = (severity, text) => {
    toast.current.show({
      severity: severity,
      detail: text,
      life: 2000,
    });
  };

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

  const renderStats = () => {
    getStats()
      .then((response) => {
        setStats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        showToast("error", "Ошибка при загрузке статистики");
      });
  };

  const renderLeads = () => {
    getLeadsForChart()
      .then((response) => {
        setLeads(
          response.data.map((lead) =>
            lead.count !== undefined ? lead.count : 0
          )
        );

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        showToast("error", "Ошибка при загрузке лидов");
      });
  };

  useEffect(() => {
    renderOffers();
    renderStats();
    renderLeads();
    setTitleModel("Дашборд");
  }, []);

  useEffect(() => {
    if (leads.length) {
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
            data: leads,
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
              stepSize: 1,
              min: 0,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };

      setChartData(data);
      setChartOptions(options);
    }
  }, [leads.length]);

  return (
    <div style={{ maxWidth: "80%", margin: "0 auto" }}>
      <div className="flex justify-content-between items-center mb-5">
        <h2 className="m-0">Дашборд</h2>
      </div>
      <div className="" style={{ maxWidth: "100%", margin: "0 auto" }}>
        <Toast ref={toast} />
        <div className="flex flex-wrap gap-0 align-items-center justify-content-between">
          <div className="col-12 md:col-6 lg:col-4">
            <div className="surface-card shadow-2 p-3 border-round">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">
                    Кол-во лидов
                  </span>
                  <div className="text-900 font-medium text-xl">
                    {stats.leads_count}
                  </div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-blue-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-shopping-cart text-blue-500 text-xl"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 md:col-6 lg:col-4">
            <div className="surface-card shadow-2 p-3 border-round">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">
                    Кол-во депов
                  </span>
                  <div className="text-900 font-medium text-xl">
                    {stats.deposited_leads_count}
                  </div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-orange-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-chart-line text-orange-500 text-xl"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 md:col-6 lg:col-4">
            <div className="surface-card shadow-2 p-3 border-round">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">
                    Сегодняшние затраты
                  </span>
                  <div className="text-900 font-medium text-xl">
                    {stats.today_spend_summary}$
                  </div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-cyan-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-money-bill text-cyan-500 text-xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {offers.map((offer) => {
            if (offer.active) {
              return (
                <div
                  className="flex flex-column align-items-center"
                  key={offer}
                >
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
    </div>
  );
}

export default Dashboard;
