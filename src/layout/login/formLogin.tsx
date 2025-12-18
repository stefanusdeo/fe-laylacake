import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/passwordInput";
import { loginSchema } from "@/schema/yup-validation";
import { loginAccount } from "@/store/action/auth";
import { TFormLogin } from "@/types/loginFormTypes";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import BeatLoader from "react-spinners/BeatLoader";
import { toast } from "sonner";

function FormLogin() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  const onSubmit = (data: TFormLogin) => {
    setLoading(true);
    const email = data.email;
    const password = data.password;
    const resp = new Promise((resolve, reject) => {
      loginAccount(email, password)
        .then((res: any) => {
          if (res?.message === "success" || res?.data) {
            resolve(res);
          } else {
            reject(res);
          }
        })
        .finally(() => {
          setLoading(false);
        })
    })

    toast.promise(resp, {
      loading: "Loading...",
      success: (res: any) => `Login Success`,
      error: (err: any) => `Login Failed: ${err?.message || 'Please try again'}`,
    });

  };
  return (
    <Form {...form}>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <form className="w-full max-w-md" onSubmit={handleSubmit(onSubmit)}>
          <div className="text-center md:text-left mb-10">
            <h2 className="text-2xl font-bold text-neutral-900">Sign in to Product System</h2>
            <p className="text-gray-400 mt-2">Enter your details below.</p>
            <p className="text-gray-400 text-sm">v1.0.0</p>
          </div>
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">E-mail</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Please input your E-mail"
                      className={` text-base ${errors.email ? "border-red-500" : ""}`}
                      onChange={(e) => {
                        field.onChange(e);
                        form.trigger("email");
                      }}
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
                  <FormLabel className="text-sm">Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Please input your password"
                      className={` text-base ${errors.password ? "border-red-500" : ""}`}
                      onChange={(e) => {
                        field.onChange(e);
                        form.trigger("password");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Remember me</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button
              disabled={!form.formState.isValid || loading}
              type="submit"
              className="w-full flex items-center justify-center"
            >
              {loading ? <BeatLoader color="#010101" size={8} /> : "Sign In"}
            </Button>
          </div>
        </form>
      </div>
    </Form>
  );
}

export default FormLogin;