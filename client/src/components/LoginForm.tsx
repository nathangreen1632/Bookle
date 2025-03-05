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
    <form onSubmit={handleFormSubmit}>
      <input type="email" name="email" placeholder="Email" value={formState.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={formState.password} onChange={handleChange} required />
      <button type="submit">Login</button>
      {error && <p>Error logging in</p>}
    </form>
  );
};

export default LoginForm;
