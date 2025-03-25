import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { LiaStoreAltSolid } from "react-icons/lia";
import OutletExternal from './external';
import OutletInternal from './internal';

function Outlets() {
    return (
        <Tabs defaultValue="external">
            <TabsList className='bg-transparent rounded flex gap-5'>
                <TabsTrigger
                    value={'external'}
                    className='flex items-center gap-2 py-5 px-1.5 rounded-none font-normal text-slate-400 border-b-2 data-[state=active]:text-slate-700 data-[state=active]:border-orange-400'
                >
                    <AiOutlineAppstoreAdd size={400} /> Outlets List
                </TabsTrigger>
                <TabsTrigger
                    value={'internal'}
                    className='flex items-center gap-2 py-5 px-1.5 rounded-none font-normal text-slate-400 border-b-2 data-[state=active]:text-slate-700 data-[state=active]:border-orange-400'
                >
                    <LiaStoreAltSolid /> My Outlets
                </TabsTrigger>
            </TabsList>
            <TabsContent className='my-10 p-5 rounded-lg shadow-md shadow-accent border border-accent' value={'external'}>
                <OutletExternal/>
            </TabsContent>
            <TabsContent className='my-10 p-5 rounded-lg shadow-md shadow-accent border border-accent' value={'internal'}>
                <OutletInternal/>
            </TabsContent>
        </Tabs>
    )
}

export default Outlets
