"use client"
import { useState, useEffect, useMemo, useTransition } from 'react'
import PaginationInfo from '@/components/atoms/Table/TableInfo'
import TablePagination from '@/components/atoms/Table/TablePagination'
import Tables from '@/components/atoms/Table/Tables'
import ModalInfo from '@/components/molecules/modal/ModalInfo'
import { Button } from '@/components/ui/button'
import { SearchInputGroup } from '@/components/ui/searchInput'
import { cn, useDebounce } from '@/lib/utils'
import { IParamsOutlet, OutletData } from '@/types/outletTypes'
import { getOutletsExternal, migrateOutlets } from '../../../../store/action/outlets'
import { useOutletStore } from '@/store/hooks/useOutlets'
import { TbPackageExport } from "react-icons/tb"
import BeatLoader from 'react-spinners/BeatLoader'
import { set } from 'react-hook-form'
import { rejects } from 'assert'
import { toast } from 'sonner'
import Text from '@/components/ui/text'
import ClipLoader from 'react-spinners/ClipLoader'

function OutletExternal() {
    const { outletExternal } = useOutletStore()

    const [outlets, setOutlets] = useState<OutletData[]>(outletExternal?.data || [])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [searchInput, setSearchInput] = useState("")
    const [filter, setFilter] = useState("")
    const [openModalInfo, setOpenModalInfo] = useState(false)
    const [outletId, setOutletId] = useState<number[]>([])
    const [outletName, setOutletName] = useState("")

    const search = useDebounce(searchInput, 600)

    const [isPending, startTransition] = useTransition()

    const getExternalOutlets = async () => {
        const params: IParamsOutlet = { page, limit, search, filter }
        const res = await getOutletsExternal(params)
        if (res?.pagination) {
            if (res?.pagination.total_page === 1) {
                setPage(1)
            }
        }
        setOutlets(res?.data || [])
    }

    useEffect(() => {
        startTransition(() => {
            getExternalOutlets()
        })
    }, [page, limit, search])

    const handleSearch = (value: string, filter: string) => {
        setSearchInput(value)
        setFilter(filter)
    }

    const handleOpenModalInfo = (id: number, name: string) => {
        if (id && name) {
            setOutletId([id])
            setOutletName(name)
            setOpenModalInfo(true)
        }
    }

    const hadleCloseModalInfo = () => {
        setOpenModalInfo(false)
        setOutletId([])
        setOutletName("")
    }

    const handleMove = () => {
        const resp = new Promise((reslove, rejects) => {
            migrateOutlets(outletId)
                .then((res: any) => {
                    if (res?.status === 200) {
                        reslove(res)
                        getExternalOutlets()
                        hadleCloseModalInfo()
                    } else {
                        rejects(res)
                    }
                })
        });
        toast.promise(resp, {
            loading: "Moving outlet...",
            success: "Outlet moved successfully",
            error: (err: any) => `Failed to move outlet: ${err?.message || 'Please try again'}`
        })
    }

    // Columns Outlet List
    const columnsOutletList: Column<OutletData>[] = [
        {
            label: "No",
            renderCell: () => null,
            className: cn("text-center justify-center"),
        },
        {
            label: "Name",
            renderCell: (row) => <p>{row.name}</p>,
            className: "w-fit text-left",
        },
        {
            label: "Address",
            renderCell: (row) => <p>{row.address}</p>,
            className: "",
        },
        {
            label: "Phone Number",
            renderCell: (row) => <p>{row.phone_number}</p>,
            className: "",
        },
        {
            label: "Move",
            renderCell: ({ id, name }) => (
                <Button variant="outline" size="icon" onClick={() => handleOpenModalInfo(id, name)}>
                    <TbPackageExport />
                </Button>
            ),
            className: cn("text-center justify-center"),
        },
    ]

    const memoModalInfo = useMemo(() => {
        if (openModalInfo) {
            return (
                <ModalInfo
                    open={openModalInfo}
                    onClose={setOpenModalInfo}
                    title="Moving Outlet"
                    description={<span>Are you sure want to move <b>{outletName}</b> to your outlet?</span>}
                    onConfirm={handleMove}
                    onCancel={hadleCloseModalInfo}
                />
            )
        }
    }, [openModalInfo])

    if (isPending) {
        return (
            <Text variant="span" className="flex items-center justify-center gap-2 py-3 px-4">
                <ClipLoader loading={isPending} size={15} /> Getting outlet list...
            </Text>
        );
    }

    return (
        <div className="w-full space-y-7">
            {/* Search Input */}
            <SearchInputGroup
                options={[{ value: "name", label: "Name" }]}
                className="rounded-md"
                onSearch={handleSearch}
            />

            {/* Loading State */}
            {isPending && (
                <div className="flex justify-center items-center py-5">
                    <p className="text-gray-500">Loading data...</p>
                </div>
            )}

            {/* Table */}
            <div>
                <Tables columns={columnsOutletList} data={outlets} />
                <div className="flex flex-wrap justify-center md:justify-between items-center gap-2.5 p-2.5 md:p-4 border-slate-100 border-t-[2px]">
                    {/* Pagination Info */}
                    <PaginationInfo displayed={limit} total={outletExternal?.pagination.total_records ?? 0} onChangeDisplayed={setLimit} className="" />
                    {/* Pagination */}
                    <TablePagination limit={limit} page={page} onPageChange={setPage} totalItems={outletExternal?.pagination.total_records ?? 1} />
                </div>
            </div>
            {memoModalInfo}
        </div>
    )
}

export default OutletExternal
