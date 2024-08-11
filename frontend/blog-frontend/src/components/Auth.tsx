import { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";
import SignUpValidation from "../types/signUp";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import serverUrl from "../config/server";

export default function Auth({ type }: { type: "signup" | "signin" }) {
  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<SignUpValidation>({
    email: "",
    password: "",
  });
  const [sending, setIsSending] = useState<boolean>(false);

  async function handleServerCall() {
    try {
      setIsSending(true);
      const response = await axios.post(
        `${serverUrl}/api/v1/user/${
          type === "signup" ? "signup" : "signin"
        }`,
        postInputs
      );
      const jwt = response.data.jwt;
      localStorage.setItem("authToken", jwt);
      toast.success("success");
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSending(false);
    }
  }
  return (
    <div className="h-screen flex justify-center flex-col items-center ">
      <div className=" w-2/5">
        <div className="text-3xl  font-semibold text-left mt-4 ">
          {type === "signup" ? "Create an Account" : "login to your account"}
        </div>
        <div className="text-gray-400">
          {type === "signup" ? "already have an account" : "New here ?"}
          <span className="cursor-pointer">
            <Link
              className="ml-1 underline"
              to={type === "signup" ? "/signin" : "/signup"}
            >
              {type === "signup" ? "Login" : "signup"}
            </Link>
          </span>
        </div>
        <div className="mt-4 "></div>

        <LabelledInput
          label="email"
          placeHolder="user email"
          onChange={(e) => {
            setPostInputs((c) => ({
              ...c,
              email: e.target.value,
            }));
          }}
        />
        <LabelledInput
          label="password"
          placeHolder="password"
          type="password"
          onChange={(e) => {
            setPostInputs((c) => ({
              ...c,
              password: e.target.value,
            }));
          }}
        />
        <button
          onClick={handleServerCall}
          className="bg-[#7D45EE] w-full p-3 rounded-xl text-white mt-6  focus:"
        >
          {sending ? "processing" : type === "signup" ? "signup" : "signin"}
        </button>
      </div>
      <Toaster />
    </div>
  );
}

interface lebeledInoutType {
  label: string;
  placeHolder: string;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
function LabelledInput({ label, onChange, type }: lebeledInoutType) {
  return (
    <div>
      <div>
        <label className="block mb-2 mt-3 text-sm font-medium text-gray-200 dark:text-white">
          {label}
        </label>
        <input
          onChange={onChange}
          type={type || "text"}
          className=" bg-transparent  placeholder:text-white  border border-gray-500 text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />
      </div>
    </div>
  );
}
