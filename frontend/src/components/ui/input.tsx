import { ComponentProps, forwardRef } from "react";
import { cn } from "../../helpers/cn";

interface InputProps extends ComponentProps<"input"> {
  label?: string;
  error?: string;
  classNames?: {
    input?: string;
    label?: string;
  };
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, error, classNames, ...rest }, ref) => {
    return (
      <label className={cn("flex flex-col", classNames?.label)}>
        {label}
        <input
          ref={ref}
          className={cn(
            "py-2.5 px-5 rounded-full bg-slate-700 text-white",
            className,
            classNames?.input
          )}
          {...rest}
        />
        {error && <span className="text-red-500 text-xs">{error}</span>}
      </label>
    );
  }
);

export default Input;
