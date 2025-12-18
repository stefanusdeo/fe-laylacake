"use client"

import { CustomSelect, SelectOption } from "@/components/atoms/Selects"
import { getAccessOutlet } from "@/store/action/user-management"
import { useUserStore } from "@/store/hooks/useUsers"
import { OutletData } from "@/types/outletTypes"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

interface ISearchOutlets {
    value: { id: number; name: string } | null
    setValue: Dispatch<SetStateAction<{ id: number; name: string } | null>>
}

export function SearchAccessOutlets({ value, setValue }: ISearchOutlets) {
    const { myOutlet } = useUserStore()
    const [outletOptions, setOutletOptions] = useState<SelectOption[]>(myOutlet?.map((item: OutletData) => ({ value: item.id.toString(), label: item.name })) ?? [])
    const [outletSelect, setOutletSelect] = useState<string>("")
    const [isLoadingOutlet, setIsLoadingOutlet] = useState(false)

    const fetchOutlet = async () => {
        setIsLoadingOutlet(true)
        try {
            const res = await getAccessOutlet()
            setOutletOptions(res.data.map((item: OutletData) => ({ value: item.id.toString(), label: item.name })))
            setOutletSelect(res.data[0].id.toString())
            setIsLoadingOutlet(false)
        }
        catch (err) {
            setIsLoadingOutlet(false)
        }
    }

    useEffect(() => {
        if (myOutlet?.length === 0 || !myOutlet || outletOptions.length === 0 || !outletOptions) {
            fetchOutlet()
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("outletId", outletSelect)
    }, [outletSelect])

    return (
        <CustomSelect
            options={outletOptions}
            label="Outlet"
            placeholder={outletOptions.length > 0 ? "Select a outlet" : "No outlet"}
            isLoading={isLoadingOutlet}
            value={outletSelect}
            onChange={setOutletSelect}
            className='!h-10 max-sm:w-full'
        />
    )

}
