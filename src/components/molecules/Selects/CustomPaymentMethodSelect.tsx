import { useEffect, useState } from "react";
import { CustomSelect, SelectOption } from "@/components/atoms/Selects";
import { getPaymentInternal } from "@/store/action/payment-method";
import { usePaymentStore } from "@/store/hooks/usePayment";
import { PaymentMethodData } from "@/types/paymentTypes";

type CustomPaymentMethodSelectProps = {
    value: string;
    onChange: (val: string) => void;
    label?: string;
    className?: string;
    placeholder?: string;
};

export default function PaymentMethodSelect({
    value,
    onChange,
    label = "Method",
    className,
    placeholder = "Select payment method",
}: CustomPaymentMethodSelectProps) {
    const { paymentInternal } = usePaymentStore();
    const [options, setOptions] = useState<SelectOption[]>(
        paymentInternal?.data?.map((item: PaymentMethodData) => ({
            value: item.id.toString(),
            label: item.name,
        })) ?? []
    );
    const [isLoading, setIsLoading] = useState(false);

    const fetchMethod = async () => {
        setIsLoading(true);
        try {
            const res = await getPaymentInternal({ page: 0, limit: 0 });
            setOptions(
                res.data.map((item: PaymentMethodData) => ({
                    value: item.id.toString(),
                    label: item.name,
                }))
            );
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (
            !paymentInternal?.data ||
            paymentInternal?.data.length === 0 ||
            options.length === 0
        ) {
            fetchMethod();
        }
    }, []);

    return (
        <CustomSelect
            options={options}
            label={label}
            placeholder={options.length > 0 ? placeholder : "Data not found"}
            isLoading={isLoading}
            value={value}
            onChange={onChange}
            className={className}
        />
    );
}