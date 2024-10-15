import { useQuery } from "react-query";
import { authApi } from "../api/api";
import { TEvent } from "../types";

export const useRegisteredEvents = () =>
  useQuery("registered-events", async () => {
    const response = await authApi.get<TEvent[]>(
      "http://localhost:8001/users/me/events"
    );
    return response;
  });
