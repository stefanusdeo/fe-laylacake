import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Text from '@/components/ui/text';
import { editAccountSchema } from '@/schema/yup-validation';
import { BodyProfile, updateProfile } from '@/store/action/profile';
import { useProfileStore } from '@/store/hooks/useProfile';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import BeatLoader from 'react-spinners/BeatLoader';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'sonner';

type FormValues = {
    username: string;
    phone: string;
};

const defaultValues: FormValues = {
    username: "",
    phone: "",
};

function General() {
    const form = useForm<FormValues>({
        resolver: yupResolver(editAccountSchema),
        defaultValues,
    });
    const { watch, formState, handleSubmit } = form;
    const { profile } = useProfileStore();

    const [loading, setLoading] = useState(false);
    const [loadProfile, setLoadProfile] = useState<boolean>(false);

    const [lastProfile, setLastProfile] = useState<FormValues>({
        username: profile?.name || "",
        phone: profile?.phone_number || "",
    });

    const watchedValues = watch();

    const isFormChanged = (Object.keys(lastProfile) as (keyof FormValues)[]).some(
        (key) => watchedValues[key] !== lastProfile[key]
    );

    const isButtonDisabled = !isFormChanged || !formState.isValid || loading;

    const handleChangeProfile = async () => {
        const updatedData: Partial<BodyProfile> = {
            name: watchedValues.username,
            phone_number: watchedValues.phone,
        };

        setLoading(true);

        const resp = new Promise((resolve, reject) => {
            updateProfile(updatedData)
                .then((res: any) => {
                    resolve(res);
                    const newProfileData = {
                        username: updatedData.name || watchedValues.username,
                        phone: updatedData.phone_number || watchedValues.phone,
                    };

                    setLastProfile(newProfileData);
                    form.reset(newProfileData);
                })
                .catch((err) => reject(err))
                .finally(() => {
                    setLoading(false);
                });
        });

        toast.promise(resp, {
            loading: "Loading...",
            success: "Edit Profile Success",
            error: (err: any) => `Edit Profile Failed: ${err?.message || 'Please try again'}`,
        });
    };

    useEffect(() => {
        setLoadProfile(true);
        if (profile) {
            const newProfileData = {
                username: profile.name,
                phone: profile.phone_number,
            };

            form.reset(newProfileData);
            setLastProfile(newProfileData); // Simpan nilai terbaru agar jadi referensi perubahan
        }
        setTimeout(() => {
            setLoadProfile(false);
        }, 1000);
    }, [profile]);

    if (loadProfile) {
        return (
            <Text variant="span" className="flex items-center justify-center gap-2 py-3 px-4">
                <ClipLoader loading={loadProfile} size={15} /> Getting profile...
            </Text>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(handleChangeProfile)}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    {/* Username */}
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm md:text-base font-medium">Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={profile?.role_name === "Kasir"}
                                        type="text"
                                        placeholder="Please input your name"
                                        className={`text-sm md:text-base ${formState.errors.username ? "border-red-500" : ""}`}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                        )}
                    />

                    {/* Email */}
                    <div>
                        <FormItem className="select-none">
                            <FormLabel className="text-sm md:text-base font-medium">E-mail</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Please input your E-mail"
                                    value={profile?.email || ""}
                                    disabled
                                    className="text-sm md:text-base"
                                />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                    </div>

                    {/* Phone */}
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm md:text-base font-medium">Phone number</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={profile?.role_name === "Kasir"}
                                        type="text"
                                        placeholder="Please input your phone number"
                                        className={`text-sm md:text-base ${formState.errors.phone ? "border-red-500" : ""}`}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs text-red-500" />
                            </FormItem>
                        )}
                    />

                    {/* Role */}
                    <div>
                        <FormItem className="select-none">
                            <FormLabel className="text-sm md:text-base font-medium">Role</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    value={profile?.role_name || ""}
                                    disabled
                                    className="text-sm md:text-base"
                                />
                            </FormControl>
                            <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end items-center">
                    {profile?.role_name !== "Kasir" && (
                        <Button
                            disabled={isButtonDisabled}
                            type="submit"
                            className="w-full sm:w-fit flex items-center justify-center text-sm md:text-base"
                        >
                            {loading ? <BeatLoader color="#010101" size={8} /> : "Save Changes"}
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    );
}

export default General;
