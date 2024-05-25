"use client";

import { useMemo, useState } from "react";
import { useApiLoginHandler, useApiRegisterHandler } from "@/dist/kubb";
import { useRouter } from "next/navigation";
import { localstorageKeys } from "@/constants";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const basicAuth = useMemo(() => {
    return Buffer.from(`${username}:${password}`).toString("base64");
  }, [username, password]);

  const login = useApiLoginHandler({
    mutation: {
      onSuccess: (data) => {
        localStorage.setItem(
          localstorageKeys.accessToken,
          data.result.access_token,
        );
        localStorage.setItem(
          localstorageKeys.refreshToken,
          data.result.refresh_token,
        );
        localStorage.setItem(localstorageKeys.username, username);
        router.push("/");
      },
      onError: (error) => {
        console.log("login error", error);
      },
    },
    client: {
      headers: {
        Authorization: `Basic ${basicAuth}`,
      },
    },
  });

  const register = useApiRegisterHandler({
    mutation: {
      onSuccess: () => {
        login.mutate({} as unknown as void);
      },
      onError: (error) => {
        console.log("register error", error);
      },
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    register.mutate({ data: { username, pwd: password } });
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center p-12 md:p-24">
      <h1 className="text-4xl font-bold">Register</h1>
      <p className="mt-4 text-lg text-stone-600">Create new account</p>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col items-center">
        <input
          type="text"
          placeholder="Username"
          className="rounded-md border border-stone-300 px-4 py-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="mt-4 rounded-md border border-stone-300 px-4 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="mt-4 rounded-md bg-stone-500 px-4 py-2 text-white"
        >
          Register
        </button>
        {register.isError && (
          <div className="mt-4 text-red-500">Register error</div>
        )}
      </form>
    </div>
  );
}
