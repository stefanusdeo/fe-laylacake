"use client"
import Dialog from '@/components/molecules/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/passwordInput'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { userSchema } from '@/schema/yup-validation'
import { createUsers, UserFormBody } from '@/store/action/user-management'
import { ModalProps } from '@/types/modalTypes'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useActionState } from 'react'
import BeatLoader from 'react-spinners/BeatLoader'
import { toast } from 'sonner'

interface State {
    loading: boolean
    success: boolean
    error: string | null
}

async function handleCreateUser(prevState: State, formData: FormData): Promise<State> {
    console.log("ini form", formData.get("role"))
    try {
        const data: UserFormBody = {
            name: formData.get("fullname") as string,
            email: formData.get("email") as string,
            phone_number: formData.get("phone") as string,
            role_id: Number(formData.get("role")),
            password: formData.get("password") as string,
            confirm_password: formData.get("PasswordConfirmation") as string,
        }

        if (data.role_id === 3) {
            data["outlet_ids"] = []
        }

        // Mulai loading
        const newState: State = { loading: true, success: false, error: null }

        const res = await createUsers(data)

        if (res?.status === 200) {
            toast.success("Create User Success")
            return { loading: false, success: true, error: null }
        } else {
            throw new Error(res?.message || "Create User Failed")
        }
    } catch (error: any) {
        toast.error(`Create User Failed: ${error.message}`)
        return { loading: false, success: false, error: error.message }
    }
}

const ModalCreateUser: React.FC<ModalProps> = ({ open, onClose }) => {
    const form = useForm({
        resolver: yupResolver(userSchema),
    })

    const [state, submitAction] = useActionState<State, FormData>(handleCreateUser, { loading: false, success: false, error: null })

    useEffect(() => {
        if (state.success) {
            onClose(false)
            form.reset()
        }
    }, [state.success])
    return (
        <Dialog
            title='Create New User'
            open={open}
            onClose={onClose}
            className='w-full max-w-xl sm:max-w-4xl'
        >
            <Form {...form}>
                <form action={submitAction}>
                    <div className='grid sm:grid-cols-2 gap-4'>
                        <FormField
                            control={form.control}
                            name="fullname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">Full name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Please input your full name" />
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
                                        <Input {...field} type="email" placeholder="Please input your email" />
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
                                        <Input {...field} type="text" placeholder="Please input your phone number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem className='w-full'>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange}>
                                        <FormControl className='w-full'>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role user" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">Super Admin</SelectItem>
                                            <SelectItem value="2">Admin</SelectItem>
                                            <SelectItem value="3">Kasir</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <input type="hidden" name="role" value={field.value} />
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
                                        <PasswordInput {...field} placeholder="Please input your password" />
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
                                        <PasswordInput {...field} placeholder="Please input your password confirmation" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex justify-end items-center mt-6'>
                        <Button
                            disabled={state.loading || !form.formState.isValid}
                            type="submit"
                            className="w-fit flex items-center justify-center"
                        >
                            {state.loading ? <BeatLoader color="#ffffff" size={8} /> : "Create User"}
                        </Button>
                    </div>
                </form>
            </Form>
        </Dialog>
    )
}

export default ModalCreateUser
