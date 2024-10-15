import { FC, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { authApi } from "../api/api";
import { useAuth } from "../providers/auth-context";
import { TEvent } from "../types";
import NewEventModal from "../components/modals/new-event-modal";
import Button from "../components/ui/button";
import toast from "react-hot-toast";
import { useModal } from "../hooks/use-modal";
import EditEventModal from "../components/modals/edit-event-modal";
import { cn } from "../helpers/cn";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useRegisteredEvents } from "../hooks/use-registered-events";
import ProgressBar from "../components/ui/progress-bar";

interface EventsProps {}

const Events: FC<EventsProps> = () => {
  const { user } = useAuth();
  const client = useQueryClient();
  const { data: registered } = useRegisteredEvents();

  const [activeId, setActiveId] = useState<null | number>(null);
  const newEventModalProps = useModal();
  const editEventModalProps = useModal();

  const navigate = useNavigate();

  const viewParticipants = (id: number) => {
    navigate(`/events/${id}`);
  };

  const { mutateAsync: registerOnEvent } = useMutation(
    "registered-events",
    async (id: number) => {
      const response = await authApi.post(`/events/${id}/register`);
      client.refetchQueries("registered-events");
      client.refetchQueries("events");
      toast.success("Ви успішно зареєструвались на гонку");
      return response;
    }
  );

  const { mutateAsync: deleteEvent } = useMutation(
    "events",
    async (id: number) => {
      const response = await authApi.delete(`/events/${id}`);
      client.refetchQueries("events");
      return response;
    }
  );

  const handleDeleteEvent = async (id: number) => {
    try {
      await deleteEvent(id);
      toast.success("Подію успішно видалено");
    } catch (error: any) {
      toast.error("Event deletion failed:", error);
    }
  };

  const { data } = useQuery("events", async () => {
    const response = await authApi.get<TEvent[]>(
      "http://localhost:8001/events"
    );
    return response;
  });

  const getIsUserRegistered = (event: TEvent) => {
    return registered?.data?.some((e) => e.id === event.id);
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-6xl text-white">Список гонок</h1>
        {user?.role === "admin" && (
          <Button onClick={newEventModalProps.onOpen}>Запланувати гонку</Button>
        )}
      </header>
      <div className="bg-slate-900 rounded-xl shadow p-5">
        <table className="w-full text-start  text-white ">
          <thead className="border-b border-white/20">
            <tr>
              <th className="p-2 text-start">Імʼя</th>
              <th className="p-2 text-start">Початок</th>
              <th className="p-2 text-start">Місце</th>
              <th className="p-2 text-start">Макс. учасників</th>
              <th className="p-2 text-start">Статус</th>
              <th className="p-2 text-start">Дії</th>
            </tr>
          </thead>
          <tbody className="p-5">
            {[...(data?.data ?? [])]
              .sort(
                (a, b) =>
                  dayjs(a.event_date).unix() - dayjs(b.event_date).unix()
              )
              .map((event) => (
                <tr className="" key={event.id}>
                  <td className="p-2 text-start">{event.event_name}</td>
                  <td className="p-2 text-start">
                    {dayjs(event.event_date).format("YYYY-MM-DD")}
                  </td>
                  <td className="p-2 text-start">{event.event_location}</td>
                  <td className="p-2 text-start">
                    <ProgressBar
                      maxValue={event.max_participants}
                      value={event.participants.length}
                    />
                  </td>
                  <td
                    className={cn(
                      "p-2 text-start items-center flex",
                      event.winner
                        ? "text-blue-500"
                        : event.event_status
                        ? "text-green-500"
                        : "text-red-500"
                    )}
                  >
                    {event.winner
                      ? "Завершена"
                      : event.event_status
                      ? "Активна"
                      : "Неактивна"}
                  </td>

                  {event.winner ? (
                    <td>
                      Переможець - {event.winner.username} (
                      {event.winner.rating} балів)
                    </td>
                  ) : user?.role === "admin" ? (
                    <td>
                      <Button
                        className="py-1"
                        onClick={() => viewParticipants(event.id)}
                      >
                        Учасники
                      </Button>
                      <Button
                        variant="secondary"
                        className="py-1"
                        onClick={() => {
                          setActiveId(event.id);
                          editEventModalProps.onOpen();
                        }}
                      >
                        Змінити
                      </Button>
                      <Button
                        variant="secondary"
                        className="py-1"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Видалити
                      </Button>
                    </td>
                  ) : (
                    <td className="p-2 text-start">
                      {getIsUserRegistered(event) ? (
                        "Ви вже зареєстровані"
                      ) : (
                        <Button
                          onClick={() => registerOnEvent(event.id)}
                          className="py-1"
                        >
                          Зареєструватися
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <NewEventModal {...newEventModalProps} />
      {editEventModalProps.isOpen && (
        <EditEventModal {...editEventModalProps} activeId={activeId} />
      )}
    </div>
  );
};

export default Events;
