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
      <main className="flex-1 overflow-y-auto no-scrollbar bg-gradient-to-b from-tangerine/5 via-surface to-leaf/5">
        {/* Hero image with modern styling */}
        <div className="relative animate-slide-up">
          <img
            src={b.image}
            alt={b.title}
            className="w-full aspect-[4/3] object-cover animate-scale-in"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        </div>

        {/* Content card */}
        <div className="px-5 -mt-8 relative z-10 animate-slide-up [animation-delay:100ms]">
          <div className="bg-card/95 backdrop-blur-xl rounded-3xl p-6 ring-1 ring-white/60 shadow-[0_20px_60px_-20px_rgba(120,60,20,0.3)] glow-card-enhanced">
            {/* Category badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary to-tangerine text-white text-[10px] font-bold uppercase tracking-wider shadow-warm mb-4">
              <span className="text-lg">📖</span>
              {b.category}
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl leading-tight text-balance text-foreground">
              {b.title}
            </h1>

            {/* Meta info */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
                <User className="size-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground">{b.author}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
                <Clock className="size-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground">{b.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Article content */}
        <article className="px-6 py-6 space-y-5 text-foreground/90 leading-relaxed animate-slide-up [animation-delay:200ms]">
          <p className="text-xl font-display italic text-foreground leading-relaxed">
            {b.excerpt}
          </p>
          <p className="text-base leading-7">{b.body}</p>
          
          {/* Quote block */}
          <div className="relative my-6 p-5 rounded-2xl bg-gradient-to-br from-saffron/10 to-tangerine/10 border-l-4 border-tangerine">
            <p className="text-base font-display italic text-foreground leading-relaxed">
              "Cooking is a daily act of attention. What separates a competent cook from a great one isn't talent — it's the patience to learn the small things and the willingness to do them right every time."
            </p>
          </div>

          <p className="text-base leading-7">
            Start with one technique a week. Practice it until you no longer have to think about it. Then move on. In a year, you'll be a different cook.
          </p>

          {/* Call to action */}
          <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-primary/10 to-tangerine/10 border border-tangerine/20">
            <p className="text-sm font-semibold text-foreground mb-2">Ready to try this?</p>
            <p className="text-xs text-muted-foreground">
              Browse our recipe collection to find dishes that practice these techniques.
            </p>
          </div>
        </article>
      </main>
    </PhoneFrame>
  );
}
