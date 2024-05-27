import { Knob } from "primereact/knob";
import { Toast } from "primereact/toast";
import React, { useContext, useState } from "react";
import { getOffers, getLeadsForChart, getStats } from "../../utilities/api";
import { useEffect } from "react";
import { useRef } from "react";
import { Chart } from "primereact/chart";
import { TitleContext } from "../../context/TitleContext";
import { Card } from "primereact/card";
import { UserContext } from "../../context/UserContext";
import { Skeleton } from "primereact/skeleton";

function Dashboard() {
  const [value, setValue] = useState(10);
  const [offers, setOffers] = useState([]);
  const [stats, setStats] = useState([]);

  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [leads, setLeads] = useState([]);
  const [username, setUsername] = useState("");

  const toast = useRef(null);
  const ref = useRef(0);

  const { setTitleModel } = useContext(TitleContext);
  const { userData } = useContext(UserContext);

  const showToast = (severity, text) => {
    toast.current.show({
      severity: severity,
      detail: text,
      life: 2000,
    });
  };

  // useEffect(() => {
  //   
  //   
  // }, [offers, stats]);

  const renderOffers = () => {
    getOffers()
      .then((response) => {
        
        setOffers(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        
        showToast("error", "Ошибка при загрузке оферов");
      });
  };

  const renderStats = () => {
    getStats({
      role: userData.role,
      user_id: userData.id,
    })
      .then((response) => {
        
        setStats(response.data);
        setLoading(false);
      })
      .catch((error) => {
        
        showToast("error", "Ошибка при загрузке статистики");
      });
  };

  const renderLeads = () => {
    getLeadsForChart({
      role: userData.role,
      user_id: userData.id,
    })
      .then((response) => {
        
        setLeads(
          response.data.lead_counts.map((lead) =>
            lead.count !== undefined ? lead.count : 0
          )
        );

        setLoading(false);
      })
      .catch((error) => {
        
        showToast("error", "Ошибка при загрузке лидов");
      });
  };

  useEffect(() => {
    renderOffers();
    renderStats();
    renderLeads();
    setTitleModel("Дашборд");
    // setUsername(JSON.parse(localStorage.getItem("loginData")).user.name);

    // 
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
    <div className="dashboard-container">
      <div className="flex justify-content-between items-center my-5">
        <h2 className="m-0">Дашборд</h2>
      </div>
      <div className="" style={{ maxWidth: "100%", margin: "0 auto" }}>
        <Toast ref={toast} />
        <div className="flex flex-wrap gap-0 align-items-center justify-content-between">
          <div className="col-12 md:col-6 lg:col-2">
            <Card className="dashboard-card p-2">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">Лиды</span>
                  <div className="text-900 font-medium text-xl">
                    {"leads_count" in stats ? stats.leads_count : <Skeleton />}
                  </div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-green-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-user text-green-500 text-xl"></i>
                </div>
              </div>
            </Card>
          </div>
          <div className="col-12 md:col-6 lg:col-2">
            <Card className="dashboard-card p-2">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">
                    Валиды
                  </span>
                  <div className="text-900 font-medium text-xl">
                    {"valid" in stats ? stats.valid : <Skeleton />}
                  </div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-green-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-thumbs-up text-green-500 text-xl"></i>
                </div>
              </div>
            </Card>
          </div>
          <div className="col-12 md:col-6 lg:col-2">
            <Card className="dashboard-card p-2">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">
                    Невалиды
                  </span>
                  <div className="text-900 font-medium text-xl">
                    {"no_valid" in stats ? stats.no_valid : <Skeleton />}
                  </div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-green-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-thumbs-down text-green-500 text-xl"></i>
                </div>
              </div>
            </Card>
          </div>
          <div className="col-12 md:col-6 lg:col-2">
            <Card className="dashboard-card p-2">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">FTD</span>
                  <div className="text-900 font-medium text-xl">
                    {"deposited_leads_count" in stats ? (
                      stats.deposited_leads_count
                    ) : (
                      <Skeleton />
                    )}
                  </div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-green-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-star text-green-500 text-xl"></i>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-12 md:col-6 lg:col-2">
            <Card className="dashboard-card p-2">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">CR</span>
                  <div className="text-900 font-medium text-xl">
                    {"cr" in stats ? `${stats.cr}%` : <Skeleton />}
                  </div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-green-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-verified text-green-500 text-xl"></i>
                </div>
              </div>
            </Card>
          </div>
          <div className="col-12 md:col-6 lg:col-2">
            <Card className="dashboard-card p-2">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">
                    Затраты
                  </span>
                  <div className="text-900 font-medium text-xl">
                    {"today_spend_summary" in stats ? (
                      `${stats.today_spend_summary}$`
                    ) : (
                      <Skeleton />
                    )}
                  </div>
                </div>
                <div
                  className="flex align-items-center justify-content-center bg-green-100 border-round"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                >
                  <i className="pi pi-money-bill text-green-500 text-xl"></i>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {userData.role === "Admin" &&
            offers.map((offer) => {
              if (offer.active) {
                return (
                  <div
                    className="flex flex-column align-items-center"
                    key={offer.id}
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
