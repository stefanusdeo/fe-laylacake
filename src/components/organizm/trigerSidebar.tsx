"use client"
import { useSidebar } from '@/components/ui/sidebar';
import { LuListMinus } from "react-icons/lu";
import { PiCaretDoubleLeftDuotone } from "react-icons/pi";
export default function TrigerSidebar() {
    const { toggleSidebar, open, openMobile, isMobile } = useSidebar()
    return (
        <div>
            <div className='relative text-2xl bg-white rounded-full'>
                {isMobile ? <LuListMinus color="" size={30} className={` cursor-pointer text-orange-400 font-bold`} onClick={() => toggleSidebar()} />
                    : <PiCaretDoubleLeftDuotone className={`${open || openMobile ? "" : "rotate-180"} text-orange-400`} onClick={() => toggleSidebar()} />
                }
            </div>
        </div>
    )
}
