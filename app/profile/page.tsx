"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { useApiChangePwdHandler, useApiUpdateUserHandler } from "@/dist/kubb";
import { useRouter } from "next/navigation";
import { loginReasons } from "@/constants";
import { Toggle } from "@/components/ui/toggle";
import { Eye, EyeOff } from "lucide-react";

export default function Profile() {
  const router = useRouter();
  const { username: storeUsername, logout } = useAuthStore();

  const [username, setUsername] = useState(storeUsername);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const updateUsername = useApiUpdateUserHandler({
    mutation: {
      onSuccess: (data) => {
        console.log("update username success", data);
        logout();
        router.push(`/login?reason=${loginReasons.usernameUpdated}`);
      },
    },
  });

  function handleUsernameUpdate() {
    updateUsername.mutate({ data: { username } });
  }

  const changePassword = useApiChangePwdHandler({
    mutation: {
      onSuccess: (data) => {
        console.log("change password success", data);
        logout();
        router.push(`/login?reason=${loginReasons.passwordUpdated}`);
      },
    },
  });

  function handlePasswordUpdate() {
    changePassword.mutate({
      data: { pwd_clear: password, new_pwd_clear: newPassword },
    });
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <main className="flex min-h-full flex-col items-center justify-center bg-primary-100 p-4 md:p-8">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg md:p-8">
        <h1 className="mb-6 text-2xl font-bold">Налаштування профілю</h1>
        <section className="space-y-4">
          <div>
            <Label htmlFor="username">Імʼя користувача</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="username"
                placeholder="Нове імʼя користувача"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button
                variant={updateUsername.isError ? "destructive" : "default"}
                onClick={handleUsernameUpdate}
              >
                Оновити
              </Button>
            </div>
            {updateUsername.isError && (
              <div className="text-sm font-medium text-red-500">
                Користувач з таким імʼям вже існує
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="current-password">Поточний пароль</Label>
            <div className="flex gap-2">
              <Input
                id="current-password"
                placeholder="Введіть поточний пароль"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Toggle
                aria-label="Показати поточний пароль"
                pressed={showPassword}
                onPressedChange={(p) => setShowPassword(p)}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Toggle>
            </div>
          </div>
          <div>
            <Label htmlFor="new-password">Новий пароль</Label>
            <div className="flex gap-2">
              <Input
                id="new-password"
                placeholder="Введіть новий пароль"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Toggle
                aria-label="Показати пароль"
                pressed={showNewPassword}
                onPressedChange={(p) => setShowNewPassword(p)}
              >
                {showNewPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Toggle>
            </div>
          </div>
          <Button
            onClick={handlePasswordUpdate}
            variant={updateUsername.isError ? "destructive" : "default"}
          >
            Оновити пароль
          </Button>
          {changePassword.isError && (
            <div className="text-sm font-medium text-red-500">
              Неправильний пароль
            </div>
          )}
        </section>
        <div className="mt-8 text-center">
          <Button size="sm" variant="ghost" onClick={handleLogout}>
            Вийти
          </Button>
        </div>
      </div>
    </main>
  );
}
