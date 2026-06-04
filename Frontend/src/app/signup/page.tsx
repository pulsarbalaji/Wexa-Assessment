"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Activity, ArrowRight, Building2, User, Mail, Lock } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import toast from "react-hot-toast";
import { authService } from "@/services/auth.service";

export default function SignupPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({
    company_name: "",
    username: "",
    email: "",
    password: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.company_name) e.company_name = "Company name is required";
    if (!form.username) e.username = "Username is required";
    else if (form.username.length < 3) e.username = "Min 3 characters";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Min 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {

      await authService.signup({
        company_name:
          form.company_name,

        username:
          form.username,

        email:
          form.email,

        password:
          form.password,
      });

      toast.success(
        "Account created successfully!"
      );

      router.push(
        "/login"
      );

    } catch (
    error: any
    ) {

      toast.error(

        error.response
          ?.data
          ?.detail ||

        "Signup failed"
      );

    } finally {

      setLoading(false);
    }
  };

  const fields = [
    { key: "company_name", label: "Company Name", icon: Building2, placeholder: "Acme Corp", type: "text" },
    { key: "username", label: "Username", icon: User, placeholder: "johndoe", type: "text" },
    { key: "email", label: "Work Email", icon: Mail, placeholder: "you@company.com", type: "email" },
    { key: "password", label: "Password", icon: Lock, placeholder: "Min 8 characters", type: "password" },
  ] as const;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Activity size={16} className="text-white" />
            </div>
            <span className="font-semibold text-foreground">Pulse Analytics</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Create your account</h1>

          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field, i) => (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="space-y-1.5"
              >
                <label className="text-sm font-medium text-foreground">{field.label}</label>
                <div className="relative">
                  <field.icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={field.key === "password" ? (showPw ? "text" : "password") : field.type}
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className={`w-full h-10 pl-9 pr-3 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all ${errors[field.key] ? "border-destructive" : "border-input"
                      }`}
                  />
                  {field.key === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                </div>
                {errors[field.key] && (
                  <p className="text-xs text-destructive">{errors[field.key]}</p>
                )}
              </motion.div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 flex items-center justify-center gap-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-all active:scale-[0.98] mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>Create account <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          {/* <p className="text-xs text-muted-foreground text-center mt-4">
            By signing up you agree to our{" "}
            <Link href="#" className="text-primary hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.
          </p> */}

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
