"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";
import { LoginCredentials, SignupData } from "@/types";

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, setLoading, setError, logout: storeLogout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.username}!`);
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Invalid credentials. Please try again.";
      setError(msg);
      toast.error(msg);
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: SignupData) => authService.signup(data),
    onSuccess: (data) => {
      setUser(data.user);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Signup failed. Please try again.";
      setError(msg);
      toast.error(msg);
    },
  });

  const logout = useCallback(async () => {
    await storeLogout();
    router.push("/login");
    toast.success("Logged out successfully");
  }, [storeLogout, router]);

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || signupMutation.isPending,
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout,
  };
}
