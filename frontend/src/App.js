import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/theme.css";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";


import ProtectedRoute from "./components/ProtectedRoute";
import Departments from "./pages/Departments/Departments";
import Employees from "./pages/Employees/Employees";
import Projects from "./pages/Projects/Projects";
import ProjectMembers from "./pages/ProjectMembers/Members";
import Tasks from "./pages/Tasks/Tasks";
import Reports from "./pages/Reports/Reports";
import Profile from "./pages/Profile/Profile";
import CompanyProfile from "./pages/Tenant/CompanyProfile";
import Settings from "./pages/Settings/Settings";

function App() {

    return (

        <BrowserRouter>

            <Routes>

               <Route
    path="/"
    element={<Home />}
/>

<Route
    path="/login"
    element={<Login />}
/>

                {/* Register */}
                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
    path="/departments"
    element={
        <ProtectedRoute>
            <Departments />
        </ProtectedRoute>
    }
/>
<Route
    path="/employees"
    element={
        <ProtectedRoute>
            <Employees />
        </ProtectedRoute>
    }
/>
<Route
    path="/projects"
    element={
        <ProtectedRoute>
            <Projects />
        </ProtectedRoute>
    }
/>
<Route
    path="/members"
    element={
        <ProtectedRoute>
            <ProjectMembers />
        </ProtectedRoute>
    }
/>
<Route
    path="/tasks"
    element={
        <ProtectedRoute>
            <Tasks />
        </ProtectedRoute>
    }
/>
<Route
    path="/reports"
    element={
        <ProtectedRoute>
            <Reports />
        </ProtectedRoute>
    }
/>
<Route
    path="/profile"
    element={
        <ProtectedRoute>
            <Profile />
        </ProtectedRoute>
    }
    />
    <Route
    path="/company"
    element={
        <ProtectedRoute>
            <CompanyProfile />
        </ProtectedRoute>
    }
/>
<Route
    path="/settings"
    element={<Settings />}
/>
            </Routes>
            <ToastContainer
    position="top-right"
    autoClose={3000}
/>


        </BrowserRouter>

    );

}

export default App;