import { createFileRoute, notFound } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { PageHeader } from "@/components/PageHeader";
import { blogs } from "@/lib/mock-data";
import { Clock, User } from "lucide-react";

export const Route = createFileRoute("/blog/$id")({
  head: ({ params }) => {
    const b = blogs.find((x) => x.id === params.id);
    return {
      meta: [
        { title: b ? `${b.title} — Cultivate` : "Blog" },
        { name: "description", content: b?.excerpt ?? "" },
        ...(b ? [{ property: "og:image", content: b.image }] : []),
      ],
    };
  },
  loader: ({ params }) => {
    const blog = blogs.find((b) => b.id === params.id);
    if (!blog) throw notFound();
    return blog;
  },
  notFoundComponent: () => (
    <PhoneFrame>
      <div className="flex-1 grid place-items-center p-8 text-center">
        <p className="text-muted-foreground">Story not found.</p>
      </div>
    </PhoneFrame>
  ),
  component: BlogPost,
});

function BlogPost() {
  const b = Route.useLoaderData() as (typeof blogs)[number];
  return (
    <PhoneFrame>
      <PageHeader title="Story" />
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className="px-6 animate-slide-up">
          <p className="text-xs text-primary font-semibold uppercase tracking-widest">
            {b.category}
          </p>
          <h1 className="font-display text-3xl leading-tight mt-1 text-balance">{b.title}</h1>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="size-3.5" /> {b.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" /> {b.readTime}
            </span>
          </div>
        </div>
        <img
          src={b.image}
          alt={b.title}
          className="w-full aspect-[4/3] object-cover mt-6 animate-scale-in"
          loading="lazy"
        />
        <article className="px-6 py-6 space-y-4 text-foreground/85 leading-relaxed animate-slide-up [animation-delay:100ms]">
          <p className="text-lg font-display italic text-foreground">{b.excerpt}</p>
          <p>{b.body}</p>
          <p>
            Cooking is a daily act of attention. What separates a competent cook from a great one
            isn't talent — it's the patience to learn the small things and the willingness to do
            them right every time.
          </p>
          <p>
            Start with one technique a week. Practice it until you no longer have to think about
            it. Then move on. In a year, you'll be a different cook.
          </p>
        </article>
      </main>
    </PhoneFrame>
  );
}
