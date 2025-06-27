"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Info } from "lucide-react";
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface EventData {
  _id?: string;
  title: string;
  description: string;
  date: string;
}

export const ContinuousCalendar = () => {
  const today = new Date();
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [year, setYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [events, setEvents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [openEventDay, setOpenEventDay] = useState<{
    day: number;
    month: number;
  } | null>(null);
  const [formData, setFormData] = useState<EventData>({
    title: "",
    description: "",
    date: "",
  });

  const monthOptions = monthNames.map((month, index) => ({
    name: month,
    value: `${index}`,
  }));

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Failed to load events:", err));
  }, []);

  const scrollToDay = (monthIndex: number, dayIndex: number) => {
    const targetDayIndex = dayRefs.current.findIndex(
      (ref) =>
        ref &&
        ref.getAttribute("data-month") === `${monthIndex}` &&
        ref.getAttribute("data-day") === `${dayIndex}`
    );
    const targetElement = dayRefs.current[targetDayIndex];

    if (targetElement) {
      const container = document.querySelector(".calendar-container");
      const elementRect = targetElement.getBoundingClientRect();
      const offsetFactor = window.matchMedia("(min-width: 1536px)").matches
        ? 3
        : 2.5;

      if (container) {
        const containerRect = container.getBoundingClientRect();
        const offset =
          elementRect.top -
          containerRect.top -
          containerRect.height / offsetFactor +
          elementRect.height / 2;
        container.scrollTo({
          top: container.scrollTop + offset,
          behavior: "smooth",
        });
      } else {
        const offset =
          window.scrollY +
          elementRect.top -
          window.innerHeight / offsetFactor +
          elementRect.height / 2;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    }
  };

  const handlePrevYear = () => setYear((prev) => prev - 1);
  const handleNextYear = () => setYear((prev) => prev + 1);
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const monthIndex = parseInt(e.target.value, 10);
    setSelectedMonth(monthIndex);
    scrollToDay(monthIndex, 1);
  };

  const handleTodayClick = () => {
    setYear(today.getFullYear());
    scrollToDay(today.getMonth(), today.getDate());
  };

  const handleDayClick = (day: number, month: number, year: number) => {
    setFormData({
      ...formData,
      date: `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const newEvent = await res.json();
      setEvents([...events, newEvent]);
      setShowForm(false);
      setFormData({ title: "", description: "", date: "" });
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  };

  const generateCalendar = useMemo(() => {
    const daysInYear = (): { month: number; day: number }[] => {
      const days: { month: number; day: number }[] = [];
      const startDayOfWeek = new Date(year, 0, 1).getDay();
      if (startDayOfWeek < 6) {
        for (let i = 0; i < startDayOfWeek; i++) {
          days.push({ month: -1, day: 32 - startDayOfWeek + i });
        }
      }
      for (let month = 0; month < 12; month++) {
        const numDays = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= numDays; day++) {
          days.push({ month, day });
        }
      }
      const leftover = days.length % 7;
      if (leftover) {
        for (let i = 1; i <= 7 - leftover; i++) {
          days.push({ month: 0, day: i });
        }
      }
      return days;
    };

    const calendarDays = daysInYear();
    const calendarWeeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      calendarWeeks.push(calendarDays.slice(i, i + 7));
    }

    return calendarWeeks.map((week, weekIndex) => (
      <div className="flex w-full" key={`week-${weekIndex}`}>
        {week.map(({ month, day }, i) => {
          const index = weekIndex * 7 + i;
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;
          const hasEvent = events.some((e) => {
            const d = new Date(e.date);
            return (
              d.getFullYear() === year &&
              d.getMonth() === month &&
              d.getDate() === day
            );
          });

          return (
            <div
              key={`${month}-${day}`}
              ref={(el) => {
                dayRefs.current[index] = el;
              }}
              data-month={month}
              data-day={day}
              onClick={() => handleDayClick(day, month, year)}
              className="relative z-10 m-[-0.5px] group aspect-square w-full grow cursor-pointer rounded-xl border font-medium transition-all hover:z-20 hover:border-cyan-400 sm:-m-px sm:size-20 sm:rounded-2xl sm:border-2 lg:size-36 lg:rounded-3xl 2xl:size-40"
            >
              <span
                className={`absolute left-1 top-1 flex size-5 items-center justify-center rounded-full text-xs sm:size-6 sm:text-sm lg:left-2 lg:top-2 lg:size-8 lg:text-base ${
                  isToday ? "bg-blue-500 text-white" : ""
                }`}
              >
                {day}
              </span>
              {hasEvent && (
                <>
                  {/* Show title directly inside the day box */}
                  <div className="absolute bottom-8 left-3 right-1 text-[10px] text-blue-700 sm:text-xs lg:text-sm font-semibold leading-tight whitespace-normal break-words">
                    {
                      events.find((e) => {
                        const d = new Date(e.date);
                        return (
                          d.getFullYear() === year &&
                          d.getMonth() === month &&
                          d.getDate() === day
                        );
                      })?.title
                    }
                  </div>

                  {/* Show info icon for description */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenEventDay({ day, month });
                    }}
                    className="absolute right-2 top-3 rounded-full bg-gray-200 text-gray-700 text-xs px-1 py-0.5 hover:bg-gray-300"
                    title="View Description"
                  >
                    ℹ️
                  </button>

                  {openEventDay?.day === day &&
                    openEventDay?.month === month && (
                      <div className="absolute z-50 bottom-10 left-0 right-0 mx-auto w-40 rounded bg-white p-2 text-sm shadow-lg border">
                        {events
                          .filter((e) => {
                            const d = new Date(e.date);
                            return (
                              d.getFullYear() === year &&
                              d.getMonth() === month &&
                              d.getDate() === day
                            );
                          })
                          .map((e, i) => (
                            <div key={i} className="mb-2">
                              <div className="font-semibold">{e.title}</div>
                              <div className="text-gray-600 text-xs">
                                {e.description}
                              </div>
                            </div>
                          ))}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenEventDay(null);
                          }}
                          className="mt-2 w-full rounded bg-blue-100 px-2 py-1 text-center text-xs text-blue-700 hover:bg-blue-200"
                        >
                          Close
                        </button>
                      </div>
                    )}
                </>
              )}
            </div>
          );
        })}
      </div>
    ));
  }, [year, events, openEventDay]);

  useEffect(() => {
    const calendarContainer = document.querySelector(".calendar-container");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const month = parseInt(
              entry.target.getAttribute("data-month") || "0",
              10
            );
            setSelectedMonth(month);
          }
        });
      },
      { root: calendarContainer, rootMargin: "-75% 0px -25% 0px", threshold: 0 }
    );
    dayRefs.current.forEach((ref) => {
      if (ref?.getAttribute("data-day") === "15") observer.observe(ref);
    });
    return () => observer.disconnect();
  }, [year]);

  return (
    <>
      <div className="no-scrollbar calendar-container max-h-full overflow-y-scroll rounded-t-2xl bg-white pb-10 text-slate-800 shadow-xl">
        <div className="sticky -top-px z-50 w-full rounded-t-2xl bg-white px-5 pt-7 sm:px-8 sm:pt-8">
          <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Select
                name="month"
                value={`${selectedMonth}`}
                options={monthOptions}
                onChange={handleMonthChange}
              />
              <button
                onClick={handleTodayClick}
                type="button"
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100 lg:px-5 lg:py-2.5"
              >
                Today
              </button>
              <button
                onClick={() => setShowForm(true)}
                type="button"
                className="whitespace-nowrap rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-cyan-300 sm:rounded-xl lg:px-5 lg:py-2.5"
              >
                + Add Event
              </button>
            </div>
            <div className="flex w-fit items-center justify-between">
              <button
                onClick={handlePrevYear}
                className="rounded-full border border-slate-300 p-1 transition-colors hover:bg-slate-100 sm:p-2"
              >
                <svg
                  className="size-5 text-slate-800"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="m15 19-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="min-w-16 text-center text-lg font-semibold sm:min-w-20 sm:text-xl">
                {year}
              </h1>
              <button
                onClick={handleNextYear}
                className="rounded-full border border-slate-300 p-1 transition-colors hover:bg-slate-100 sm:p-2"
              >
                <svg
                  className="size-5 text-slate-800"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="m9 5 7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="grid w-full grid-cols-7 justify-between text-slate-500">
            {daysOfWeek.map((day) => (
              <span
                key={day}
                className="text-center text-xs font-semibold uppercase tracking-widest sm:text-sm lg:text-base"
              >
                {day}
              </span>
            ))}
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center px-1 sm:px-4">
          {generateCalendar}
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-lg space-y-4 w-80"
          >
            <h2 className="text-xl font-bold">Add Event</h2>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full border px-3 py-2 rounded"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
              className="w-full border px-3 py-2 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

// A simple Select component you can define or import
const Select = ({ name, value, options, onChange }: any) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
  >
    {options.map((option: any) => (
      <option key={option.value} value={option.value}>
        {option.name}
      </option>
    ))}
  </select>
);
