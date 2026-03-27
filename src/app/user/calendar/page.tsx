"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Calendar, CheckCircle2 } from "lucide-react";
import { cn, formatTime, EVENT_TYPE_COLORS } from "@/lib/utils";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isToday,
} from "date-fns";

interface Event {
  id: string;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  host: { name: string };
  _count: { attendances: number };
}

interface Attendance {
  id: string;
  event: { id: string; title: string; type: string; startTime: string; endTime: string };
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [myAttendance, setMyAttendance] = useState<Attendance[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [view, setView] = useState("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/events").then((r) => r.json()),
      fetch("/api/attendance/my").then((r) => r.json()),
    ]).then(([eventsData, attendanceData]) => {
      setEvents(eventsData);
      setMyAttendance(attendanceData);
      setLoading(false);
    });
  }, []);

  const attendedEventIds = new Set(myAttendance.map((a) => a.event.id));

  const getEventsForDate = (date: Date) =>
    events.filter((e) => isSameDay(new Date(e.startTime), date));

  const navigate = (direction: "prev" | "next") => {
    if (view === "month") {
      setCurrentDate(direction === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
    } else {
      setCurrentDate(direction === "prev" ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
    }
  };

  const monthDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  });

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate),
  });

  const days = view === "month" ? monthDays : weekDays;
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-indigo-500" />
          Calendar
        </h1>
        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate("prev")}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CardTitle>
              {view === "month"
                ? format(currentDate, "MMMM yyyy")
                : `Week of ${format(startOfWeek(currentDate), "MMM d, yyyy")}`}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => navigate("next")}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dayEvents = getEventsForDate(day);
              const hasAttended = dayEvents.some((e) => attendedEventIds.has(e.id));
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "relative p-2 rounded-xl text-sm transition-all duration-200 min-h-[60px] md:min-h-[80px] flex flex-col items-center",
                    isSelected
                      ? "bg-indigo-100 dark:bg-indigo-900/50 ring-2 ring-indigo-500"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800",
                    !isCurrentMonth && view === "month" && "opacity-40",
                    isToday(day) && !isSelected && "bg-gray-100 dark:bg-gray-800"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isToday(day) && "text-indigo-600 dark:text-indigo-400 font-bold"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                      {dayEvents.slice(0, 3).map((e) => (
                        <div
                          key={e.id}
                          className={cn("w-1.5 h-1.5 rounded-full", EVENT_TYPE_COLORS[e.type] || "bg-gray-400")}
                        />
                      ))}
                    </div>
                  )}
                  {hasAttended && (
                    <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected day events */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedEvents.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
                No events on this day
              </p>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "p-4 rounded-xl border-l-4 bg-gray-50 dark:bg-gray-800/50 transition-all",
                      attendedEventIds.has(event.id) ? "border-l-emerald-500" : "border-l-gray-300 dark:border-l-gray-600"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Hosted by {event.host.name}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={cn("text-white border-0", EVENT_TYPE_COLORS[event.type])}>
                          {event.type}
                        </Badge>
                        {attendedEventIds.has(event.id) && (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Attended
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
