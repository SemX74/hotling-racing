import { Link } from "react-router-dom";
import { useAuth } from "../providers/auth-context";
import { useForm } from "react-hook-form";
import Button from "../components/ui/button";

import StreetRacingImage from "../assets/street-racing.jpg";
import Input from "../components/ui/input";

type LoginValues = {
  username: string;
  password: string;
};

function Login() {
  const { login } = useAuth();

  const { register, handleSubmit } = useForm<LoginValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async ({ password, username }: LoginValues) => {
    await login(username, password);
  };

  return (
    <div className="flex items-center w-full">
      <img
        src={StreetRacingImage}
        alt="Street Racing"
        className="w-1/2 flex h-screen object-center object-cover"
      />
      <div className="w-1/2 h-full flex flex-col justify-center text-white items-center">
        <h2 className="text-3xl mb-12">Вхід до системи</h2>
        <div className="flex max-w-xl flex-col w-full">
          <form
            className="flex gap-2.5 flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input {...register("username")} label="Ім'я користувача:" />
            <Input {...register("password")} label="Пароль:" />
            <Button type="submit" className="w-full mt-2.5">
              Увійти
            </Button>
          </form>
          <p className="text-xs text-center mt-2.5">
            He маєте акаунта?{" "}
            <Link className="text-red-500 hover:underline" to="/register">
              Зареєструватися
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
