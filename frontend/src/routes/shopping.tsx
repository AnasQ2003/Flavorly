import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { PageHeader } from "@/components/PageHeader";
import { BottomTabBar } from "@/components/BottomTabBar";
import { useFlavorStore } from "@/lib/flavor-store";
import { toast } from "sonner";
import {
  Check, Plus, ShoppingBasket, Sparkles, Search, Trash2,
  Carrot, Beef, Milk, Wheat, Cookie, Wine, X
} from "lucide-react";
import { requireAuth } from "@/lib/route-guards";

export const Route = createFileRoute("/shopping")({
  beforeLoad: () => requireAuth(),
  head: () => ({ meta: [{ title: "Shopping — Cultivate" }] }),
  component: Shopping,
});

type Aisle = "Produce" | "Protein" | "Dairy" | "Pantry" | "Bakery" | "Wine";

const aisleMeta: Record<Aisle, { Icon: typeof Carrot; grad: string; ring: string }> = {
  Produce: { Icon: Carrot, grad: "from-leaf via-saffron to-tangerine", ring: "ring-leaf/40" },
  Protein: { Icon: Beef, grad: "from-spice via-berry to-grape", ring: "ring-spice/40" },
  Dairy: { Icon: Milk, grad: "from-ocean via-grape to-berry", ring: "ring-ocean/40" },
  Pantry: { Icon: Wheat, grad: "from-saffron via-tangerine to-spice", ring: "ring-saffron/40" },
  Bakery: { Icon: Cookie, grad: "from-tangerine via-spice to-berry", ring: "ring-tangerine/40" },
  Wine: { Icon: Wine, grad: "from-grape via-berry to-spice", ring: "ring-grape/40" },
};

function Shopping() {
  const items = useFlavorStore((s) => s.shoppingList);
  const toggleShoppingItem = useFlavorStore((s) => s.toggleShoppingItem);
  const addShoppingItem = useFlavorStore((s) => s.addShoppingItem);
  const deleteShoppingItem = useFlavorStore((s) => s.deleteShoppingItem);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Aisle>("all");

  // Inline form state
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty] = useState("1");
  const [newPrice, setNewPrice] = useState("2.5");
  const [newAisle, setNewAisle] = useState<Aisle>("Produce");
  const [newNote, setNewNote] = useState("");

  const remaining = items.filter((i) => !i.done);
  const total = items.reduce((s, i) => s + i.price, 0);
  const remainingTotal = remaining.reduce((s, i) => s + i.price, 0);
  const progress = items.length ? ((items.length - remaining.length) / items.length) * 100 : 0;

  const aisleList = useMemo(() => {
    const q = query.toLowerCase();
    const f = items.filter(
      (i) =>
        (filter === "all" || i.aisle === filter) &&
        (q === "" || i.name.toLowerCase().includes(q)),
    );
    const byAisle: Record<string, typeof items> = {};
    f.forEach((i) => {
      byAisle[i.aisle] = byAisle[i.aisle] ?? [];
      byAisle[i.aisle].push(i);
    });
    return Object.entries(byAisle) as [Aisle, typeof items][];
  }, [items, query, filter]);

  const aisles: ("all" | Aisle)[] = ["all", "Produce", "Protein", "Dairy", "Pantry", "Bakery", "Wine"];

  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Please enter an item name.");
      return;
    }
    try {
      await addShoppingItem({
        name: newName.trim(),
        qty: newQty || "1",
        price: Number(newPrice) || 0,
        aisle: newAisle,
        note: newNote.trim() || undefined,
      });
      toast.success(`Added ${newName} to shopping list.`);
      // Reset form
      setNewName("");
      setNewQty("1");
      setNewPrice("2.5");
      setNewNote("");
      setShowAdd(false);
    } catch {
      toast.error("Failed to add item.");
    }
  };

  const handleAddSuggestion = async () => {
    try {
      await addShoppingItem({
        name: "Maldon Flake Salt",
        qty: "1 box",
        price: 4.5,
        aisle: "Pantry",
        note: "Smart suggestion",
      });
      toast.success("Added Maldon Flake Salt to your list!");
    } catch {
      toast.error("Failed to add suggestion.");
    }
  };

  return (
    <PhoneFrame>
      <PageHeader title="Shopping List" />
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-32 bg-gradient-to-b from-tangerine/10 via-surface to-leaf/10">
        {/* Hero */}
        <div className="px-5 pt-2">
          <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-leaf via-ocean to-grape text-primary-foreground shadow-warm animate-slide-up">
            <div className="absolute -right-8 -top-8 size-32 rounded-full bg-card/15 blur-2xl" />
            <div className="flex items-center gap-3">
              <span className="size-12 rounded-2xl bg-card/20 backdrop-blur-md grid place-items-center ring-1 ring-card/30">
                <ShoppingBasket className="size-5" />
              </span>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest opacity-80">This week</p>
                <p className="font-display text-2xl leading-tight">
                  {remaining.length} items left
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest opacity-80">Cart</p>
                <p className="font-display text-2xl leading-tight">${total.toFixed(0)}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-card/20 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-saffron to-tangerine rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] opacity-90">{Math.round(progress)}%</span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Stat label="Spent" value={`$${(total - remainingTotal).toFixed(0)}`} />
              <Stat label="Pending" value={`$${remainingTotal.toFixed(0)}`} />
              <Stat label="Aisles" value={`${new Set(items.map((i) => i.aisle)).size}`} />
            </div>
          </div>
        </div>

        {/* Search + filter */}
        <div className="px-5 pt-4 space-y-3">
          <div className="relative animate-slide-up">
            <Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ingredients…"
              className="w-full bg-card ring-1 ring-border rounded-2xl pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:ring-primary focus:outline-none transition"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
            {aisles.map((a) => {
              const on = filter === a;
              return (
                <button
                  key={a}
                  onClick={() => setFilter(a)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold ring-1 transition-all ${
                    on
                      ? "bg-foreground text-background ring-foreground shadow-warm"
                      : "bg-card text-foreground ring-border hover:ring-primary/40"
                  }`}
                >
                  {a === "all" ? "All aisles" : a}
                </button>
              );
            })}
          </div>
        </div>

        {/* Aisle groups */}
        <div className="px-5 pt-5 space-y-5">
          {aisleList.map(([aisle, list], gi) => {
            const meta = aisleMeta[aisle];
            return (
              <section key={aisle} className="animate-slide-up" style={{ animationDelay: `${gi * 60}ms` }}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className={`size-7 rounded-lg grid place-items-center bg-gradient-to-br ${meta.grad} text-primary-foreground shadow-soft`}>
                    <meta.Icon className="size-3.5" strokeWidth={2.4} />
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-foreground">
                    {aisle}
                  </p>
                  <span className="text-[10px] text-muted-foreground">· {list.length}</span>
                  <span className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                </div>

                <ul className="space-y-2">
                  {list.map((it, i) => (
                    <li
                      key={it.id}
                      className={`flex items-center gap-3 bg-card ring-1 ${meta.ring} rounded-2xl p-3.5 shadow-soft hover-lift animate-slide-in-right transition`}
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <button
                        onClick={() => toggleShoppingItem(it.id)}
                        className={`size-8 rounded-full grid place-items-center ring-1 shrink-0 transition-all ${
                          it.done
                            ? `bg-gradient-to-br ${meta.grad} text-primary-foreground ring-transparent shadow-warm scale-105`
                            : "bg-card ring-border hover:ring-primary/50"
                        }`}
                      >
                        {it.done && <Check className="size-4" strokeWidth={3} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${it.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {it.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {it.qty}
                          {it.note && <span className="ml-2 italic opacity-80">· {it.note}</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs font-display tabular-nums ${it.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                          ${it.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => deleteShoppingItem(it.id)}
                          className="size-7 rounded-full text-muted-foreground hover:text-spice hover:bg-spice/10 grid place-items-center transition"
                          aria-label="Delete item"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}

          {/* Expandable Add Custom Item Form */}
          {showAdd ? (
            <form onSubmit={handleAddCustom} className="bg-card ring-1 ring-border rounded-3xl p-5 space-y-4 animate-scale-in">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <h4 className="font-semibold text-sm">Add custom item</h4>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="size-6 rounded-full hover:bg-muted grid place-items-center"
                >
                  <X className="size-4 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-semibold text-foreground/75 uppercase tracking-wider ml-1">Item Name</span>
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Maldon flake salt"
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-semibold text-foreground/75 uppercase tracking-wider ml-1">Quantity</span>
                    <input
                      value={newQty}
                      onChange={(e) => setNewQty(e.target.value)}
                      placeholder="e.g. 1 box"
                      className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-foreground/75 uppercase tracking-wider ml-1">Price ($)</span>
                    <input
                      type="number"
                      step="0.01"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="e.g. 4.50"
                      className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-semibold text-foreground/75 uppercase tracking-wider ml-1">Aisle</span>
                    <select
                      value={newAisle}
                      onChange={(e) => setNewAisle(e.target.value as Aisle)}
                      className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {aisles.filter(x => x !== 'all').map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-foreground/75 uppercase tracking-wider ml-1">Note</span>
                    <input
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="e.g. Flaky finishing salt"
                      className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary via-tangerine to-spice text-white py-3 rounded-xl font-semibold shadow-warm hover:opacity-95 active:scale-95 transition"
              >
                Add Item
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full p-4 rounded-3xl border-2 border-dashed border-border bg-card/50 text-muted-foreground font-medium flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition"
            >
              <Plus className="size-4" />
              Add custom item
            </button>
          )}

          <div className="rounded-3xl bg-gradient-to-br from-saffron/15 via-tangerine/15 to-spice/15 ring-1 ring-tangerine/30 p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-spice" />
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-spice">Smart suggestion</p>
            </div>
            <p className="font-display text-base mt-1 leading-snug">
              Add Maldon flake salt — it lifts every dish on this list.
            </p>
            <button
              onClick={handleAddSuggestion}
              className="mt-3 text-xs font-semibold text-spice underline underline-offset-4"
            >
              Add for $4.50
            </button>
          </div>
        </div>
      </main>
      <BottomTabBar />
    </PhoneFrame>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card/15 backdrop-blur-md ring-1 ring-card/20 p-2">
      <p className="font-display text-base leading-none">{value}</p>
      <p className="text-[10px] opacity-80 mt-1 uppercase tracking-widest">{label}</p>
    </div>
  );
}
