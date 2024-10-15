import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "../components/ui/button";

import StreetRacingImage from "../assets/street-racing.jpg";
import Input from "../components/ui/input";
import { useAuth } from "../providers/auth-context";
import { useState } from "react";
import { cn } from "../helpers/cn";

type RegisterValues = {
  username: string;
  password: string;
  repeatPassword: string;
};

function Register() {
  const { register: registerUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    defaultValues: {
      username: "",
      password: "",
      repeatPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async ({ password, username }: RegisterValues) => {
    await registerUser(username, password, isAdmin ? "admin" : undefined);
  };

  return (
    <div className="flex items-center w-full">
      <div className="w-1/2 h-full flex flex-col justify-center text-white items-center">
        <h2
          onClick={() => setIsAdmin((p) => !p)}
          className={cn("text-3xl mb-12", isAdmin ? "text-red-500" : "")}
        >
          Реєстрація
        </h2>
        <div className="flex max-w-xl flex-col w-full">
          <form
            className="flex gap-2.5 flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              error={errors.username?.message}
              label="Ім'я користувача:"
              {...register("username", {
                required: true,
                minLength: {
                  message: "Мінімальна довжина 3 символи",
                  value: 3,
                },
              })}
              required
            />
            <Input
              label="Пароль:"
              {...register("password", {
                minLength: {
                  message: "Мінімальна довжина 3 символи",
                  value: 3,
                },
                required: true,
              })}
            />
            <Input
              error={errors.repeatPassword?.message}
              label="Повторити пароль"
              {...register("repeatPassword", {
                validate: (value) =>
                  value === password || "Паролі не співпадають",
                required: true,
                minLength: {
                  message: "Мінімальна довжина 3 символи",
                  value: 3,
                },
              })}
            />

            <Button type="submit" className="w-full mt-2.5">
              Увійти
            </Button>
            <p className="text-xs text-gray-400">
              Нажимаючи кнопку "Зареєструватися" ви підтверджуєте що ознайомлені
              з нашою політикою конфіденційності та те, що вам є 18 років.
            </p>
          </form>
          <p className="text-xs text-center mt-5">
            Вже маєте аккаунт?{" "}
            <Link className="text-red-500 hover:underline" to="/login">
              Увійти
            </Link>
          </p>
        </div>
      </div>
      <img
        src={StreetRacingImage}
        alt="Street Racing"
        className="w-1/2 flex h-screen object-center object-cover"
      />
    </div>
  );
}

export default Register;
