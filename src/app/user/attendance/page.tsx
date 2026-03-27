"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StarRating } from "@/components/ui/star-rating";
import { useToast } from "@/components/ui/toast";
import { ClipboardCheck, Search, Calendar, Clock, User, MessageSquare, Star } from "lucide-react";
import { cn, formatDate, formatTime, EVENT_TYPE_COLORS } from "@/lib/utils";

interface AttendanceRecord {
  id: string;
  checkedIn: string;
  event: {
    id: string;
    title: string;
    type: string;
    startTime: string;
    endTime: string;
    host: { name: string };
  };
}

export default function AttendancePage() {
  const { addToast } = useToast();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [ratedEvents, setRatedEvents] = useState<Set<string>>(new Set());
  const [ratingDialog, setRatingDialog] = useState<{ eventId: string; eventTitle: string } | null>(null);
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/attendance/my")
      .then((r) => r.json())
      .then((data) => {
        setRecords(data);
        setLoading(false);
      });
    // Fetch user's existing ratings
    fetch("/api/ratings")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRatedEvents(new Set(data.map((r: any) => r.eventId)));
        }
      });
  }, []);

  const handleRate = async () => {
    if (!ratingDialog || ratingScore === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: ratingDialog.eventId,
          score: ratingScore,
          comment: ratingComment || undefined,
        }),
      });
      if (res.ok) {
        addToast("success", `Rated "${ratingDialog.eventTitle}" — +5 bonus points!`);
        setRatedEvents((prev) => new Set(prev).add(ratingDialog.eventId));
        setRatingDialog(null);
        setRatingScore(0);
        setRatingComment("");
      } else {
        const data = await res.json();
        addToast("error", data.error || "Could not submit rating");
      }
    } catch {
      addToast("error", "Network error");
    }
    setSubmitting(false);
  };

  const filtered = records.filter((r) =>
    r.event.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ClipboardCheck className="h-6 w-6 text-indigo-500" />
        Attendance History
      </h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <ClipboardCheck className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
              {search ? "No matching events" : "No attendance records yet"}
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {search ? "Try a different search term" : "Your check-ins will appear here"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((record) => {
            const isRated = ratedEvents.has(record.event.id);
            const isPast = new Date(record.event.endTime) < new Date();
            return (
              <Card key={record.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{record.event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(record.event.startTime)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-3.5 w-3.5" />
                        {formatTime(record.event.startTime)} - {formatTime(record.event.endTime)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <User className="h-3.5 w-3.5" />
                        Hosted by {record.event.host.name}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={cn("text-white border-0", EVENT_TYPE_COLORS[record.event.type])}>
                        {record.event.type}
                      </Badge>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        Checked in {formatTime(record.checkedIn)}
                      </span>
                      {isPast && (
                        isRated ? (
                          <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            Rated
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 gap-1"
                            onClick={() =>
                              setRatingDialog({ eventId: record.event.id, eventTitle: record.event.title })
                            }
                          >
                            <MessageSquare className="h-3 w-3" />
                            Rate Event
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <p className="text-center text-sm text-gray-400 dark:text-gray-500">
        {filtered.length} record{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Rating Dialog */}
      <Dialog open={!!ratingDialog} onOpenChange={() => setRatingDialog(null)}>
        <DialogContent onClose={() => setRatingDialog(null)}>
          <DialogHeader>
            <DialogTitle>Rate Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              How was <span className="font-semibold text-gray-700 dark:text-gray-200">{ratingDialog?.eventTitle}</span>?
            </p>
            <div className="flex justify-center">
              <StarRating value={ratingScore} onChange={setRatingScore} size="lg" />
            </div>
            <Textarea
              placeholder="Share your feedback (optional)..."
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg">
              <Star className="h-3.5 w-3.5" />
              You&apos;ll earn 5 bonus points for leaving feedback!
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setRatingDialog(null)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleRate}
                disabled={ratingScore === 0 || submitting}
                className="flex-1"
              >
                {submitting ? "Submitting..." : "Submit Rating"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
