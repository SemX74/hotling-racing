import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { authApi } from "../../api/api";
import { TCreateEvent } from "../../types";
import Input from "../ui/input";
import Button from "../ui/button";
import toast from "react-hot-toast";
import { ModalProps } from "../../hooks/use-modal";

const NewEventModal: FC<ModalProps> = ({ onClose, isOpen }) => {
  const client = useQueryClient();
  const { mutateAsync } = useMutation("events", async (data: TCreateEvent) => {
    const response = await authApi.post("/events", data);
    return response;
  });

  const { register, handleSubmit, reset } = useForm<TCreateEvent>({
    defaultValues: {
      event_date: new Date().toISOString(),
      event_name: "",
      event_description: "",
      event_location: "",
      max_participants: 2,
    },
  });

  const onSubmit = async (data: TCreateEvent) => {
    try {
      await mutateAsync(data);
      client.invalidateQueries("events");
      toast.success("Подію успішно створено");
      reset();
      onClose();
    } catch (error: any) {
      toast.error("Event creation failed:", error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={onClose}
    >
      <DialogBackdrop
        transition
        onClick={onClose}
        className="bg-black/30 backdrop-blur-sm w-full fixed top-0 left-0 h-screen"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle
              as="h3"
              className="text-base/7 text-red-500 mb-2 font-medium "
            >
              Запланувати поїздку
            </DialogTitle>
            <form
              className="text-white flex-col gap-2.5 flex"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                label="Назва"
                {...register("event_name", {
                  minLength: { value: 3, message: "Name is too short" },
                  required: true,
                })}
              />
              <Input
                label="Опис"
                {...register("event_description", {
                  minLength: { value: 3, message: "Description is too short" },
                  required: true,
                })}
              />
              <Input
                label="Місце події"
                {...register("event_location", {
                  minLength: { value: 3, message: "Location is too short" },
                  required: true,
                })}
              />
              <div className="grid grid-cols-2 gap-2.5">
                <Input
                  label="Максимум учасників"
                  type="number"
                  {...register("max_participants", {
                    min: { value: 2, message: "Minimum 2 participants" },
                    required: true,
                  })}
                />
                <Input
                  label="Дата"
                  type="date"
                  {...register("event_date", {
                    required: true,
                  })}
                />
              </div>

              <div className="flex justify-between mt-5">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Назад
                </Button>
                <Button type="submit">Запланувати</Button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default NewEventModal;
