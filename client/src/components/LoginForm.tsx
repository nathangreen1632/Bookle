import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../graphql/mutations.js";
import Auth from "../utils/auth.js";
import * as React from "react";

const LoginForm = () => {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [loginUser, { error }] = useMutation(LOGIN_USER);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const { data } = await loginUser({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Login</h2>

        <form onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={formState.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>

          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              Error logging in. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
