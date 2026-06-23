import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { PageHeader } from "@/components/PageHeader";
import avatar from "@/assets/avatar-chef.jpg";
import { Camera, Check, MapPin } from "lucide-react";
import { regions } from "@/lib/mock-data";
import { useFlavorStore } from "@/lib/flavor-store";
import { toast } from "sonner";

export const Route = createFileRoute("/profile/edit")({
  head: () => ({ meta: [{ title: "Edit Profile — Cultivate" }] }),
  component: EditProfile,
});

function EditProfile() {
  const navigate = useNavigate();
  const profile = useFlavorStore((s) => s.profile);
  const updateProfile = useFlavorStore((s) => s.updateProfile);

  const [name, setName] = useState(profile.name);
  const [handle, setHandle] = useState(profile.handle);
  const [email, setEmail] = useState(profile.email);
  const [bio, setBio] = useState(profile.bio);
  const [region, setRegion] = useState<string>("med");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!handle.trim()) {
      toast.error("Username is required.");
      return;
    }

    setLoading(true);
    try {
      const initials = name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || "JT";
      await updateProfile({
        name: name.trim(),
        handle: handle.trim().toLowerCase().replace(/[^a-z0-9_.]/g, ''),
        bio: bio.trim(),
        avatar: initials
      });
      toast.success("Profile updated successfully.");
      navigate({ to: "/profile" });
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PhoneFrame>
      <PageHeader title="Edit Profile" />
      <main className="flex-1 overflow-y-auto no-scrollbar bg-gradient-to-b from-tangerine/10 via-surface to-leaf/8 pb-28">
        {/* Avatar hero */}
        <div className="mx-5 mt-3 rounded-[28px] p-6 bg-gradient-to-br from-primary via-tangerine to-spice text-white relative overflow-hidden shadow-warm animate-scale-in">
          <div className="absolute -top-10 -right-6 size-32 rounded-full bg-saffron/40 blur-2xl animate-blob" />
          <div className="flex flex-col items-center relative">
            <div className="relative">
              <span className="absolute inset-0 rounded-3xl bg-white/30 animate-pulse-ring" />
              <div className="size-28 rounded-3xl overflow-hidden ring-2 ring-white/70 bg-gradient-to-br from-saffron to-spice grid place-items-center text-white text-3xl font-bold">
                {profile.avatar || "JT"}
              </div>
              <button
                type="button"
                className="absolute -bottom-2 -right-2 size-10 bg-saffron text-foreground rounded-full grid place-items-center shadow-warm ring-4 ring-white/30"
              >
                <Camera className="size-4" />
              </button>
            </div>
            <p className="text-xs font-semibold mt-3">Change photo</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="px-5 mt-5 space-y-4 animate-slide-up">
          <Input
            label="Display name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Username"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            required
          />
          <Input
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            disabled
          />
          <div>
            <span className="text-[11px] font-semibold text-foreground/70 ml-1 uppercase tracking-wider">Bio</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="mt-1.5 w-full px-4 py-3 bg-card ring-1 ring-border rounded-2xl outline-none text-sm focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Region picker — drives home recommendations */}
          <div>
            <span className="text-[11px] font-semibold text-foreground/70 ml-1 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="size-3" /> Favorite region (drives your home feed)
            </span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {regions.map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setRegion(r.id)}
                  className={`relative rounded-2xl p-3 text-left transition-all overflow-hidden ${
                    region === r.id
                      ? `bg-gradient-to-br ${r.grad} text-white shadow-warm scale-[1.02] ring-2 ring-white`
                      : "bg-card ring-1 ring-border text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{r.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-tight">{r.name}</p>
                      <p className={`text-[10px] mt-0.5 line-clamp-1 ${region === r.id ? "opacity-90" : "text-muted-foreground"}`}>
                        {r.country}
                      </p>
                    </div>
                  </div>
                  {region === r.id && (
                    <Check className="size-4 absolute top-2 right-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </form>
      </main>
      <div className="absolute bottom-0 inset-x-0 p-5 border-t border-border bg-surface/95 backdrop-blur">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary via-tangerine to-spice text-white py-4 rounded-2xl font-semibold shadow-warm active:scale-[0.98] transition-transform relative overflow-hidden disabled:opacity-50"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
          <span className="relative">{loading ? "Saving..." : "Save changes"}</span>
        </button>
      </div>
    </PhoneFrame>
  );
}

function Input({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold text-foreground/70 ml-1 uppercase tracking-wider">{label}</span>
      <input
        {...rest}
        className="mt-1.5 w-full px-4 h-12 bg-card ring-1 ring-border rounded-2xl outline-none text-sm focus:ring-2 focus:ring-primary transition-all disabled:opacity-60"
      />
    </label>
  );
}
