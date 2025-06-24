import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginProps {
  onLogin: (token: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const response = await fetch("/api/admin/login", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("admin_token", result.access_token);
        onLogin(result.access_token);
      } else {
        setError(result.detail || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-green-400 font-mono">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-green-300">
            Sign in to access the admin dashboard
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-900/50 border border-red-500/50 text-red-400 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Input
              label="Username"
              {...register("username")}
              error={errors.username?.message}
              placeholder="Enter your username"
            />

            <Input
              label="Password"
              type="password"
              {...register("password")}
              error={errors.password?.message}
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full"
              size="lg"
            >
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
