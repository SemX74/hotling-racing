import { ComponentProps, FC } from "react";
import { cn } from "../../helpers/cn";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary";
}

const Button: FC<ButtonProps> = ({ variant = 'primary', className, children, ...rest }) => {
  return (
    <button
      {...rest}
      className={cn(
        "py-2.5 px-5 rounded-full border border-red-500",
        {
          "bg-red-500 text-white ": variant === "primary",
          "bg-transparent text-red-500": variant === "secondary",
        },
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
