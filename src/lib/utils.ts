import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState, useEffect } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export const useWithDevice = () => {
  const [widthDevice, setWithDevice] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWithDevice(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { widthDevice };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function getInitialsName(fullName: string | undefined = "Layla Cake") {
  const words = fullName.trim().split(" ");
  const firstInitial = words[0].charAt(0);
  const lastInitial = words[words.length - 1].charAt(0);
  return firstInitial + lastInitial;
}
