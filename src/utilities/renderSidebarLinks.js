export const sidebarLinks = [
  {
    to: "/dashboard",
    icon: "pi-chart-pie",
    name: "Дашборд",
  },
  {
    to: "/leads",
    icon: "pi-user",
    name: "Лиды",
    links: [
      {
        to: "/leads",
        icon: "pi-chart-pie",
        name: "Лиды",
      },
      {
        to: "/leads-in-hold",
        icon: "pi-chart-pie",
        name: "Лиды в холде",
      },
      {
        to: "/duplicates",
        icon: "pi-home",
        name: "Системные дубликаты",
      },
      {
        to: "/leads-hold",
        icon: "pi-chart-pie",
        name: "История импортов",
      },
    ],
  },
  {
    to: "/statistics",
    icon: "pi-chart-line",
    name: "Аналитика",
  },
  {
    to: "/users",
    icon: "pi-users",
    name: "Пользователи",
  },
  {
    to: "/domains",
    icon: "pi-link",
    name: "Домены",
  },
  {
    to: "/funnels",
    icon: "pi-list",
    name: "Воронки",
  },
  {
    to: "/partners",
    icon: "pi-share-alt",
    name: "Партнеры",
  },
  {
    to: "/offers",
    icon: "pi-sitemap",
    name: "Оффера",
  },
  {
    to: "/finances",
    icon: "pi-cog",
    name: "Финансы",
    links: [
      {
        to: "/spends",
        icon: "pi-dollar",
        name: "Расходы",
      },
    ],
  },
  {
    to: "/settings",
    icon: "pi-cog",
    name: "Инструменты",
    links: [
      {
        to: "/sources",
        icon: "pi-chart-pie",
        name: "Источники",
      },
      {
        to: "/logs",
        icon: "pi-chart-pie",
        name: "Логи брокеров",
      },
      {
        to: "/statuses",
        icon: "pi-chart-pie",
        name: "Статусы",
      },
      {
        to: "/import-leads",
        icon: "pi-chart-pie",
        name: "Импорт",
      },
    ],
  },
  {
    to: "/sign-in",
    icon: "pi-sign-out",
    name: "Выход",
  },
];
