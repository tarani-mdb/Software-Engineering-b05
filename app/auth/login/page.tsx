import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <main className="page-shell px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl items-center justify-center">
        <div className="panel w-full max-w-xl rounded-[2.5rem] p-8 sm:p-10">
          <div className="text-center mb-8">
            <p className="section-kicker text-sm uppercase tracking-[0.3em]">Welcome back</p>
            <h1 className="mt-3 text-4xl font-semibold" style={{ color: 'var(--foreground)' }}>Sign in to continue</h1>
            <p className="text-muted mt-3">Access donor, NGO, volunteer, or admin dashboards from one place.</p>
          </div>

          <LoginForm />

          <div className="panel-muted text-muted mt-8 rounded-3xl p-5 text-sm">
            Demo logins:
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <p>`admin@foodwaste.local`</p>
              <p>`donor@foodwaste.local`</p>
              <p>`ngo@foodwaste.local`</p>
              <p>`volunteer@foodwaste.local`</p>
            </div>
            <p className="mt-3">Password: `password123`</p>
          </div>
        </div>
      </div>
    </main>
  );
}
