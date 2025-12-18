import React from "react";
import { cn } from "@/lib/utils";

const Tables = <T,>({
  columns,
  data,
  className,
  currentPage: page = 1,
  itemsPerPage: limit = 10,
}: TableProps<T>) => {
  return (
    <div className="overflow-x-auto scrollbar">
      <table className={cn("w-full table-auto border-collapse", className)}>
        {/* Header */}
        <thead className="">
          <tr className="bg-slate-100 select-none">
            {columns.map((column, index) => (
              <td key={index} className={cn(column.className, "font-medium py-3.5 first:ps-7 last:pe-7 px-2 text-xs sm:text-sm first:rounded-l-md last:rounded-r-md text-slate-400")}>
                {index === 1 ? column.label : column.label}
              </td>
            ))}
          </tr>
        </thead>
        {/* Body */}
        <tbody>
          {data?.length > 0 ?
            data.map((row, rowIndex) => {
              return (
                <tr key={rowIndex} className=" hover:bg-slate-50/50 w-fit">
                  {columns.map((column, colIndex) => {
                    return (
                      <td key={colIndex} className={cn(column.className, "py-3.5 first:ps-7 last:pe-7 px-2 text-xs sm:text-sm font-normal text-neutral-800")}>
                        {column.label === "No" ? rowIndex + 1 : column.renderCell(row)}
                      </td>
                    )
                  })}
                </tr>
              )
            })
            :
            <tr>
              <td colSpan={columns.length} className="text-center px-7 py-3.5 text-xs sm:text-sm font-normal h-20">
                Data Not Found
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
};

export default Tables;
