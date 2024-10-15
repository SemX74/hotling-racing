import { FC, useEffect } from "react";
import Input from "../ui/input";
import Button from "../ui/button";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { authApi } from "../../api/api";
import { TEvent, TUpdateEvent } from "../../types";
import { ModalProps } from "../../hooks/use-modal";

interface EditEventModalProps extends ModalProps {
  activeId: number | null;
}

const EditEventModal: FC<EditEventModalProps> = ({
  activeId,
  isOpen,
  onClose,
}) => {
  const client = useQueryClient();

  const { data: event } = useQuery(["events", activeId], async () => {
    const response = await authApi.get<TEvent>(`/events/${activeId}`);
    return response.data;
  });

  const { mutateAsync } = useMutation("events", async (data: TUpdateEvent) => {
    const response = await authApi.put("/events/" + activeId, data);
    return response;
  });

  const { register, handleSubmit, reset } = useForm<TUpdateEvent>({
    defaultValues: {
      event_status: !!event?.event_status,
      max_participants: event?.max_participants || 2,
    },
  });

  useEffect(() => {
    if (!event) return;
    reset(event);
  }, [event]);

  const onSubmit = async (data: TUpdateEvent) => {
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
              Редагувати гонку {event?.event_name}
            </DialogTitle>
            <form
              className="text-white flex-col gap-2.5 flex"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                label="Максимум учасників"
                type="number"
                {...register("max_participants", {
                  min: { value: 2, message: "Minimum 2 participants" },
                  required: true,
                })}
              />

              <Input
                classNames={{
                  label: "flex flex-row-reverse mr-auto my-2.5 gap-2.5 items-center justify-center",
                }}
                className="h-5 w-5"
                type="checkbox"
                label="Активна"
                {...register("event_status")}
              />

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

export default EditEventModal;
