import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";

import showPasswordIcon from "../../assets/2540381-200.png";
import hidePassword from "../../assets/eye-password-see-view.svg";
import { AuthContext } from "../Context/AuthCotext";

export default function Login() {
  const navigate = useNavigate();
  const { setUserToken } = useContext(AuthContext);

  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const schema = z.object({
    email: z
      .string()
      .min(1, "Email field is required.")
      .email("Please enter a valid email."),

    password: z.string().min(1, "Password field is required."),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const { register, handleSubmit, formState } = form;

  async function handleLogin(values) {
    setIsLoading(true);
    setApiError("");

    try {
      const response = await axios.post(
        "https://route-posts.routemisr.com/users/signin",
        values
      );

      console.log(response.data);

      if (response.data.success) {
        const token = response.data.data?.token;

        if (!token) {
          setApiError("Login succeeded, but no token was returned.");
          return;
        }

        localStorage.setItem("userToken", token);
        setUserToken(token);
        navigate("/home");
      } else {
        setApiError(response.data.message || "Login failed.");
      }
    } catch (error) {
      console.log(error.response?.data || error.message);

      setApiError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Login failed."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="max-w-full text-center">
        <h1 className="font-bold text-2xl mt-4">Welcome Back!</h1>

        {apiError && (
          <p className="w-full bg-red-200 text-red-800 p-2 mt-3 rounded-md">
            {apiError}
          </p>
        )}
      </div>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="w-87.5 mx-auto mt-8 border border-[#f1f1f1] p-4 rounded-2xl shadow-sm shadow-[#dddcdc] md:w-3xl lg:w-4xl"
      >
        <div className="relative z-0 w-full mb-5 group">
          <input
            {...register("email")}
            type="email"
            id="email"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />

          <label
            htmlFor="email"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>

          {formState.errors.email && (
            <p className="bg-red-200 text-red-800 w-fit px-2 rounded-sm">
              ⚠︎ {formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="relative z-0 w-full mb-5 group flex border-b-2">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            id="password"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />

          <label
            htmlFor="password"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password
          </label>

          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            className="ml-2 cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <img
              src={showPassword ? hidePassword : showPasswordIcon}
              alt=""
              className="w-5 h-5"
            />
          </button>
        </div>

        {formState.errors.password && (
          <p className="bg-red-200 text-red-800 w-fit px-2 rounded-sm mb-4">
            ⚠︎ {formState.errors.password.message}
          </p>
        )}

        <button
          disabled={isLoading}
          type="submit"
          className="text-black bg-white rounded-lg disabled:bg-[#f1f1f1] disabled:cursor-not-allowed shadow-md shadow-[#dddcdc] font-medium text-sm px-4 py-2 cursor-pointer block w-full border border-[#f1f1f1] hover:bg-[#f2f2f2] hover:shadow-lg transition-shadow"
        >
          {isLoading ? "Signing in..." : "Log in"}
        </button>
      </form>

      <Link
        to="/reset-password"
        className="block text-slate-500 text-center mt-8 hover:underline transition-colors hover:text-black"
      >
        Forgot password?
      </Link>
    </>
  );
}