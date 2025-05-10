"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import withAuth from "@/components/hoc/withAuth";
import { Box, Stack, Button, Spinner } from "@/components/base-ui";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { Alert } from "@/components/ui/alert";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

function Login() {
  const router = useRouter();
  const login = useAuth((state) => state.login);
  const user = useAuth((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = methods;

  const email = watch("email");
  const password = watch("password");

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      const success = await login(data.email, data.password);
      console.log(success);
      if (success) {
        router.push("/");
      } else {
        setError("Email hoặc mật khẩu không đúng");
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-50">
      <Box className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <Stack spacing={8}>
          <h1 className="text-2xl font-bold text-center text-gray-900">
            Đăng nhập
          </h1>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <Stack spacing={4}>
                <Field label="Email" error={errors.email?.message}>
                  <input
                    type="email"
                    {...methods.register("email", {
                      required: "Email là bắt buộc",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email không hợp lệ",
                      },
                    })}
                    placeholder="Nhập email của bạn"
                    autoComplete="email"
                    className="w-full h-10 px-3 rounded-md border border-gray-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </Field>

                <Field label="Mật khẩu" error={errors.password?.message}>
                  <PasswordInput
                    {...methods.register("password", {
                      required: "Mật khẩu là bắt buộc",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự",
                      },
                    })}
                    placeholder="Nhập mật khẩu của bạn"
                    autoComplete="current-password"
                  />
                </Field>

                {error && (
                  <Alert status="error" className="mt-2">
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting || !email || !password}
                  className="w-full"
                  color="primary"
                >
                  {isSubmitting ? (
                    <Spinner className="w-5 h-5 text-white" />
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
              </Stack>
            </form>
          </FormProvider>
        </Stack>
      </Box>
    </Box>
  );
}

export default withAuth(Login);
