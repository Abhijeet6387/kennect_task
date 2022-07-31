import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
export default function Login() {
  const [passType, setPassType] = useState("password");
  const [email, setEmail] = useState("Enter email");
  const [key, setKey] = useState("Enter password");
  const [name, setName] = useState("John Doe");
  const [contact, setContact] = useState("+(yy) xxxx-xxx-xxx");
  const togglePassword = () => {
    if (passType === "password") {
      setPassType("text");
      return;
    }
    setPassType("password");
  };
  const handleRegister = (e) => {
    e.preventDefault();
    if (name === " " || email === " " || key === " " || contact === " ")
      alert("Please fill all the details");
    else {
      axios
        .post("/users/register", {
          name: name,
          email: email,
          password: key,
          contact: contact,
        })
        .then((res) => {
          alert("Registered successfully");
          window.location.href = "/login";
        })
        .catch((err) => {
          alert("Something went wrong :(");
          console.log(err);
        });
    }
    setName("");
    setEmail("");
    setKey("");
    setContact("");
  };
  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3>Sign up</h3>
        </div>
        <div className="card-body">
          <form
            className="container"
            autoComplete="off"
            onSubmit={handleRegister}
          >
            <div className="mb-3">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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

            <div className="mb-3">
              <label>Contact</label>
              <input
                type="text"
                className="form-control"
                placeholder={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
            <p className="forgot-password">
              Already Registered? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
