import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PassengerHome from "./pages/PassengerHome";
import PrisonDetail from "./pages/PrisonDetail";
import BookTrip from "./pages/BookTrip";
import MyBookings from "./pages/MyBookings";
import BookingDetail from "./pages/BookingDetail";
import CreateTrip from "./pages/CreateTrip";
import MyTrips from "./pages/MyTrips";
import TripDetail from "./pages/TripDetail";
import DriverRequests from "./pages/DriverRequests";
import DriverRequestDetail from "./pages/DriverRequestDetail";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Chat from "./pages/Chat";
import SupportHub from "./pages/SupportHub";
import SupportDetail from "./pages/SupportDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="max-w-lg mx-auto min-h-screen bg-background relative">
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<PassengerHome />} />
            <Route path="/prison/:id" element={<PrisonDetail />} />
            <Route path="/book/:id" element={<BookTrip />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/booking/:id" element={<BookingDetail />} />
            <Route path="/create-trip" element={<CreateTrip />} />
            <Route path="/my-trips" element={<MyTrips />} />
            <Route path="/trip/:id" element={<TripDetail />} />
            <Route path="/driver-requests" element={<DriverRequests />} />
            <Route path="/driver-request/:id" element={<DriverRequestDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/support" element={<SupportHub />} />
            <Route path="/support/:type" element={<SupportDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
