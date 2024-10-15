import cls from "clsx";
import { FC, ReactNode } from "react";

interface ProgressBarProps {
  classNames?: {
    wrapper?: string;
    label?: string;
    bar?: string;
  };
  value?: number;
  formatValue?: (value: number) => ReactNode;
  maxValue: number;
  showMaxValue?: boolean;
}

const ProgressBar: FC<ProgressBarProps> = ({
  classNames,
  maxValue = 0,
  formatValue,
  showMaxValue = true,
  value = 0,
}) => {
  return (
    <div
      className={cls(
        "relative rounded h-5 w-full shadow-inner overflow-hidden mt-auto",
        "bg-slate-700",
        classNames?.wrapper
      )}
    >
      {maxValue ? (
        <div
          className={cls(
            "absolute h-full left-0",
            value === maxValue ? "rounded-none" : "rounded-r-xl",
            value >= maxValue ? "bg-green-500" : "bg-red-500",
            classNames?.bar
          )}
          style={{
            width: `${(value * 100) / maxValue}%`,
          }}
        />
      ) : null}

      <div
        className={cls(
          "absolute z-10 whitespace-nowrap left-1/2 px-2 py-0.5 rounded font-bold top-1/2 -translate-x-1/2 -translate-y-1/2 text-center",
          maxValue ? "bg-white text-slate-500 leading-3 text-xs" : "text-white",
          classNames?.label
        )}
      >
        {formatValue ? formatValue(value) : value}
        {maxValue && showMaxValue ? (
          <span>
            {" / "}
            {maxValue}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default ProgressBar;
