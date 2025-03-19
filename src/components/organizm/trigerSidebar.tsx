"use client"
import { useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { PiCaretDoubleLeftDuotone, PiListBold } from "react-icons/pi";

export default function TrigerSidebar() {
    const { toggleSidebar, open, openMobile, isMobile } = useSidebar()
    return (
        <div>
            <div className='relative text-2xl bg-white rounded-full'>
                {isMobile ? <PiListBold color="#C6C6C6" size={25} className={` cursor-pointer`} onClick={() => toggleSidebar()} />
                    : <PiCaretDoubleLeftDuotone className={`${open || openMobile ? "" : "rotate-180"}`} onClick={() => toggleSidebar()} />
                }
            </div>
        </div>
    )
}
