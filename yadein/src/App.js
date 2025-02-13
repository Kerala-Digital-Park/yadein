import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import Auth from "./pages/Auth";
import Footer from "./components/Footer";
import SuperAdminDash from "./pages/dashboard/SuperAdminDash";
import BatchAdminDash from "./pages/dashboard/BatchAdminDash";
import ClassAdminDash from "./pages/dashboard/ClassAdminDash";
import AdminList from "./pages/AdminList";
import BatchList from "./pages/BatchList";
import ClassList from "./pages/ClassList";
import StaffList from "./pages/StaffList";
import StudentList from "./pages/StudentList";
import ProtectedRoute from "./components/ProtectedRoute";
import BatchClasses from "./pages/BatchClasses";
import BatchStudents from "./pages/BatchStudents";
import Jobs from "./pages/Jobs";

function App() {
  return (
    <>
      
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/admin" element={<Auth />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/dashboard-superadmin" element={<ProtectedRoute><SuperAdminDash /></ProtectedRoute>} />
        <Route path="/admin/dashboard-batchadmin" element={<ProtectedRoute><BatchAdminDash /></ProtectedRoute>} />
        <Route path="/admin/dashboard-classadmin" element={<ProtectedRoute><ClassAdminDash /></ProtectedRoute>} />
        <Route path="/admin/admin-list" element={<ProtectedRoute><AdminList /></ProtectedRoute>} />
        <Route path="/admin/batch-list" element={<ProtectedRoute><BatchList /></ProtectedRoute>} />
        <Route path="/admin/class-list" element={<ProtectedRoute><ClassList /></ProtectedRoute>} />
        <Route path="/admin/staff-list" element={<ProtectedRoute><StaffList /></ProtectedRoute>} />
        <Route path="/admin/student-list" element={<ProtectedRoute><StudentList /></ProtectedRoute>} />
        <Route path="/admin/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
        <Route path="/admin/batch/:year" element={<ProtectedRoute><BatchClasses /></ProtectedRoute>} />
        <Route path="/admin/batch/:year/:classForm" element={<ProtectedRoute><BatchStudents /></ProtectedRoute>} />
        
      </Routes>
      <Footer />
    </>
  );
}

export default App;
