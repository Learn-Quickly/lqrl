"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useApiLoginHandler } from "@/dist/kubb";
import { localstorageKeys } from "@/constants";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    login.mutate({} as unknown as void);
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center p-12 md:p-24">
      <h1 className="text-4xl font-bold">Вхід</h1>
      <p className="mt-4 text-lg text-primary-600">Вхід у систему LQRL</p>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col items-center">
        <input
          type="text"
          placeholder="Імʼя користувача"
          className="rounded-md border border-primary-300 px-4 py-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="mt-4 rounded-md border border-primary-300 px-4 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="mt-4 rounded-md bg-primary-500 px-4 py-2 text-white"
        >
          Увійти
        </button>
        {login.isError && (
          <div className="mt-4 text-red-500">Помилка входу в систему</div>
        )}
        <Link href="/register" className="mt-4 text-primary-600">
          Реєстрація
        </Link>
      </form>
    </div>
  );
}
