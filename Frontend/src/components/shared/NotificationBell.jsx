import { useState, useRef, useEffect } from 'react';
import useNotifications from '../../hooks/useNotifications';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/*
  Bell icon + unread badge + dropdown list.
  Flow: shows unread count from the poller in useNotifications; opening the
  dropdown fetches the full list; clicking an item marks it read.
*/
export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { count, notifications, loading, open, markRead, markAllRead } = useNotifications();
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const toggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) open();
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label="Notifications"
        className="relative grid h-9 w-9 place-items-center rounded-lg border border-line text-subtle transition-colors hover:bg-muted hover:text-content"
      >
        <i className="bi bi-bell text-[15px]" />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-ink">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-80 overflow-hidden rounded-lg border border-line bg-raised shadow-lg">
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <span className="text-xs font-bold text-content">Notifications</span>
            {count > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[11px] font-semibold text-accent hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <ul className="max-h-96 overflow-y-auto">
            {loading && (
              <li className="px-3 py-4 text-center text-[11px] text-faint">Loading…</li>
            )}
            {!loading && notifications.length === 0 && (
              <li className="px-3 py-4 text-center text-[11px] text-faint">
                You're all caught up.
              </li>
            )}
            {!loading &&
              notifications.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => markRead(n.id)}
                    className={`flex w-full flex-col items-start gap-0.5 px-3 py-2.5 text-left transition-colors hover:bg-muted ${
                      n.isRead ? '' : 'bg-accent-soft/40'
                    }`}
                  >
                    <span className="flex w-full items-center gap-1.5">
                      {!n.isRead && <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />}
                      <span className="truncate text-xs font-semibold text-content">{n.title}</span>
                    </span>
                    <span className="line-clamp-2 text-[11px] text-subtle">{n.message}</span>
                    <span className="text-[10px] text-faint">{timeAgo(n.createdAt)}</span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
