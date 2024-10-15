import { FC } from "react";
import Input from "../components/ui/input";
import TextArea from "../components/ui/textarea";
import Button from "../components/ui/button";

const Contact: FC = () => {
  return (
    <div className="text-white grid gap-12 grid-cols-3">
      <div className="col-span-2">
        <div className="bg-slate-900 mb-5 rounded-xl p-5">
          <h1 className="text-6xl mb-12">Зв'яжіться з Нами</h1>
          <p>
            Ми завжди раді спілкуванню з нашими учасниками та тими, хто
            зацікавлений у діяльності <strong>Hotline Chernivtsi</strong>.
            Залиште нам повідомлення, і ми зв'яжемося з вами найближчим часом.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-slate-900 rounded-xl p-5">
            <h2 className="text-3xl mb-6">Контактна Інформація</h2>
            <ul>
              <li>
                <strong>Телефон:</strong> +38 (0372) 123-45-67
              </li>
              <li>
                <strong>Електронна пошта:</strong> info@hotline-chernivtsi.ua
              </li>
              <li>
                <strong>Адреса:</strong> вул. Головна, 100, м. Чернівці, 58000,
                Україна
              </li>
            </ul>
          </div>
          <div className="bg-slate-900 rounded-xl p-5">
            <h2 className="text-3xl mb-6">Години Роботи</h2>
            <ul>
              <li>
                <strong>Понеділок - П'ятниця:</strong> 09:00 - 18:00
              </li>
              <li>
                <strong>Субота:</strong> 10:00 - 16:00
              </li>
              <li>
                <strong>Неділя:</strong> Вихідний
              </li>
            </ul>
          </div>
        </div>
      </div>

      <form className="flex gap-2.5 col-span-1 flex-col bg-slate-900 p-5 rounded-xl w-full">
        <h2 className="text-3xl text-center mb-3">Форма Зворотного Зв'язку</h2>
        <Input label="Імʼя" required />
        <Input label="Електронна пошта:" type="email" required />
        <TextArea label="Повідомлення:" rows={5} required />

        <Button type="submit" className="mt-12">
          Відправити
        </Button>
      </form>
    </div>
  );
};

export default Contact;
