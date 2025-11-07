import React, { useState } from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { login } from "../store/action/userAppStorage";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isErrorInfo, setIsErrorInfo] = useState("");
  const [isUrl, setIsUrl] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setIsError(true);
      setIsErrorInfo("Email and password are required.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await dispatch(
        login({
          email: formData.email,
          password: formData.password,
        })
      );

      setIsLoading(false);
      console.log(response)

      if (!response.bool) {
        setIsError(true);
        setIsErrorInfo(response.message || "Login failed. Try again.");
      } else {
        setIsError(true);
        setIsErrorInfo("Login successful!");
        setIsUrl("/dashboard");
      }
    } catch (err) {
      setIsLoading(false);
      setIsError(true);
      setIsErrorInfo("Something went wrong. Please try again.");
    }
  };

  const closeModal = () => {
    setIsError(false);
    setIsErrorInfo("");
    if (isUrl) navigate(isUrl);
  };

  return (<>
  
   {isLoading && <Loader />}
      {isError && <Modal closeModal={closeModal} content={isErrorInfo} />}
        <div className={styles.loginContainer}>
     

      <div className={styles.rightPanel}>
        <div className={styles.formCard}>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.extraRow}>
              <label className={styles.remember}>
                <input type="checkbox" /> Remember me
              </label>
              <span
                className={styles.forgotLink}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </span>
            </div>

            <button type="submit" className={styles.loginBtn}>
              Sign In
            </button>

            <p className={styles.redirectText}>
              Don’t have an account?{" "}
              <span onClick={() => navigate("/signup")}>Sign Up</span>
            </p>
          </form>
        </div>
      </div>

      <div className={styles.leftPanel}>
        <div className={styles.brand}>
          <h1>LearnVault</h1>
        </div>
        <h2 className={styles.heading}>Welcome Back to LearnVault</h2>
        <p className={styles.subText}>
          Sign in to access your personalized learning dashboard, download
          materials, and continue your academic journey.
        </p>
      </div>
    </div>
      </>
  
  );
};

export default LoginPage;
