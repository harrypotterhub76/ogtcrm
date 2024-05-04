import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import {
  Domains,
  Funnels,
  Users,
  Spends,
  Offers,
  Sources,
  Statistics,
  Leads,
  Dashboard,
  Logs,
  Duplicates,
  Statuses,
  ImportLeads,
  LeadsInHold,
  ImportHistory,
} from "./_root/pages";
import RootLayout from "./_root/RootLayout";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        {/* тут будет авторизация */}

        <Route element={<RootLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/funnels" element={<Funnels />} />
          <Route path="/spends" element={<Spends />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/sources" element={<Sources />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/duplicates" element={<Duplicates />} />
          <Route path="/statuses" element={<Statuses />} />
          <Route path="/import-leads" element={<ImportLeads />} />
          <Route path="/leads-in-hold" element={<LeadsInHold />} />
          <Route path="/import-history" element={<ImportHistory />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
