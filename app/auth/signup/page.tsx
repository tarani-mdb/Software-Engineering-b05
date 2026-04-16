import SignupForm from '@/components/SignupForm';

export default function SignupPage() {
  return (
    <main className="page-shell px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-center">
        <div className="panel w-full max-w-2xl rounded-[2.5rem] p-8 sm:p-10">
          <div className="text-center mb-8">
            <p className="section-kicker text-sm uppercase tracking-[0.3em]">Create account</p>
            <h1 className="mt-3 text-4xl font-semibold" style={{ color: 'var(--foreground)' }}>Join the redistribution network</h1>
            <p className="text-muted mt-3">Register as a donor, NGO, or volunteer and start reducing waste in your area.</p>
          </div>

          <SignupForm />

          <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border-soft)' }}>
            <p className="text-muted text-center text-xs">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
