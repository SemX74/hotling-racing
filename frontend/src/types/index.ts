export type TCreateEvent = {
  event_name: string;
  event_date: string;
  event_location: string;
  event_description: string;
  max_participants: number;
};

export type TUser = {
  id: number;
  username: string;
  rating: number;
};

export type TUpdateEvent = {
  max_participants: number;
  event_status: boolean;
};

export type TEvent = {
  id: number;
  event_status: boolean;
  participants: TUser[];
  winner: TUser | null;
} & TCreateEvent;

export type TCreateCar = {
  make: string;
  model: string;
  year: number;
};

export type TCar = TCreateCar & {
  id: number;
};

export type TUpdateCar = TCreateCar;
