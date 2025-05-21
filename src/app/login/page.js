"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { AlertCircle } from "lucide-react";

const loginSchema = z.object({
  employeeId: z.string().startsWith("NSH", "Mã nhân sự không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      employeeId: "",
      password: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      const { success, user } = await login(data.employeeId, data.password);
      if (success) {
        if (user.role === "admin") {
          router.push("/superuser");
        } else {
          router.push("/");
        }
      } else {
        setError("Mã nhân sự hoặc mật khẩu không đúng");
      }
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const employeeId = searchParams.get("employee-id");
    if (employeeId) {
      form.setValue("employeeId", employeeId);
    }
  }, []);

  return (
    <div className="flex items-center justify-center">
      <Card className="max-w-md m-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Đăng nhập
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-[275px]"
            >
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã nhân sự</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nhập mã nhân sự"
                        {...field}
                        autoComplete="employeeId"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                        autoComplete="current-password"
                        containerClassName="justify-center"
                        {...field}
                      >
                        <InputOTPGroup className="space-x-1">
                          <InputOTPSlot
                            index={0}
                            className="rounded-md border-l"
                          />
                          <InputOTPSlot
                            index={1}
                            className="rounded-md border-l"
                          />
                          <InputOTPSlot
                            index={2}
                            className="rounded-md border-l"
                          />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup className="space-x-1">
                          <InputOTPSlot
                            index={3}
                            className="rounded-md border-l"
                          />
                          <InputOTPSlot
                            index={4}
                            className="rounded-md border-l"
                          />
                          <InputOTPSlot
                            index={5}
                            className="rounded-md border-l"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPageWithSuspense() {
  return (
    <Suspense fallback={null}>
      <Login />
    </Suspense>
  );
}
