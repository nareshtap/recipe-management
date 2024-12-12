import React from "react";
import axios from "axios";

import { GoogleLogin } from "@react-oauth/google";

import { LoginImage } from "../../assets/images/LoginImg";

export const Login = ({ setIsAuthenticated }) => {

  const handleLoginSuccess = async (response) => {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/auth/google-login",
        {
          token: response.credential,
        }
      );
      localStorage.setItem("authToken", data.user.name);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login Failed", error);
    }
  };

  const handleLoginFailure = (error) => {
    console.error("Login Failed", error);
  };

  return (
    <div className="grid grid-cols-2 h-full">
      <div className="bg-[#e9f3e2] flex items-center justify-center">
        <LoginImage />
      </div>
      <div className="flex flex-col gap-10 items-center justify-center">
        <h1 className="text-5xl font-bold">Welcome Back!</h1>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
        />
      </div>
    </div>
  );
};
