import Dialog from '@/components/molecules/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/passwordInput'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { userSchema } from '@/schema/yup-validation'
import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'
import BeatLoader from 'react-spinners/BeatLoader'

type ModalCreateUserProps = {
    open: boolean
    onClose: (open: boolean) => void
}

function ModalCreateUser({ open, onClose }: ModalCreateUserProps) {
    const form = useForm({
        resolver: yupResolver(userSchema),
    });
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = form;
    
    const [loading, setLoading] = React.useState(false)


    return (
        <Dialog
            title='Create New User'
            open={open}
            onClose={onClose}
            className='w-full max-w-xl sm:max-w-4xl'
        >
            <Form {...form}>
                <form className='grid sm:grid-cols-2 gap-4'>
                    <FormField
                        control={form.control}
                        name="fullname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Full name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Please input your full name"
                                        className={` text-base ${errors.fullname ? "border-red-500" : ""}`}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            form.trigger("fullname");
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                                        placeholder="Please input your mail"
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
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Phone number</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Please input your number"
                                        className={` text-base ${errors.phone ? "border-red-500" : ""}`}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            form.trigger("phone");
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl className=' w-full items-center'>
                                        <SelectTrigger className='mt-1.5'>
                                            <SelectValue placeholder="Select a role user" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="1">Super Admin</SelectItem>
                                        <SelectItem value="2">Admin</SelectItem>
                                        <SelectItem value="3">Kasir</SelectItem>
                                    </SelectContent>
                                </Select>
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
                        name="PasswordConfirmation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Password Confirmation</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        {...field}
                                        placeholder="Please input your password confirmation"
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
                </form>
                <div className='flex justify-end items-center mt-6'>
                    <Button
                        disabled={!form.formState.isValid || loading}
                        type="submit"
                        className="w-fit flex items-center justify-center"
                    >
                        {loading ? <BeatLoader color="#010101" size={8} /> : "Create User"}
                    </Button>
                </div>
            </Form>
        </Dialog>
    )
}

export default ModalCreateUser
