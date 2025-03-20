import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { PiCaretDown } from "react-icons/pi";

interface Props {
  total: number;
  displayed: number;
  onChangeDisplayed: (value: number) => void;
  className?: string;
  list?: number[];
}

const PaginationInfo: React.FC<Props> = ({
  list = [10, 15, 20, 25],
  total,
  displayed,
  onChangeDisplayed,
  className,
}) => {
  return (
    <div className={cn("flex items-center space-x-2 w-full", className)}>
      <span className="text-sm">Displaying</span>
      <div className="relative">
        <select
          value={displayed}
          onChange={(e) => onChangeDisplayed(Number(e.target.value))}
          className="appearance-none border text-sm rounded px-4 py-1 pr-8 focus:outline-none focus:border-border"
        >
          {list.map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        <PiCaretDown className="pointer-events-none absolute inset-y-0 right-2 flex items-center my-auto" />
      </div>
      <span className="text-sm">of {total} datas</span>
    </div>
  );
};

export default PaginationInfo;
