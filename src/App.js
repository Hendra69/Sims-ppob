import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import LoginForm from "./components/LoginForm";
import HomePage from "./pages/Home/HomePage";
import TopUpPage from "./pages/TopUp/TopUpPage";
import TransactionPage from "./pages/Transaction/TransactionPage";
import AccountPage from "./pages/Account/AccountPage";




import { selectToken } from "./Features/userSlice";

function App() {
  const token = useSelector(selectToken);

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <LoginForm />}
      />

      <Route
        path="/"
        element={token ? <HomePage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/topup"
        element={token ? <TopUpPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/transaction"
        element={token ? <TransactionPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/account"
        element={token ? <AccountPage /> : <Navigate to="/login" replace />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
