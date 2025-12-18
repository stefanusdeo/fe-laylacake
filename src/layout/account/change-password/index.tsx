import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/passwordInput';
import { editPasswordSchema } from '@/schema/yup-validation';
import { updatePassword } from '@/store/action/profile';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'sonner';

function ChangePassword() {
  const form = useForm({
    resolver: yupResolver(editPasswordSchema),
    defaultValues: {
      NewPassword: "",
      PasswordConfirmation: ""
    }
  });

  const [loading, setLoading] = useState(false);

  const {
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = form;

  const onSubmit = (data: any) => {
    setLoading(true);
    const resp = new Promise((resolve, reject) => {
      const body = {
        new_password: data.NewPassword,
        confirm_password: data.PasswordConfirmation
      }
      updatePassword(body)
        .then((res: any) => {
          resolve(res);
          reset({
            NewPassword: "",
            PasswordConfirmation: "",
          });
        }).catch((err) => reject(err))
        .finally(() => {
          setLoading(false);
        });
    });
    toast.promise(resp, {
      loading: "Updating password...",
      success: "Password changed successfully",
      error: (err: any) => `Failed to change password: ${err?.message || 'Please try again'}`,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-5 mb-5'>
          <FormField
            control={form.control}
            name="NewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="New Password"
                    className={` text-base ${errors.NewPassword ? "border-red-500" : ""}`}
                    onChange={(e) => {
                      field.onChange(e);
                      form.trigger("NewPassword");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="PasswordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Confirm New Password"
                    className={` text-base ${errors.PasswordConfirmation ? "border-red-500" : ""}`}
                    onChange={(e) => {
                      field.onChange(e);
                      form.trigger("PasswordConfirmation");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex justify-end items-center'>
          <Button
            disabled={!form.formState.isValid || loading}
            type="submit"
            className="w-fit flex items-center justify-center"
          >
            {loading ? <BeatLoader color="#010101" size={8} /> : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ChangePassword
