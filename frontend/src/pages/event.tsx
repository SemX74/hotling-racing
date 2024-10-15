import { FC } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { authApi } from "../api/api";
import { TEvent } from "../types";
import Button from "../components/ui/button";
import { useAuth } from "../providers/auth-context";
import dayjs from "dayjs";
import toast from "react-hot-toast";

interface EventProps {}

const Event: FC<EventProps> = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const client = useQueryClient();
  const { data: event } = useQuery(
    ["events", id],
    async () => {
      const response = await authApi.get<TEvent>(`/events/${id}`);
      return response.data;
    },
    {
      enabled: !!id,
    }
  );

  const { mutateAsync: markAsWinner } = useMutation(
    "events",
    async (userId: number) => {
      const response = await authApi.post(`/events/${id}/set_winner/${userId}`);
      client.invalidateQueries("events");
      return response;
    }
  );

  const handleMarkAsWinner = async (userId: number) => {
    try {
      await markAsWinner(userId);
      toast.success("Користувача позначено як переможця");
    } catch (error: any) {
      console.error("Mark as winner failed:", error);
    }
  };

  return (
    <div>
      <h1 className="text-6xl text-white">
        {event?.event_name} - {dayjs(event?.event_date).format("YYYY-MM-DD")}
      </h1>
      <p className="text-white mb-12">{event?.event_description}</p>
      {event?.winner ? (
        <p className="text-green-500">Переможець: {event.winner.username}</p>
      ) : null}

      <div className="bg-slate-900 rounded-xl shadow p-5">
        <table className="w-full text-start  text-white ">
          <thead className="border-b border-white/20">
            <tr>
              <th className="p-2 text-start">ID</th>
              <th className="p-2 text-start">Рейтинг</th>
              <th className="p-2 text-start">Імʼя</th>
              {user?.role === "admin" && !event?.winner && (
                <th className="p-2 text-start">Дії</th>
              )}
            </tr>
          </thead>
          <tbody className="p-5">
            {event?.participants?.map((participant) => (
              <tr className="" key={participant.id}>
                <td className="p-2 text-start">{participant.id}</td>

                <td className="p-2 text-start">{participant.rating}</td>
                <td className="p-2 text-start">{participant.username}</td>
                {user?.role === "admin" && !event.winner ? (
                  <td className="p-2 flex gap-2.5 text-start">
                    <Button
                      onClick={() => handleMarkAsWinner(participant.id)}
                      className="py-1"
                    >
                      Позначити як переможця
                    </Button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Event;
