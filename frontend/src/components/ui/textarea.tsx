import { ComponentProps, forwardRef } from "react";
import { cn } from "../../helpers/cn";

interface TextAreaProps extends ComponentProps<"textarea"> {
  label?: string;
  error?: string;
  classNames?: {
    input?: string;
    label?: string;
  };
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, className, error, classNames, ...rest }, ref) => {
    return (
      <label className={cn("flex flex-col", classNames?.label)}>
        {label}
        <textarea
          ref={ref}
          className={cn(
            "py-2.5 px-5 rounded-xl bg-slate-700 text-white",
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

export default TextArea;
