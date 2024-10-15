import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { FC } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useQueryClient, useMutation } from "react-query";
import { authApi } from "../../api/api";
import { TCreateCar } from "../../types";
import { ModalProps } from "../../hooks/use-modal";
import Input from "../ui/input";
import Button from "../ui/button";
import dayjs from "dayjs";

interface NewVehicleModalProps extends ModalProps {}

const NewVehicleModal: FC<NewVehicleModalProps> = ({ onClose, isOpen }) => {
  const client = useQueryClient();
  const { mutateAsync } = useMutation("cars", async (data: TCreateCar) => {
    const response = await authApi.post("/users/me/cars", data);
    return response;
  });

  const { register, handleSubmit, reset } = useForm<TCreateCar>({
    defaultValues: {
      make: "",
      model: "",
      year: dayjs().year(),
    },
  });

  const onSubmit = async (data: TCreateCar) => {
    try {
      await mutateAsync(data);
      client.invalidateQueries("cars");
      toast.success("Автомобіль успішно додано");
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
              Додати авто
            </DialogTitle>
            <form
              className="text-white flex-col gap-2.5 flex"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                label="Марка"
                {...register("make", {
                  minLength: { value: 3, message: "Name is too short" },
                  required: true,
                })}
              />
              <Input
                label="Модель"
                {...register("model", {
                  minLength: { value: 3, message: "Description is too short" },
                  required: true,
                })}
              />
              <Input
                label="Рік"
                type="number"
                {...register("year", {
                  minLength: { value: 3, message: "Location is too short" },
                  valueAsNumber: true,
                  required: true,
                })}
              />

              <div className="flex justify-between mt-5">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Назад
                </Button>
                <Button type="submit">Додати</Button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default NewVehicleModal;
