import React, { useEffect, useRef, useContext } from "react";
import axios from "axios";
import "./login.css";
import { appContext } from "./App";
import Header from "./Header";

const Login = () => {
  const userRef = useRef(null);
  const passwordRef = useRef(null);
  const { setIsLogin, setRole } = useContext(appContext);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = userRef.current.value;
    const password = passwordRef.current.value;

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });

      if (response.status === 200) {
        alert("Login Successful");
        setIsLogin("login");
        setRole(response.data.role);
        localStorage.setItem("reg_no", username);
        localStorage.setItem("student_password", password);
        console.log("Successfully logged in");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert("User not found");
      } else if (error.response && error.response.status === 401) {
        alert("Invalid password");
      } else {
        alert("An error occurred. Please try again later.");
      }
      setIsLogin("notlogin");
      console.error("Error logging in:", error);
    }

    // Clear inputs
    userRef.current.value = "";
    passwordRef.current.value = "";
  };

  return (
    <div>
      <Header />
      <div className="login-container">
        <div className="login-left">
          <h2 className="login-logo">
            <img
              src="student.png"
              alt="Student Icon"
              className="student-icon"
            />
            Welcome back
          </h2>
          <p>Please enter your details</p>
          <form className="login-form" onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              ref={userRef}
            />
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              ref={passwordRef}
            />
            <div className="login-options">
              <a href="#forgot" className="forgot-password">
                Forgot password
              </a>
            </div>
            <button type="submit" className="login-button">
              Log in
            </button>
          </form>
        </div>
        <div className="login-right">
          <div className="illustration"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
