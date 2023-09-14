"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BounceLoader } from "react-spinners";
import axios from "axios";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
    isVerified: false,
    isAdmin: false,
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const response = await axios.post("/api/sign-up", user);
      if (response.status === 200) {
        router.push("/login");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={
        "flex flex-col items-center justify-center h-screen p-5 w-full"
      }
    >
      <h1 className={"text-2xl my-16"}>Sign Up</h1>
      <label className={"flex flex-col items-start"} htmlFor={"username"}>
        Username
      </label>
      <input
        className={
          " text-black my-4 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
        }
        type={"text"}
        id={"username"}
        placeholder={"Username"}
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />

      <label htmlFor={"email"}>Email</label>
      <input
        className={
          "text-black my-4 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
        }
        type={"text"}
        id={"email"}
        placeholder={"Email"}
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />

      <label htmlFor={"password"}>Password</label>
      <input
        className={
          "text-black my-4 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
        }
        type={"password"}
        id={"password"}
        placeholder={"Password"}
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <button
        className={
          "mt-4 border-2 border-white py-2 rounded hover:bg-white hover:text-black p-2 cursor-pointer"
        }
        onClick={onSubmit}
        disabled={buttonDisabled}
      >
        {loading ? <BounceLoader className={""} /> : "Sign Up"}
      </button>
      <Link className={"text-sm my-2"} href={"/login"}>
        Already have an account? Login
      </Link>
    </div>
  );
};

export default Page;
