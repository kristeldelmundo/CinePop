"use client";

import Image from "next/image";
import { Film, Tv, Check } from "lucide-react";
import { WatchlistItem } from "@/types";
import { clsx } from "clsx";

interface Props {
  item: WatchlistItem;
  onOpen: (item: WatchlistItem) => void;
  // Map of user_id -> avatar_url, supplied by the parent so we can show
  // real profile photos instead of colored initials.
  avatarMap?: Record<string, string | null>;
}

// Stable per-name color so each member's dot is consistent when no avatar.
const PALETTE = [
  { bg: "bg-rose-100", text: "text-rose-500" },
  { bg: "bg-purple-100", text: "text-purple-500" },
  { bg: "bg-amber-100", text: "text-amber-600" },
  { bg: "bg-teal-100", text: "text-teal-600" },
  { bg: "bg-sky-100", text: "text-sky-600" },
  { bg: "bg-fuchsia-100", text: "text-fuchsia-600" },
];

export function colorFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export default function MoviePoster({ item, onOpen, avatarMap }: Props) {
  const addedBy = item.added_by || "Someone";
  const initial = addedBy.charAt(0).toUpperCase();
  const color = colorFor(addedBy);
  // Prefer a real photo from the avatar map; fall back to the initial dot.
  const avatarUrl = item.added_by_id ? avatarMap?.[item.added_by_id] : null;

  return (
    <button
      onClick={() => onOpen(item)}
      className="group relative block w-full text-left"
      title={item.title}
    >
      <div
        className={clsx(
          "relative aspect-[2/3] rounded-xl overflow-hidden bg-rose-50 shadow-sm transition-all duration-200 group-hover:shadow-lg group-hover:shadow-rose-100 group-hover:-translate-y-0.5",
          item.watched && "opacity-70",
        )}
      >
        {item.poster ? (
          <Image
            src={item.poster}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 33vw, 160px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-rose-200 p-2">
            {item.type === "tv" ? <Tv size={28} /> : <Film size={28} />}
            <span className="text-[10px] text-rose-300 text-center line-clamp-3 leading-tight">
              {item.title}
            </span>
          </div>
        )}

        {/* Type pill */}
        <span
          className={clsx(
            "absolute top-1.5 left-1.5 text-[9px] px-1.5 py-0.5 rounded-full font-medium backdrop-blur-sm",
            item.type === "movie"
              ? "bg-rose-500/85 text-white"
              : "bg-purple-500/85 text-white",
          )}
        >
          {item.type === "tv" ? "TV" : "Movie"}
        </span>

        {/* Rating */}
        {item.rating && item.rating !== "N/A" && (
          <span className="absolute top-1.5 right-1.5 text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-black/55 text-amber-300 backdrop-blur-sm">
            ★ {item.rating}
          </span>
        )}

        {/* Watched overlay */}
        {item.watched && (
          <div className="absolute inset-0 bg-green-900/30 flex items-center justify-center">
            <span className="flex items-center gap-1 bg-green-500 text-white text-[10px] font-semibold px-2 py-1 rounded-full shadow">
              <Check size={10} /> Watched
            </span>
          </div>
        )}

        {/* Added-by dot — photo if available, colored initial otherwise */}
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={addedBy}
            title={`${addedBy} added this`}
            className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full object-cover ring-2 ring-white/80 shadow"
          />
        ) : (
          <span
            className={clsx(
              "absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ring-2 ring-white/70",
              color.bg,
              color.text,
            )}
            title={`${addedBy} added this`}
          >
            {initial}
          </span>
        )}
      </div>

      {/* Title + year under the poster */}
      <div className="mt-1.5 px-0.5">
        <p className="text-xs font-medium text-gray-700 leading-tight line-clamp-1">
          {item.title}
        </p>
        {item.year && <p className="text-[10px] text-gray-400">{item.year}</p>}
      </div>
    </button>
  );
}
