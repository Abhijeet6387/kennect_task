import React, { useState } from "react";
import { Link } from "react-router-dom";
import { validateEmail } from "../Helpers/Validation";
import axios from "axios";
export default function Login() {
  const [passType, setPassType] = useState("password");
  const [email, setEmail] = useState("Enter email");
  const [key, setKey] = useState("Enter password");
  const togglePassword = () => {
    if (passType === "password") {
      setPassType("text");
      return;
    }
    setPassType("password");
  };
  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      alert("Please enter a valid Email!");
    } else if (key === " ") {
      alert("Password can't be empty!");
    } else {
      axios
        .post("/users/login", {
          email: email,
          password: key,
        })
        .then((res) => {
          alert(res.data.message);
          console.log(res.data);
          localStorage.setItem("login_token", res.data.token);
          window.location.href = "/home";
        })
        .catch((err) => {
          alert("Something went wrong, Please try again!");
          console.log(err);
        });
      setEmail("");
      setKey("");
    }
  };
  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3>Sign In</h3>
        </div>
        <div className="card-body">
          <form className="container" autoComplete="off" onSubmit={handleLogin}>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type={passType}
                className="form-control"
                placeholder={key}
                onChange={(e) => setKey(e.target.value)}
              />
              {passType === "password" ? (
                <i onClick={togglePassword} className="fa fa-eye-slash"></i>
              ) : (
                <i onClick={togglePassword} className="fa fa-eye"></i>
              )}
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
            <p className="forgot-password">
              New User? <Link to="/register">Register</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
