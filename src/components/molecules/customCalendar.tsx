"use client"

import * as React from "react"
import { format, addMonths, subMonths, getYear, setYear, getMonth, setMonth } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { DateRange } from "react-day-picker"
import { id } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type CalendarMode = "single" | "multiple" | "range"

interface CustomCalendarProps {
    className?: string
    mode?: CalendarMode
    placeholder?: string
    onDateChange?: (date: Date | Date[] | DateRange | undefined) => void
    defaultValue?: Date | Date[] | DateRange
    disabled?: boolean
}

export function CustomCalendar({
    className,
    mode = "single",
    placeholder = "Pilih tanggal",
    onDateChange,
    defaultValue,
    disabled = false,
}: CustomCalendarProps) {
    // State untuk menyimpan tanggal yang dipilih berdasarkan mode
    const [singleDate, setSingleDate] = React.useState<Date | undefined>(
        mode === "single" && defaultValue instanceof Date ? defaultValue : undefined,
    )
    const [multipleDates, setMultipleDates] = React.useState<Date[] | undefined>(
        mode === "multiple" && Array.isArray(defaultValue) ? defaultValue : undefined,
    )
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
        mode === "range" && defaultValue && typeof defaultValue === "object" && !Array.isArray(defaultValue)
            ? (defaultValue as DateRange)
            : undefined,
    )

    const [month, setCurrentMonth] = React.useState<Date>(
        defaultValue instanceof Date
            ? defaultValue
            : Array.isArray(defaultValue) && defaultValue.length > 0
                ? defaultValue[0]
                : defaultValue && typeof defaultValue === "object" && "from" in defaultValue && defaultValue.from
                    ? defaultValue.from
                    : new Date(),
    )
    const [open, setOpen] = React.useState(false)

    // Daftar bulan dalam bahasa Indonesia
    const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ]

    // Membuat array tahun (10 tahun ke belakang dan 10 tahun ke depan)
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)

    // Handler untuk navigasi bulan
    const handlePreviousMonth = () => {
        setCurrentMonth((prevMonth) => subMonths(prevMonth, 1))
    }

    const handleNextMonth = () => {
        setCurrentMonth((prevMonth) => addMonths(prevMonth, 1))
    }

    // Handler untuk pemilihan bulan dan tahun
    const handleMonthChange = (monthIndex: string) => {
        setCurrentMonth((prevMonth) => setMonth(prevMonth, Number.parseInt(monthIndex)))
    }

    const handleYearChange = (year: string) => {
        setCurrentMonth((prevMonth) => setYear(prevMonth, Number.parseInt(year)))
    }

    // Handler untuk reset tanggal
    const handleReset = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation() // Mencegah event bubbling ke parent (PopoverTrigger)
        }

        if (mode === "single") {
            setSingleDate(undefined)
        } else if (mode === "multiple") {
            setMultipleDates(undefined)
        } else if (mode === "range") {
            setDateRange(undefined)
        }

        // Memanggil callback onDateChange dengan nilai undefined
        if (onDateChange) {
            onDateChange(undefined)
        }
    }

    // Handler untuk pemilihan tanggal berdasarkan mode
    const handleSelect = (value: Date | Date[] | DateRange | undefined) => {
        if (mode === "single") {
            setSingleDate(value as Date)
            if (value) {
                setTimeout(() => setOpen(false), 300)
            }
        } else if (mode === "multiple") {
            setMultipleDates(value as Date[])
        } else if (mode === "range") {
            setDateRange(value as DateRange)
            if (value && (value as DateRange).to) {
                setTimeout(() => setOpen(false), 300)
            }
        }
    }

    // Effect untuk memanggil callback onDateChange saat tanggal berubah
    React.useEffect(() => {
        if (onDateChange) {
            if (mode === "single") {
                onDateChange(singleDate)
            } else if (mode === "multiple") {
                onDateChange(multipleDates)
            } else if (mode === "range") {
                onDateChange(dateRange)
            }
        }
    }, [singleDate, multipleDates, dateRange, onDateChange, mode])

    // Fungsi untuk menampilkan tanggal yang dipilih berdasarkan mode
    const getSelectedDateDisplay = () => {
        if (mode === "single" && singleDate) {
            return format(singleDate, "d MMMM yyyy", { locale: id })
        } else if (mode === "multiple" && multipleDates && multipleDates.length > 0) {
            return multipleDates.length === 1
                ? format(multipleDates[0], "d MMMM yyyy", { locale: id })
                : `${multipleDates.length} tanggal dipilih`
        } else if (mode === "range" && dateRange) {
            if (dateRange.from) {
                if (dateRange.to) {
                    return `${format(dateRange.from, "d MMMM yyyy", { locale: id })} - ${format(dateRange.to, "d MMMM yyyy", {
                        locale: id,
                    })}`
                }
                return format(dateRange.from, "d MMMM yyyy", { locale: id })
            }
        }
        return placeholder
    }

    // Mendapatkan nilai selected berdasarkan mode
    const getSelectedValue = () => {
        if (mode === "single") return singleDate
        if (mode === "multiple") return multipleDates
        if (mode === "range") return dateRange
        return undefined
    }

    // Cek apakah ada tanggal yang dipilih
    const hasSelectedDate = () => {
        if (mode === "single") return !!singleDate
        if (mode === "multiple") return !!(multipleDates && multipleDates.length > 0)
        if (mode === "range") return !!(dateRange && (dateRange.from || dateRange.to))
        return false
    }

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
                <PopoverTrigger asChild disabled={disabled}>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full flex justify-between text-left font-normal relative px-2.5",
                            !getSelectedValue() && "text-muted-foreground",
                            disabled && "opacity-50 cursor-not-allowed",
                        )}
                    >
                        <div className="flex flex-1 gap-2 w-full items-center">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span className="flex-grow">{getSelectedDateDisplay()}</span>
                        </div>
                        {hasSelectedDate() && (
                            <div
                                onClick={handleReset}
                                className="cursor-pointer bg-muted rounded-full p-1 transition-colors"
                                aria-label="Reset tanggal"
                            >
                                <X className="h-4 w-4" />
                            </div>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    {/* Custom Header - Selalu ditampilkan terlepas dari status pemilihan tanggal */}
                    <div className="p-3 w-full border-b">
                        <div className="flex items-center justify-between gap-1.5">
                            <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="flex items-center gap-1.5">
                                <Select value={getMonth(month).toString()} onValueChange={handleMonthChange}>
                                    <SelectTrigger className="w-[100px] px-2 py-0 !h-9">
                                        <SelectValue className="h-0" placeholder="Pilih Bulan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {months.map((monthName, index) => (
                                            <SelectItem key={monthName} value={index.toString()}>
                                                {monthName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={getYear(month).toString()} onValueChange={handleYearChange}>
                                    <SelectTrigger className="w-[100px] px-2 py-0 !h-9">
                                        <SelectValue placeholder="Pilih Tahun" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button variant="outline" size="icon" onClick={handleNextMonth}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Calendar Component - Render kondisional berdasarkan mode */}
                    {mode === "single" && (
                        <Calendar
                            initialFocus
                            mode="single"
                            defaultMonth={month}
                            selected={singleDate}
                            onSelect={setSingleDate as (date: Date | undefined) => void}
                            numberOfMonths={1}
                            month={month}
                            onMonthChange={setCurrentMonth}
                            locale={id}
                            className="p-3 w-full "
                            captionLayout="dropdown-buttons"
                            showOutsideDays={true}
                            fixedWeeks={true}
                            styles={{
                                caption: { display: "none" },
                                caption_label: { display: "none" },
                                caption_dropdowns: { display: "none" },
                            }}
                        />
                    )}

                    {mode === "multiple" && (
                        <Calendar
                            initialFocus
                            mode="multiple"
                            defaultMonth={month}
                            selected={multipleDates}
                            onSelect={setMultipleDates as (dates: Date[] | undefined) => void}
                            numberOfMonths={1}
                            month={month}
                            onMonthChange={setCurrentMonth}
                            locale={id}
                            className="p-3 w-full"
                            captionLayout="dropdown-buttons"
                            showOutsideDays={true}
                            fixedWeeks={true}
                            styles={{
                                caption: { display: "none" },
                                caption_label: { display: "none" },
                                caption_dropdowns: { display: "none" },
                            }}
                        />
                    )}

                    {mode === "range" && (
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={month}
                            selected={dateRange}
                            onSelect={setDateRange as (range: DateRange | undefined) => void}
                            numberOfMonths={2}
                            month={month}
                            onMonthChange={setCurrentMonth}
                            locale={id}
                            className="p-3 w-full"
                            captionLayout="dropdown-buttons"
                            showOutsideDays={true}
                            fixedWeeks={true}
                            styles={{
                                caption: { display: "block" },
                                caption_label: { display: "block" },
                                nav_button_next: { display: "none" },
                                nav_button_previous: { display: "none" },
                                caption_dropdowns: { display: "none" },
                                months:{gap:"15px"}
                            }}
                        />
                    )}
                </PopoverContent>
            </Popover>
        </div>
    )
}

