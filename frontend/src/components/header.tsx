import { FC } from "react";
import { NavLink } from "react-router-dom";
import Button from "./ui/button";
import { cn } from "../helpers/cn";
import { useAuth } from "../providers/auth-context";

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  const { user, logout } = useAuth();
  const getActiveClass = ({ isActive }: { isActive: boolean }) => {
    return cn(
      "text-red-500 p-2 border rounded-full",
      isActive ? "border-red-500" : "border-transparent"
    );
  };

  return (
    <header className="mt-2 ">
      <div className="container flex justify-start bg-slate-900 rounded-full px-5 py-2.5 items-center">
        <span className="text-3xl text-red-500">
          Hotline{" "}
          <span className="text-xs text-white">
            Чернівці{" "}
            {user?.role === "admin" ? (
              <span className="text-red-500">[ADMIN]</span>
            ) : null}
          </span>
        </span>

        <nav className="ml-auto mr-12">
          <NavLink to="/" className={getActiveClass}>
            Блог
          </NavLink>
          {!!user && (
            <>
              <NavLink to="/events" className={getActiveClass}>
                Івенти
              </NavLink>
              <NavLink to="/leaderboard" className={getActiveClass}>
                Топ гонщиків
              </NavLink>
            </>
          )}
          <NavLink to="/about" className={getActiveClass}>
            Про нас
          </NavLink>
          <NavLink to="/contact" className={getActiveClass}>
            Контакти
          </NavLink>
        </nav>

        <fieldset className="max-w-sm flex ml-2.5 gap-2.5">
          {user ? (
            <div className="flex gap-5 items-center text-white">
              <NavLink to="/profile">
                {" "}
                <Button>Кабінет </Button>
              </NavLink>

              <Button
                onClick={logout}
                variant="secondary"
                className="flex flex-1"
              >
                Вийти
              </Button>
              {user.username}
            </div>
          ) : (
            <>
              {" "}
              <NavLink to="/register">
                <Button className="flex flex-1">Зареєструватися</Button>
              </NavLink>
              <NavLink to="/login">
                <Button variant="secondary" className="flex flex-1">
                  Увійти
                </Button>
              </NavLink>
            </>
          )}
        </fieldset>
      </div>
    </header>
  );
};

export default Header;
