"use client";


import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Circle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

/**
 * Simple progress-tracking dashboard for the “Forget Me Not” project.
 */

export default function ImplementationProgressDashboard() {
  const [data, setData] = useState<ProgressPayload | null>(null);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await fetch("/api/progress");
        if (!res.ok) throw new Error(res.statusText);
        const json = (await res.json()) as ProgressPayload;
        setData(json);
      } catch {
        // fallback demo data if /api/progress fails in dev
        setData(DEMO_DATA);
      }
    }
    fetchProgress();
  }, []);

  if (!data) return <p className="text-center py-10">Loading progress…</p>;

  return (
    <motion.main
      className="max-w-5xl mx-auto p-6 grid gap-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── Overall progress */}
      <Card className="shadow-md">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Overall project completion</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold tabular-nums">
              {(data.overall * 100).toFixed(0)}%
            </span>
            <Progress value={data.overall * 100} className="flex-1 h-3" />
          </div>
        </CardContent>
      </Card>

      {/* ── Milestone stepper */}
      <section>
        <h3 className="text-xl font-medium mb-4">Milestones</h3>
        <ol className="relative border-l border-gray-300 dark:border-gray-600 ml-3">
          {data.milestones.map((m) => (
            <li key={m.id} className="mb-8 ml-6">
              {getBullet(m.status)}
              <Card className="pl-4 py-2">
                <h4 className="font-semibold text-lg">{m.title}</h4>
                <Progress value={m.percent * 100} className="h-2 mt-2" />
              </Card>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Feature grid */}
      <section>
        <h3 className="text-xl font-medium mb-4">Feature implementation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.features.map((f) => (
            <FeatureCard key={f.id} {...f} />
          ))}
        </div>
      </section>

      {/* ── Call to action */}
      <div className="text-center pt-6 space-y-2">
        <Button size="lg">Update progress</Button>
        <p>
          <Link href="/screenshots" className="text-blue-600 underline">
            View screenshots
          </Link>
        </p>
      </div>
    </motion.main>
  );
}

function FeatureCard({ title, status }: Feature) {
  const statusMap = {
    done: {
      label: "Done",
      icon: <CheckCircle className="w-4 h-4" />,
      color: "bg-green-100 text-green-700",
    },
    inprogress: {
      label: "In progress",
      icon: <Clock className="w-4 h-4" />,
      color: "bg-yellow-100 text-yellow-700",
    },
    todo: {
      label: "To-do",
      icon: <Circle className="w-3 h-3" />,
      color: "bg-gray-100 text-gray-600",
    },
  }[status];

  return (
    <Card className="flex flex-col justify-between shadow-sm">
      <CardHeader>
        <h4 className="font-semibold text-lg mb-1">{title}</h4>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm ${statusMap.color}`}
        >
          {statusMap.icon}
          {statusMap.label}
        </span>
      </CardHeader>
    </Card>
  );
}

function getBullet(status: MilestoneStatus) {
  const style =
    status === "done"
      ? "bg-green-600"
      : status === "inprogress"
      ? "bg-yellow-500"
      : "bg-gray-400";
  return <span className={`absolute -left-[9px] w-4 h-4 rounded-full ${style}`} />;
}

// ── Demo fallback ───────────────────────────────────────────────────────────

const DEMO_DATA: ProgressPayload = {
  overall: 0.65,
  milestones: [
    { id: 1, title: "Ideation", status: "done", percent: 1 },
    { id: 2, title: "Prototype", status: "inprogress", percent: 0.8 },
    { id: 3, title: "Pilot", status: "inprogress", percent: 0.6 },
    { id: 4, title: "Clinical Test", status: "todo", percent: 0.1 },
    { id: 5, title: "Deployment", status: "todo", percent: 0.1 },
  ],
  features: [
    { id: "fall", title: "Fall Detection", status: "done" },
    { id: "memory", title: "Memory Stimulation", status: "done" },
    { id: "reminder", title: "Daily Reminder & Health", status: "done" },
    { id: "hazard", title: "Hazard Tip", status: "inprogress" },
    { id: "family", title: "Family Reminder", status: "done" },
    { id: "wandering", title: "Wandering Tracking", status: "inprogress" },
  ],
};

// ── Type helpers ────────────────────────────────────────────────────────────

type MilestoneStatus = "done" | "inprogress" | "todo";
interface Milestone {
  id: number;
  title: string;
  status: MilestoneStatus;
  percent: number;
}
interface Feature {
  id: string;
  title: string;
  status: MilestoneStatus;
}
interface ProgressPayload {
  overall: number;
  milestones: Milestone[];
  features: Feature[];
}
