"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import {
  ScanLine,
  Camera,
  Keyboard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  _count: { attendances: number };
}

interface ScanResult {
  type: "success" | "error" | "already";
  message: string;
  userName?: string;
}

export default function ScanPage() {
  const { addToast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("camera");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data: Event[]) => {
        setEvents(data);
        // Auto-select current active event
        const now = new Date();
        const active = data.find(
          (e) => new Date(e.startTime) <= now && new Date(e.endTime) >= now
        );
        if (active) setSelectedEventId(active.id);
        else if (data.length > 0) setSelectedEventId(data[0].id);
      });

    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanning(true);

      // Use BrowserQRCodeReader for scanning
      const { BrowserQRCodeReader } = await import("@zxing/browser");
      const reader = new BrowserQRCodeReader();

      scanIntervalRef.current = setInterval(async () => {
        if (!videoRef.current) return;
        try {
          const canvas = document.createElement("canvas");
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.drawImage(videoRef.current, 0, 0);

          // Try to decode from the video element
          try {
            const result = await reader.decodeFromCanvas(canvas);
            if (result) {
              const code = result.getText();
              if (code && code.length === 7) {
                stopCamera();
                handleCheckIn(code);
              }
            }
          } catch {
            // No QR code found in this frame, continue scanning
          }
        } catch {
          // Frame capture failed, continue
        }
      }, 500);
    } catch (_err) {
      setResult({
        type: "error",
        message: "Could not access camera. Please use manual entry.",
      });
    }
  };

  const handleCheckIn = async (code: string) => {
    if (!selectedEventId) {
      setResult({ type: "error", message: "Please select an event first" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.toUpperCase(), eventId: selectedEventId }),
      });

      const data = await res.json();

      if (res.status === 201) {
        const msg = `${data.user.name} checked in to ${data.event.title}`;
        setResult({ type: "success", message: msg, userName: data.user.name });
        addToast("success", msg);
        fetch("/api/events").then((r) => r.json()).then(setEvents);
      } else if (res.status === 409) {
        const msg = `${data.user?.name || "User"} is already checked in`;
        setResult({ type: "already", message: msg });
        addToast("warning", msg);
      } else {
        const msg = data.error || "Check-in failed";
        setResult({ type: "error", message: msg });
        addToast("error", msg);
      }
    } catch {
      setResult({ type: "error", message: "Network error" });
      addToast("error", "Network error — please try again");
    }

    setLoading(false);
    setManualCode("");
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.length !== 7) {
      setResult({ type: "error", message: "Code must be 7 characters" });
      return;
    }
    handleCheckIn(manualCode);
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <div className="max-w-lg mx-auto space-y-6 py-4">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ScanLine className="h-6 w-6 text-emerald-500" />
        Scan Attendance
      </h1>

      {/* Event selector */}
      <Card>
        <CardContent className="p-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Select Event
          </label>
          <Select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <option value="">Choose an event...</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title} ({event._count.attendances} checked in)
              </option>
            ))}
          </Select>
          {selectedEvent && (
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary">{selectedEvent.type}</Badge>
              <span className="text-sm text-gray-500">
                {selectedEvent._count.attendances} attendees
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scan tabs */}
      <Tabs value={tab} onValueChange={(v) => { setTab(v); if (v !== "camera") stopCamera(); }}>
        <TabsList className="w-full">
          <TabsTrigger value="camera" className="flex-1">
            <Camera className="h-4 w-4 mr-2" />
            Camera
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex-1">
            <Keyboard className="h-4 w-4 mr-2" />
            Manual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="camera">
          <Card>
            <CardContent className="p-4">
              <div className="relative aspect-square max-h-80 mx-auto rounded-xl overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                {scanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-emerald-400 rounded-2xl animate-pulse" />
                  </div>
                )}
                {!scanning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                    <Camera className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-center">
                {scanning ? (
                  <Button onClick={stopCamera} variant="destructive">
                    Stop Scanning
                  </Button>
                ) : (
                  <Button
                    onClick={startCamera}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Manual Entry</CardTitle>
              <CardDescription>Type the 7-character attendance code</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <Input
                  placeholder="e.g. ABC1234"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase().slice(0, 7))}
                  className="text-center text-2xl font-mono tracking-[0.3em] h-14"
                  maxLength={7}
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  disabled={loading || manualCode.length !== 7}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Check In"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Result */}
      {result && (
        <Card
          className={cn(
            "border-2 transition-all",
            result.type === "success" && "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
            result.type === "error" && "border-red-500 bg-red-50 dark:bg-red-900/20",
            result.type === "already" && "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
          )}
        >
          <CardContent className="p-6 text-center">
            {result.type === "success" && (
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
            )}
            {result.type === "error" && (
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            )}
            {result.type === "already" && (
              <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
            )}
            <p className="font-semibold text-lg">{result.message}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
