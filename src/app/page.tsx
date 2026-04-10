export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl text-primary mb-4">
        SocratesHQ
      </h1>
      <p className="text-muted-foreground text-lg max-w-[600px] text-center mb-8">
        Elite career pathways and mentorship for global success.
      </p>
      <div className="flex gap-4">
        <a
          href="/login"
          className="px-6 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          Login
        </a>
        <a
          href="/register"
          className="px-6 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium transition-opacity"
        >
          Sign Up
        </a>
      </div>
    </div>
  );
}
