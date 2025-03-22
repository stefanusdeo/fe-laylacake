import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { editAccountSchema } from '@/schema/yup-validation';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import BeatLoader from 'react-spinners/BeatLoader';

type FormValues = {
    username: string;
    phone: string;
};

const defaultValues: FormValues = {
    username: "Wahyu",
    phone: "087615278399",
};

function General() {
    const form = useForm<FormValues>({
        resolver: yupResolver(editAccountSchema),
        defaultValues,
    });

    const [loading, setLoading] = useState(false);
    const { watch, formState } = form;

    // Mengawasi perubahan nilai
    const watchedValues = watch();

    // Cek apakah ada perubahan dari defaultValues
    const isFormChanged = (Object.keys(defaultValues) as (keyof FormValues)[]).some(
        (key) => watchedValues[key] !== defaultValues[key]
    );

    const isButtonDisabled = !isFormChanged || !formState.isValid || loading;

    return (
        <Form {...form}>
            <form className='grid grid-cols-2 gap-5 mb-5'>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm">Name</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    placeholder="Please input your name"
                                    className={`text-base ${formState.errors.username ? "border-red-500" : ""}`}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                    <FormItem className='select-none'>
                        <FormLabel className="text-sm">E-mail</FormLabel>
                        <FormControl>
                            <Input
                                type="text"
                                placeholder="Please input your E-mail"
                                value="design@mail.com"
                                disabled
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </div>
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
                                    placeholder="Please input your phone number"
                                    className={`text-base ${formState.errors.phone ? "border-red-500" : ""}`}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                    <FormItem className='select-none'>
                        <FormLabel className="text-sm">Role</FormLabel>
                        <FormControl>
                            <Input
                                type="text"
                                value="Super Admin"
                                disabled
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </div>
            </form>
            <div className='flex justify-end items-center'>
                <Button
                    disabled={isButtonDisabled}
                    type="submit"
                    className="w-fit flex items-center justify-center"
                >
                    {loading ? <BeatLoader color="#010101" size={8} /> : "Save Changes"}
                </Button>
            </div>
        </Form>
    );
}

export default General;
