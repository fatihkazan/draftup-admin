import Link from "next/link";

type AdminShellProps = {
  title: string;
  children: React.ReactNode;
};

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/support", label: "Support Tickets" },
  { href: "/users", label: "Users" },
];

export function AdminShell({ title, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-400">Draftup</p>
            <h1 className="text-lg font-semibold text-white">Admin Panel</h1>
          </div>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:bg-zinc-800"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-[#22C55E] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <h2 className="mb-5 text-2xl font-semibold text-white">{title}</h2>
        {children}
      </main>
    </div>
  );
}
