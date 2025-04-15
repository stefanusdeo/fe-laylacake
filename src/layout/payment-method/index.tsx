import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TbCreditCardPay } from "react-icons/tb";
import { MdOutlinePayments } from "react-icons/md";
import PaymentMethodsExternal from './external';
import PaymentMethodInternal from './internal';
function PaymentMethod() {
    return (
        <Tabs defaultValue="external">
            <TabsList className='bg-transparent rounded flex gap-5'>
                <TabsTrigger
                    value={'external'}
                    className='flex items-center gap-2 py-5 px-1.5 rounded-none font-normal text-slate-400 border-b-2 data-[state=active]:text-slate-700 data-[state=active]:border-orange-400'
                >
                    <TbCreditCardPay size={400} /> Payment Method List
                </TabsTrigger>
                <TabsTrigger
                    value={'internal'}
                    className='flex items-center gap-2 py-5 px-1.5 rounded-none font-normal text-slate-400 border-b-2 data-[state=active]:text-slate-700 data-[state=active]:border-orange-400'
                >
                    <MdOutlinePayments /> Payment Method
                </TabsTrigger>
            </TabsList>
            <TabsContent className='my-10 p-5 rounded-lg shadow-md shadow-accent border border-accent' value={'external'}>
                <PaymentMethodsExternal />
            </TabsContent>
            <TabsContent className='my-10 p-5 rounded-lg shadow-md shadow-accent border border-accent' value={'internal'}>
                <PaymentMethodInternal />
            </TabsContent>
        </Tabs>
    )
}

export default PaymentMethod
