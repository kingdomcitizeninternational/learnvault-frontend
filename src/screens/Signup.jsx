import React, { useState } from "react";
import styles from "./SignUp.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { signup } from '../store/action/userAppStorage';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    // basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setIsError(true);
      setIsErrorInfo("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setIsError(true);
      setIsErrorInfo("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      console.log(formData)
      const response = await dispatch(
        signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      );

      setIsLoading(false);

      if (!response.bool) {
        setIsError(true);
        setIsErrorInfo(response.message || "Signup failed. Try again.");
      } else {
        setIsError(true);
        setIsErrorInfo("Signup successful!");
        setIsUrl("/login");
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

  return (
    <div className={styles.signupContainer}>
      {isLoading && <Loader />}
      {isError && (
        <Modal closeModal={closeModal} content={isErrorInfo} />
      )}

      <div className={styles.leftPanel}>
        <div
          className={styles.brand}
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <h1>LearnVault</h1>
        </div>
        <h2 className={styles.heading}>
          Join LearnVault — Your Gateway to Smarter Learning.
        </h2>
        <p className={styles.subText}>
          Access, upload, and manage academic materials easily. Create your
          account in seconds.
        </p>
        <button className={styles.backHomeBtn} onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formCard}>
          <h2>Create Account</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className={styles.signupBtn}>
              Sign Ups
            </button>

            <p className={styles.redirectText}>
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className={styles.link}
              >
                Login
              </span>
            </p>

            <p className={styles.redirectTextAlt}>
              Go to{" "}
              <span
                onClick={() => navigate("/about")}
                className={styles.link}
              >
                About
              </span>{" "}
              or{" "}
              <span
                onClick={() => navigate("/course-detail")}
                className={styles.link}
              >
                Repository
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;



