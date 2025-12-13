"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Settings,
  Shield,
  TrendingUp,
  Server,
} from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import apiClient from "@/lib/apiClient";

// Types
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  permissions: {
    [key: string]: boolean;
  };
}

interface FormErrors {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
  });

  // API call using React Query
  const loginMutation = useMutation<
    LoginResponse,
    Error,
    { email: string; password: string }
  >({
    mutationFn: async (credentials) => {
      const response = await apiClient.post<LoginResponse>(
        `/auth/login`,
        credentials
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Store auth token and user data
      useAuthStore.getState().setAuth(data.accessToken, data.user);

      // Store refresh token if remember me is checked
      if (formData.rememberMe) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

      // Redirect to dashboard
      router.push("/dashboard");
    },
  });

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: FormErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;

    loginMutation.mutate({
      email: formData.email.trim(),
      password: formData.password.trim(),
    });
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Minimal Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-700 to-purple-900 relative overflow-hidden">
        <div className="w-full h-full flex flex-col justify-between p-12 lg:p-16 relative z-10">
          {/* Logo */}
          <div className="mb-10">
            <div className="max-w-[140px] bg-white p-5 rounded-xl shadow-2xl">
              <Image
                src="/eGlogo.png"
                alt="eduGuardian Logo"
                width={240}
                height={96}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Simple Heading + Tagline */}
          <div className="max-w-lg">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Security & Performance Control
            </h1>
            <p className="text-lg lg:text-xl text-purple-100">
              One powerful portal to keep your eduGuardian platform secure and
              running smoothly.
            </p>
          </div>

          {/* Very subtle feature icons only (no text blocks) */}
          <div className="flex gap-6 mt-12">
            <Shield className="w-10 h-10 text-white opacity-70" />
            <TrendingUp className="w-10 h-10 text-white opacity-70" />
            <Server className="w-10 h-10 text-white opacity-70" />
          </div>

          {/* Footer */}
          <div className="mt-auto">
            <p className="text-purple-200 text-sm">
              © 2024 eduGuardian. Empowering Secure Learning.
            </p>
          </div>
        </div>

        {/* Optional: very subtle decorative blur (no pulsing) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600 rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500 rounded-full opacity-5 blur-3xl"></div>
        </div>
      </div>

      {/* Right Side - Full Width Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="max-w-[180px] bg-white p-4 rounded-lg shadow-md">
              <Image
                src="/eGlogo.png"
                alt="eduGuardian Logo"
                width={180}
                height={72}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Settings className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Website Admin Login
            </h2>
            <p className="text-gray-600">
              Enter your credentials to access the admin panel
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Success/Error Messages */}
            {loginMutation.isSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">Login successful!</p>
                  <p className="text-sm">Redirecting to dashboard...</p>
                </div>
              </div>
            )}

            {loginMutation.isError && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">
                    {loginMutation.error?.message ||
                      "Login failed. Please check your credentials."}
                  </p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-purple-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loginMutation.isPending}
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-gray-900`}
                  placeholder="admin@eduguardian.com"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-purple-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loginMutation.isPending}
                  className={`block w-full pl-10 pr-12 py-3 border ${errors.password ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-gray-900`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={loginMutation.isPending}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={loginMutation.isPending}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded disabled:cursor-not-allowed"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loginMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Help Text */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Need help?{" "}
                <a
                  href="mailto:support@eduguardian.com"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </form>
        </div>
      </div >
    </div >
  );
};

export default Login;