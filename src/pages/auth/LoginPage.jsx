import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpenCheck, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";
import { navigate } from "../../hooks/useRoute";
import { Button, Field } from "../../components/UI";
import { useToast } from "../../components/Toast";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email."),
  password: z.string().min(1, "Password is required"),
});

export function LoginPage() {
  const { login, loading } = useAuth();
  const { notify } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "principal@school.edu", password: "password123" },
  });

  async function onSubmit(values) {
    try {
      const session = await login(values);
      notify(`Welcome, ${session.user.name}`);
      navigate(`/${session.user.role}/dashboard`);
    } catch (err) {
      notify(err.message, "error");
    }
  }

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="broadcast-card">
          <BookOpenCheck size={34} />
          <h1>Campus Content Broadcasting</h1>
          <p>Approve, schedule, and publish classroom-ready visuals from one professional workflow.</p>
        </div>
      </section>
      <section className="login-panel">
        <form onSubmit={handleSubmit(onSubmit)} className="auth-card">
          <span className="eyebrow">Secure access</span>
          <h2>Sign in</h2>
          <p>Use the demo accounts to open teacher and principal experiences.</p>
          <Field label="Email" error={errors.email?.message}>
            <input {...register("email")} autoComplete="email" />
          </Field>
          <Field label="Password" error={errors.password?.message}>
            <input {...register("password")} type="password" autoComplete="current-password" />
          </Field>
          <Button disabled={loading} className="wide">
            {loading ? <Loader2 className="spin" size={18} /> : null}
            Sign in
          </Button>
          
          <div style={{ margin: "20px 0", textAlign: "center" }}>
            <p style={{ fontSize: "14px", marginBottom: "12px", color: "var(--muted)" }}>Looking for the active broadcast?</p>
            <Button type="button" variant="secondary" className="wide" onClick={() => navigate("/live")}>
              Student Login
            </Button>
          </div>

          <div className="demo-grid">
            <span>Principal: principal@school.edu</span>
            <span>Teacher: teacher@school.edu</span>
          </div>
        </form>
      </section>
    </main>
  );
}
