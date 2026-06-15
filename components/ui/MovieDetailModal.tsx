"use client";

import Image from "next/image";
import { Trash2, Check, Film, Tv, X } from "lucide-react";
import { WatchlistItem } from "@/types";
import { clsx } from "clsx";
import { colorFor } from "@/components/ui/MoviePoster";

interface Props {
  item: WatchlistItem;
  onClose: () => void;
  onDelete: (id: string) => void;
  onMarkWatched: (id: string) => void;
}

export default function MovieDetailModal({
  item,
  onClose,
  onDelete,
  onMarkWatched,
}: Props) {
  const addedBy = item.added_by || "Someone";
  const initial = addedBy.charAt(0).toUpperCase();
  const color = colorFor(addedBy);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-rose-200/50 overflow-hidden burst max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with poster backdrop */}
        <div className="relative">
          <div className="flex gap-4 p-5">
            <div className="w-24 h-36 rounded-xl overflow-hidden flex-shrink-0 bg-rose-50 shadow-md">
              {item.poster ? (
                <Image
                  src={item.poster}
                  alt={item.title}
                  width={96}
                  height={144}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-rose-200">
                  {item.type === "tv" ? <Tv size={28} /> : <Film size={28} />}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display text-xl font-bold text-gray-800 leading-tight">
                  {item.title}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-300 hover:text-gray-500 flex-shrink-0"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span
                  className={clsx(
                    "text-[10px] px-2 py-0.5 rounded-full font-medium",
                    item.type === "movie"
                      ? "bg-rose-100 text-rose-600"
                      : "bg-purple-100 text-purple-600",
                  )}
                >
                  {item.type === "tv" ? "TV Show" : "Movie"}
                </span>
                {item.year && (
                  <span className="text-xs text-gray-400">{item.year}</span>
                )}
                {item.rating && item.rating !== "N/A" && (
                  <span className="text-xs text-amber-500 font-medium">
                    ★ {item.rating}
                  </span>
                )}
              </div>
              {item.genre && (
                <p className="text-xs text-gray-400 mt-1.5">{item.genre}</p>
              )}
              {item.watched && (
                <span className="inline-flex items-center gap-1 mt-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                  <Check size={11} /> Watched
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Plot */}
        {item.plot && (
          <div className="px-5 pb-2">
            <p className="text-sm text-gray-500 leading-relaxed">{item.plot}</p>
          </div>
        )}

        {/* Added by */}
        <div className="px-5 py-3 flex items-center gap-2">
          <span
            className={clsx(
              "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold",
              color.bg,
              color.text,
            )}
          >
            {initial}
          </span>
          <span className="text-xs text-gray-400">
            <span className={clsx("font-medium", color.text)}>{addedBy}</span>{" "}
            added this
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 p-5 pt-2 border-t border-rose-50">
          {!item.watched && (
            <button
              onClick={() => {
                onMarkWatched(item.id);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-xl text-sm transition-all"
            >
              <Check size={16} /> Mark watched
            </button>
          )}
          <button
            onClick={() => {
              onDelete(item.id);
              onClose();
            }}
            className={clsx(
              "flex items-center justify-center gap-2 border border-rose-100 hover:bg-red-50 text-red-400 hover:text-red-500 font-medium py-2.5 rounded-xl text-sm transition-all",
              item.watched ? "flex-1" : "px-4",
            )}
          >
            <Trash2 size={16} /> {item.watched ? "Remove from library" : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}
