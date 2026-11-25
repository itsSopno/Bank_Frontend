"use client";

import { useState } from "react";
import {
  Bell,
  BellOff,
  CheckCheck,
  ArrowLeftRight,
  Landmark,
  ArrowDownUp,
  Info,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import {
  useGetMyNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from "@/store/api/bankingApi";
import type { NotificationItem } from "@/types/banking";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function notifIcon(type: string) {
  switch (type) {
    case "transfer":
      return <ArrowLeftRight className="h-5 w-5 text-blue-400" />;
    case "loan":
      return <Landmark className="h-5 w-5 text-purple-400" />;
    case "deposit":
    case "withdrawal":
      return <ArrowDownUp className="h-5 w-5 text-emerald-400" />;
    case "alert":
      return <AlertTriangle className="h-5 w-5 text-amber-400" />;
    default:
      return <Info className="h-5 w-5 text-[#FF5A1F]" />;
  }
}

function notifBg(type: string) {
  switch (type) {
    case "transfer":
      return "bg-blue-500/15";
    case "loan":
      return "bg-purple-500/15";
    case "deposit":
    case "withdrawal":
      return "bg-emerald-500/15";
    case "alert":
      return "bg-amber-500/15";
    default:
      return "bg-[#FF5A1F]/15";
  }
}

export default function NotificationsPage() {
  const { data, isLoading } = useGetMyNotificationsQuery();
  const [markRead] = useMarkNotificationAsReadMutation();
  const [markAll] = useMarkAllNotificationsAsReadMutation();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const notifications: NotificationItem[] = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  const filtered =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Bell className="h-6 w-6 text-[#FF5A1F]" />
            Notifications
            {unreadCount > 0 && (
              <span className="rounded-full bg-[#FF5A1F] px-2 py-0.5 text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Your banking activity updates and alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter toggle */}
          <div className="flex rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-1 gap-1">
            {(["all", "unread"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all capitalize ${
                  filter === f
                    ? "bg-[#FF5A1F] text-white shadow"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => markAll()}
              className="flex items-center gap-1.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[#FF5A1F]/40 transition-all"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] animate-pulse"
            />
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-3xl bg-[var(--bg-elevated)] flex items-center justify-center mb-4">
              <BellOff className="h-8 w-8 text-[var(--text-muted)]" />
            </div>
            <p className="font-semibold text-[var(--text-primary)]">
              {filter === "unread" ? "All caught up!" : "No notifications yet"}
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {filter === "unread"
                ? "You have no unread notifications."
                : "Banking activity will appear here."}
            </p>
          </div>
        ) : (
          filtered.map((notif: NotificationItem) => (
            <NotifCard
              key={notif.id}
              notif={notif}
              onMarkRead={() => markRead(notif.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function NotifCard({
  notif,
  onMarkRead,
}: {
  notif: NotificationItem;
  onMarkRead: () => void;
}) {
  return (
    <div
      className={`relative flex items-start gap-4 rounded-3xl border p-4 transition-all ${
        notif.isRead
          ? "border-[var(--border-subtle)] bg-[var(--bg-surface)]"
          : "border-[#FF5A1F]/30 bg-[#FF5A1F]/5"
      }`}
    >
      {/* Unread dot */}
      {!notif.isRead && (
        <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-[#FF5A1F]" />
      )}

      {/* Icon */}
      <div
        className={`mt-0.5 h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center ${notifBg(
          notif.type
        )}`}
      >
        {notifIcon(notif.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold leading-snug ${
            notif.isRead ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]"
          }`}
        >
          {notif.title}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed line-clamp-2">
          {notif.message}
        </p>
        <p className="text-xs text-[var(--text-muted)]/60 mt-1.5">{timeAgo(notif.createdAt)}</p>
      </div>

      {/* Action */}
      {!notif.isRead && (
        <button
          onClick={onMarkRead}
          className="mt-1 shrink-0 rounded-xl p-1.5 text-[var(--text-muted)] hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
          title="Mark as read"
        >
          <CheckCheck className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

