"use client"
import Badge from '@/components/atoms/Badge';
import Breadcrums from '@/components/molecules/breadcrums';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/passwordInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Text from '@/components/ui/text';
import { userUpdateSchema } from '@/schema/yup-validation';
import { createUsers, getDetailUser, updateUser, UserFormBody } from '@/store/action/user-management';
import { useUserStore } from '@/store/hooks/useUsers';
import { OutletUsers } from '@/types/userTypes';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useActionState, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import BeatLoader from 'react-spinners/BeatLoader';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'sonner';
import { SearchOutlets } from '../searchOutlets';

interface State {
    loading: boolean
    success: boolean
    error: string | null
}

function EditUser() {
    const router = useRouter();
    const { id_user } = useUserStore();

    const form = useForm({
        resolver: yupResolver(userUpdateSchema),
        defaultValues: {
            fullname: "",
            email: "",
            phone: "",
            role: "",
            password: "",
            PasswordConfirmation: "",
            outlet_ids: []
        }
    });

    const { watch } = form;
    const [outlets, setOutlets] = useState<OutletUsers[]>([]);
    const [loading, setLoading] = useState(false);
    const [originalValues, setOriginalValues] = useState<any>(null);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [findOutlet, setFindOutlet] = React.useState<{ id: number; name: string } | null>(null)

    const handleChangeUser = async () => {
        setLoading(true);
        const data: UserFormBody = {
            name: form.getValues("fullname") as string,
            email: form.getValues("email") as string,
            phone_number: form.getValues("phone") as string,
            role_id: Number(form.getValues("role")),
            password: form.getValues("password") as string,
            confirm_password: form.getValues("PasswordConfirmation") as string,
        }

        if (data.role_id === 3 || data.role_id === 2) {
            data["outlet_ids"] = form.getValues("outlet_ids") as number[];
        }

        const resp = new Promise((resolve, reject) => {
            id_user ? updateUser(id_user, data)
                .then((res: any) => {
                    if (res?.status === 200) {
                        resolve(res);
                        form.reset()
                        router.push("/user-management/user-list")
                    }
                })
                .catch((err) => reject(err))
                .finally(() => {
                    setLoading(false);
                }) : toast.error("Update User Failed : missing user");
        });

        toast.promise(resp, {
            loading: "Loading...",
            success: "Edit User Success",
            error: (err: any) => `Edit User Failed: ${err?.message || 'Please try again'}`,
        });
    };

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
        if (id_user) {
            const getUser = async () => {
                try {
                    setLoading(true);
                    const res = await getDetailUser(id_user);
                    if (res?.status === 200) {
                        const userData = {
                            fullname: res.data.name,
                            email: res.data.email,
                            phone: res.data.phone_number,
                            role: res.data.role_id.toString(),
                            password: undefined,
                            PasswordConfirmation: undefined,
                            outlet_ids: res.data.outlets ? res.data.outlets.map((outlet: OutletUsers) => outlet.id) : []
                        };

                        form.reset(userData);
                        setOriginalValues(userData);
                        setOutlets(res.data.outlets || []);
                        setLoading(false);
                    }
                } catch (error) {
                    console.error(error);
                    setLoading(false);
                }
            };
            getUser();
        }
    }, [id_user, form]);

    useEffect(() => {
        if (!originalValues) return;
        const currentValues = form.getValues();
        const isChanged = JSON.stringify(originalValues) !== JSON.stringify(currentValues);
        setIsFormChanged(isChanged);
    }, [watch(), originalValues]);

    return (
        <div className="flex flex-col gap-5 md:gap-7">
            <div className="flex flex-col gap-3">
                <Text variant="h2" className=' max-sm:text-2xl'>Edit User</Text>
                <Breadcrums />
            </div>
            <div className="w-full min-h-5/6 shadow-md shadow-accent border-accent border rounded-lg p-2.5 md:p-5 space-y-7 mb-10">
                {loading ? (
                    <Text variant="span" className="flex items-center justify-center gap-2 py-3 px-4">
                        <ClipLoader loading={loading} size={15} /> Please wait...
                    </Text>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleChangeUser)}>
                            <div className='grid sm:grid-cols-2 gap-4'>
                                <FormField control={form.control} name="fullname" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm md:text-base">Full name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Please input your full name" className="text-sm md:text-base" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm md:text-base">E-mail</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email" placeholder="Please input your email" className="text-sm md:text-base" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="phone" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm md:text-base">Phone number</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" placeholder="Please input your phone number" className="text-sm md:text-base" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField disabled control={form.control} name="role" render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <FormLabel className="text-sm md:text-base">Role</FormLabel>
                                        <Select disabled onValueChange={field.onChange} value={field.value}>
                                            <FormControl className='w-full text-sm md:text-base'>
                                                <SelectTrigger className="text-sm md:text-base">
                                                    <SelectValue placeholder="Select a role user" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="text-sm md:text-base">
                                                <SelectItem value="1">Super Admin</SelectItem>
                                                <SelectItem value="2">Admin</SelectItem>
                                                <SelectItem value="3">Kasir</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <input type="hidden" name="role" value={field.value} />
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="password" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm md:text-base">Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput {...field} placeholder="Please input your password" className="text-sm md:text-base" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="PasswordConfirmation" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm md:text-base">Password Confirmation</FormLabel>
                                        <FormControl>
                                            <PasswordInput {...field} placeholder="Please input your password confirmation" className="text-sm md:text-base" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            {form.watch("role") !== "1" && (
                                <div className='my-6 border-t border-slate-300 py-4 sm:py-5 flex flex-col gap-3 sm:gap-4'>
                                    <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4'>
                                        <span className='font-semibold text-sm md:text-base'>My Outlets</span>

                                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2'>
                                            <SearchOutlets value={findOutlet} setValue={setFindOutlet} />
                                            <Button
                                                variant={"outline"}
                                                type='button'
                                                disabled={!findOutlet}
                                                onClick={handleAddOutlet}
                                                className="text-sm md:text-base px-3 py-2"
                                            >
                                                <Plus size={16} className="mr-1" /> Add Outlet
                                            </Button>
                                        </div>
                                    </div>

                                    <div className='flex flex-wrap items-start justify-start gap-x-2 gap-y-2 mt-4 border border-border p-3 sm:p-4 rounded-lg min-h-20'>
                                        {outlets.length > 0 ? (
                                            outlets.map((outlet, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                    className="flex items-center rounded-sm gap-1 h-auto py-1 px-2 text-xs md:text-sm"
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
                                                <span className="text-sm md:text-base">No Outlet Added</span>
                                            </div>
                                        )}
                                    </div>

                                    <input
                                        type="hidden"
                                        name="outlet_ids"
                                        value={JSON.stringify(outlets.map(outlet => outlet.id))}
                                    />
                                </div>
                            )}

                            <div className='flex justify-end items-center mt-6'>
                                <Button
                                    disabled={!isFormChanged || ((form.watch("role") === "2" || form.watch("role") === "3") && outlets.length === 0)}
                                    type="submit"
                                    className="w-full md:w-fit flex items-center justify-center text-sm md:text-base px-4 py-2"
                                >
                                    {loading ? <BeatLoader color="#ffffff" size={8} /> : "Update User"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </div>
        </div>
    );
}

export default EditUser;
