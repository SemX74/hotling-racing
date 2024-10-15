import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";
import classNames from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(classNames(inputs));
}
