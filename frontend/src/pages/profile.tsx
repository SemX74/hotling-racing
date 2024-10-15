import { FC } from "react";
import { useAuth } from "../providers/auth-context";
import { authApi } from "../api/api";
import { TCar } from "../types";
import { useQuery } from "react-query";
import Button from "../components/ui/button";
import { useModal } from "../hooks/use-modal";
import NewVehicleModal from "../components/modals/new-vehicle-modal";
import { useRegisteredEvents } from "../hooks/use-registered-events";

const Profile: FC = () => {
  const { user } = useAuth();
  const newVehicleModalProps = useModal();

  const { data } = useRegisteredEvents();

  const { data: cars } = useQuery("cars", async () => {
    const response = await authApi.get<TCar[]>(
      "http://localhost:8001/users/me/cars"
    );
    return response;
  });

  return (
    <div>
      <h1 className="text-6xl text-white mb-12">
        Профіль 👤 {user?.username}{" "}
        {user?.role === "admin" && (
          <span className="text-red-500 text-xs">Адміністратор</span>
        )}
      </h1>
      <h1 className="text-3xl text-white mb-12">Мої івенти</h1>
      <div className="bg-slate-900 text-white rounded-xl shadow p-5">
        {!data?.data?.length
          ? "Немає івентів"
          : data?.data.map((event) => (
              <div
                key={event.id}
                className="p-5 w-fit bg-slate-800 rounded-xl mb-5"
              >
                <h2 className="text-2xl text-white">{event.event_name}</h2>
                <p className="text-white">{event.event_description}</p>
                <p className="text-white">{event.event_date}</p>
              </div>
            ))}
      </div>

      <h1 className="text-3xl flex justify-between items-center mt-12 text-white mb-12">
        Мої автомобілі
        <Button className="ml-auto" onClick={newVehicleModalProps.onOpen}>
          Додати автомобіль
        </Button>
      </h1>
      <div className="bg-slate-900 text-white rounded-xl shadow p-5">
        {!cars?.data?.length
          ? "Немає авто"
          : cars?.data.map((car) => (
              <div key={car.id} className="p-5 bg-slate-800 rounded-xl mb-5">
                <h2 className="text-2xl text-white">{car.make}</h2>
                <p className="text-white">{car.model}</p>
                <p className="text-white">{car.year}</p>
              </div>
            ))}
      </div>
      <NewVehicleModal {...newVehicleModalProps} />
    </div>
  );
};

export default Profile;
