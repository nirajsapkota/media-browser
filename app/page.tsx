import Image from "next/image";
import Link from "next/link";

import type { MediaItem } from "@/lib/types";
import { Card } from "@/components/ui/card";

async function getData(): Promise<MediaItem[]> {
  const path = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/movie`;
  const response = await fetch(path);
  return response.json();
}

export default async function Page() {
  const data = await getData();

  return (
    <main className="p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Movies</h1>
        </header>
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {data.map((item) => (
            <PosterCard key={item.id} item={item} href={`/view/${item.id}`} />
          ))}
        </section>
      </div>
    </main>
  );
}

function PosterCard({
  item,
  label,
  href,
}: {
  item: MediaItem;
  label?: string;
  href?: string;
}) {
  const displayTitle = item.title;
  const displayYear = item.release_date;

  const card = (
    <Card className="gap-0 overflow-hidden border-border bg-card py-0 shadow-none">
      <div className="relative aspect-2/3 bg-muted">
        {item.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={displayTitle}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/25 to-transparent" />
        {label ? (
          <div className="absolute left-3 top-3 rounded-md bg-black/70 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white">
            {label}
          </div>
        ) : null}
        {item.vote_average ? (
          <div className="absolute right-3 top-3 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">
            {item.vote_average.toFixed(2)}
          </div>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-4">
          <p className="text-[10px] uppercase tracking-[0.24em] text-white/70">
            {item.genres.length > 0 ? item.genres[0] : "Unknown"}
          </p>
          <h3 className="mt-2 line-clamp-2 text-xl font-semibold text-white">
            {displayTitle}
          </h3>
          <p className="mt-1 text-sm text-white/80">
            {displayYear.slice(0, 4)}
          </p>
        </div>
      </div>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block transition-opacity hover:opacity-90">
        {card}
      </Link>
    );
  }

  return card;
}
