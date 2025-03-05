import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../graphql/mutations.js";
import Auth from "../utils/auth.js";
import * as React from "react";

const SignupForm = () => {
  const [formState, setFormState] = useState({ username: "", email: "", password: "" });
  const [addUser, { error }] = useMutation(ADD_USER);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token);
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input type="text" name="username" placeholder="Username" value={formState.username} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={formState.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={formState.password} onChange={handleChange} required />
      <button type="submit">Sign Up</button>
      {error && <p>Error signing up</p>}
    </form>
  );
};

export default SignupForm;
