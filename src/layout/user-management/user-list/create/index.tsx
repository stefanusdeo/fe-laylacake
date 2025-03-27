"use client"
import Badge from '@/components/atoms/Badge';
import Breadcrums from '@/components/molecules/breadcrums';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/passwordInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Text from '@/components/ui/text';
import { userSchema } from '@/schema/yup-validation';
import { createUsers, UserFormBody } from '@/store/action/user-management';
import { useOutletStore } from '@/store/hooks/useOutlets';
import { OutletUsers } from '@/types/userTypes';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import BeatLoader from 'react-spinners/BeatLoader';
import { toast } from 'sonner';
import { SearchOutlets } from '../searchOutlets';

interface State {
    loading: boolean
    success: boolean
    error: string | null
}

async function handleCreateUser(prevState: State, formData: FormData): Promise<State> {
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
            const outletIdsStr = formData.get("outlet_ids") as string;
            data["outlet_ids"] = outletIdsStr ? JSON.parse(outletIdsStr) as number[] : undefined;
        }

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

function CreatedUser() {
    const router = useRouter()
    const { outletInternal } = useOutletStore()
    const form = useForm({
        resolver: yupResolver(userSchema),
    })
    const [outlets, setOutlets] = React.useState<OutletUsers[]>([])
    const [findOutlet, setFindOutlet] = React.useState<{ id: number; name: string } | null>(null)

    const [state, submitAction] = useActionState<State, FormData>(handleCreateUser, { loading: false, success: false, error: null })

    const handleAddOutlet = () => {
        if (findOutlet) {
            const outletExists = outlets.some(outlet => outlet.id === findOutlet.id);

            if (outletExists) {
                toast.error("Outlet already added");
                return;
            }

            const newOutlets = [...outlets, findOutlet];
            setOutlets(newOutlets);
            form.setValue("outlet_ids", newOutlets?.map(outlet => outlet.id));
            setFindOutlet(null);
        }
    }

    useEffect(() => {
        if (state.success) {
            router.push("/user-management/user-list")
            form.reset()
        }
    }, [state.success])
    return (
        <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-3">
                <Text variant="h2">Create User</Text>
                <Breadcrums />
            </div>
            <div className="w-full min-h-5/6 shadow-md shadow-accent border-accent border rounded-lg px-5 py-5 space-y-7">
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
                        {form.watch("role") === "3" &&
                            <div className='my-6 border-t border-slate-300 py-5 flex flex-col gap-2'>
                                <div className='flex flex-wrap gap-3 justify-between items-center'>
                                    <Text variant='span' className='font-semibold'>My Outlets</Text>
                                    <div className='flex flex-wrap items-center gap-2'>
                                        <SearchOutlets value={findOutlet} setValue={setFindOutlet} />
                                        <Button
                                            variant={"outline"}
                                            type='button'
                                            disabled={!findOutlet}
                                            onClick={handleAddOutlet}
                                        >
                                            <Plus /> Add Outlet
                                        </Button>
                                    </div>
                                </div>
                                <div className='flex flex-wrap items-start justify-start gap-x-2 gap-y-2 mt-4 border border-border p-4 rounded-lg min-h-20'>
                                    {outlets.length > 0 ? (
                                        outlets.map((outlet, index) => (
                                            <Badge
                                                key={index}
                                                variant="outline"
                                                className="flex items-center rounded-sm gap-1 h-auto py-1 px-2 text-sm"
                                                action={() => {
                                                    const newOutlets = outlets.filter((_, i) => i !== index);
                                                    setOutlets(newOutlets);
                                                    form.setValue("outlet_ids", newOutlets.map(outlet => outlet.id));
                                                }}
                                                icon={<Trash2 size={14} className='text-slate-500' />}
                                                label={outlet.name}
                                            />
                                        ))
                                    ) : (
                                        <div className='flex justify-center items-center w-full gap-2 mt-3'>
                                            <Text variant='span'>No Outlet Added</Text>
                                        </div>
                                    )}
                                </div>
                                {/* Hidden input to store outlet IDs */}
                                <input
                                    type="hidden"
                                    name="outlet_ids"
                                    value={JSON.stringify(outlets.map(outlet => outlet.id))}
                                />
                            </div>
                        }
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
            </div>
        </div>
    )
}

export default CreatedUser
