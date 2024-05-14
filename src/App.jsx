import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
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
  Login,
  Unauthorized,
  NotFound,
} from "./_root/pages";
import RootLayout from "./_root/RootLayout";
import "./App.css";
import { useContext, useState } from "react";
import { UserContext } from "./context/userContext";

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/unathorized" replace />;
  }
  return children ? children : <Outlet />;
}

function App() {
  const { user, setUser } = useContext(UserContext);

  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          <Route element={<ProtectedRoute user={user} />}>
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
        </Route>
        <Route
          path="/login"
          element={<Login user={user} setUser={setUser} />}
        />
        <Route path="/unathorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
