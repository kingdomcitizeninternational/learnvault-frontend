import React, { Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import FallBack from "./components/Fallback";
import { useSelector } from "react-redux";

const Home = React.lazy(() => import("./screens/Home"));
const About = React.lazy(() => import("./screens/About"));
const Login = React.lazy(() => import("./screens/Login"));
const Signup = React.lazy(() => import("./screens/Signup"));
const EmailVerify = React.lazy(() => import("./screens/EmailVerify"));
const StudentDashboard = React.lazy(() => import("./screens/StudentDashboard"));
const CourseDetail = React.lazy(() => import("./screens/CourseDetail"));
const Profile = React.lazy(() => import("./screens/Profile"));

const AdminDashboard = React.lazy(() => import("./screens/AdminDashboard"));


const AddMaterial = React.lazy(() => import("./screens/Add-material"));

function App() {
  const { user } = useSelector((state) => state.userAuth);

  return (
    <div className="App">
      <Suspense fallback={<FallBack />}>
        <Routes>
          {/* General */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          {/* Auth Screens */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify/:id" element={<EmailVerify />} />

          {/* Protected Dashboard */}
          <Route
            path="/dashboard"
            element={user ? <StudentDashboard /> : <Navigate to="/login" />}
          />

          <Route
            path="/admin-dashboard"
            element={<AdminDashboard />}
          />


           <Route
            path="/add-material"
            element={<AddMaterial/>}
          />

          {/* Other Screens */}
          <Route path="/course-detail/:id" element={user ? <CourseDetail /> : <Navigate to="/login" />} />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />

        
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
