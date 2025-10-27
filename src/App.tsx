import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import HomePage from "./pages/home/home";
import SignupPage from "./pages/auth/signup";
import SigninPage from "./pages/auth/signin";
import ProfilePage from "./pages/(protected)/profile/profile";
import SettingsPage from "./pages/(protected)/settings/settings";
import RequestsPage from "./pages/(protected)/requests/requests";
import CandidatesPage from "./pages/(protected)/candidates/candidates";
import DashboardLayout from "./components/layouts/dashboard/Dashboard";
import WalletPage from "./pages/(protected)/wallet/wallet";
import AuthLayout from "./components/layouts/dashboard/Auth";
import SetupPage from "./pages/(protected)/setup/setup";
import OtpPage from "./pages/auth/otp";
import SetupLayout from "./components/layouts/dashboard/Setup";
import NewRequestsPage from "./pages/(protected)/requests/new-request";
import RequestDetailsPage from "./pages/(protected)/requests/request-details";
import AppNotificationWrapper from "./providers/AppNotificationWrapper";
import AuthRedirect from "./guards/AuthRedirect";
import ProtectedRoute from "./guards/ProtectedRoute";
import NotFound from "./pages/not-found";
import ShortlistedCandidatesPage from "./pages/(protected)/requests/candidates";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppNotificationWrapper>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="auth" element={<AuthRedirect />}>
              <Route element={<AuthLayout />}>
                <Route path="register" element={<SignupPage />} />
                <Route path="login" element={<SigninPage />} />
                <Route path="verify-account" element={<OtpPage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<DashboardLayout />}>
                <Route index element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="candidates" element={<CandidatesPage />} />
                <Route path="requests" element={<RequestsPage />} />
                <Route path="requests/new" element={<NewRequestsPage />} />
                <Route
                  path="requests/:requestId"
                  element={<RequestDetailsPage />}
                />
                <Route
                  path="requests/:requestId/candidates"
                  element={<ShortlistedCandidatesPage />}
                />
                <Route path="wallet" element={<WalletPage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="setup" element={<SetupLayout />}>
                <Route index element={<SetupPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppNotificationWrapper>
    </QueryClientProvider>
  );
}

export default App;
