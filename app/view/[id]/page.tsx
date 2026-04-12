import Image from "next/image";
import Link from "next/link";

import type { MediaItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

async function getData(id: string): Promise<MediaItem> {
  const path = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/movie/${id}`;
  const response = await fetch(path);
  return await response.json();
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getData(id);

  return (
    <main className="p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <div className="relative aspect-2/3 overflow-hidden rounded-xl border border-border bg-muted">
            {data.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
                alt={data.title}
                fill
                sizes="320px"
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Movie</p>
              <h1 className="text-4xl font-semibold tracking-tight">
                {data.title}
              </h1>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span>{data.release_date.split("-")[0]}</span> •
                <span>{data.genres ? data.genres.join(", ") : ""}</span> •
                {data.vote_average ? (
                  <span>Rating {data.vote_average.toFixed(2)}</span>
                ) : null}
              </div>
            </div>

            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
              {data.overview}
            </p>

            <Link href={`/stream/${id}`}>
              <Button size="lg" className="gap-2">
                <Play className="size-4 fill-current" />
                Play
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
