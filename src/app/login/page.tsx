import { LoginForm } from "@/src/components/forms/login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-6 py-12">
      <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2.5rem] border border-white/60 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.88))] p-10 text-white shadow-[0_30px_120px_rgba(15,23,42,0.22)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
            Security by design
          </p>
          <h2 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight">
            Kelola autentikasi perangkat fisik dengan token yang cepat expired.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300">
            Sistem ini menyiapkan alur admin login, generator QR dan barcode, serta endpoint validasi yang siap dipakai perangkat IoT untuk skenario akses, inventori, dan checkpoint.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {["JWT Cookie Auth", "1 Minute Expiry", "QR / Barcode API"].map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm">
                {item}
              </div>
            ))}
          </div>
        </section>
        <LoginForm />
      </div>
    </main>
  );
}
