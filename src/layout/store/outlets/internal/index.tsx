import PaginationInfo from '@/components/atoms/Table/TableInfo'
import TablePagination from '@/components/atoms/Table/TablePagination'
import Tables from '@/components/atoms/Table/Tables'
import ModalDelete from '@/components/molecules/modal/ModalDelete'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { SearchInputGroup } from '@/components/ui/searchInput'
import Text from '@/components/ui/text'
import { cn, useDebounce } from '@/lib/utils'
import { deletedMultipleOutlets, deletedSpesificOutlets, getOutletsInternal } from '@/store/action/outlets'
import { useOutletStore } from '@/store/hooks/useOutlets'
import { IParamsOutlet, OutletData } from '@/types/outletTypes'
import { Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { set } from 'react-hook-form'
import BeatLoader from 'react-spinners/BeatLoader'
import ClipLoader from 'react-spinners/ClipLoader'
import { toast } from 'sonner'

function OutletInternal() {
    const { outletInternal } = useOutletStore()

    const [outlets, setOutlets] = useState<OutletData[]>(outletInternal?.data || [])
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [searchInput, setSearchInput] = useState("")
    const [filter, setFilter] = useState("")
    const [selectedOutlet, setSelectedOutlet] = useState<number[]>([])
    const [outletId, setOutletId] = useState<number | null>(null)
    const [outletName, setOutletName] = useState("")
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalMultiOutlets, setOpenModalMultiOutlets] = useState(false);

    const search = useDebounce(searchInput, 600)

    const [isPending, startTransition] = useTransition()

    const getInternalOutlets = async () => {
        const params: IParamsOutlet = { page, limit, search, filter }
        const res = await getOutletsInternal(params)
        if (res?.pagination) {
            if (res?.pagination.total_page === 1) {
                setPage(1)
            }
        }
        setOutlets(res?.data || [])
    }

    useEffect(() => {
        startTransition(() => {
            getInternalOutlets()
        })
    }, [page, limit, search])

    const handleSearch = (value: string, filter: string) => {
        setSearchInput(value)
        setFilter(filter)
    }

    const handleChecked = (id: number) => {
        setSelectedOutlet((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((val) => val !== id) : [...prevSelected, id],
        )
    }

    const handleSelectAll = () => {
        if (selectedOutlet.length === outletInternal?.pagination.total_records && outlets.length > 0) {
            setSelectedOutlet([])
        } else {
            try {
                startTransition(async () => {
                    const res = await getOutletsInternal({ page: 0, limit: 0 })
                    const outletsAll = res?.data || []
                    setSelectedOutlet(outletsAll.map((outlet: OutletData) => outlet.id))
                })
            } catch (error) {
                toast.error("Failed select all: missing data outlets")
            }
        }
    }

    const handleOpenModalSpesific = (id: number, name: string) => {
        if (id && name) {
            setOutletId(id)
            setOutletName(name)
            setOpenModalDelete(true)
        }
    }

    const hadleCloseModalSpesific = () => {
        setOpenModalDelete(false)
        setOutletId(null)
        setOutletName("")
    }

    const handleMultiDelete = async () => {
        const resp = new Promise((reslove, rejects) => {
            const typeDel = selectedOutlet.length === outletInternal?.pagination.total_records ? "all" : "partial"
            deletedMultipleOutlets(selectedOutlet, typeDel)
                .then((res: any) => {
                    if (res?.status === 200) {
                        reslove(res)
                        getInternalOutlets()
                        setSelectedOutlet([])
                        setOpenModalMultiOutlets(false)
                    } else {
                        rejects(res)
                    }
                })
        })
        toast.promise(resp, {
            loading: "Deleting outlets...",
            success: "Outlets deleted successfully",
            error: (err: any) => `Failed to delete outlets: ${err?.message || 'Please try again'}`
        })
    }

    const handleDeleteSpesific = async () => {
        if (!outletId) {
            toast.error("Failed delete: missing id outlet")
            return
        }
        const resp = new Promise((reslove, rejects) => {
            deletedSpesificOutlets(outletId).then((res: any) => {
                if (res?.status === 200) {
                    reslove(res)
                    getInternalOutlets()
                    if (selectedOutlet.includes(outletId)) setSelectedOutlet((prevSelected) => prevSelected.filter((val) => val !== outletId))
                    hadleCloseModalSpesific()
                } else {
                    rejects(res)
                }
            })
        })
        toast.promise(resp, {
            loading: "Deleting outlet...",
            success: "Outlet deleted successfully",
            error: (err: any) => `Failed to delete outlet: ${err?.message || 'Please try again'}`
        })
    }

    const columnsOutletList: Column<OutletData>[] = [
        {
            label: (
                <Checkbox
                    className='size-5 mt-1 data-[state=unchecked]:bg-white border-border'
                    checked={selectedOutlet.length === outletInternal?.pagination.total_records && outlets.length > 0}
                    onCheckedChange={handleSelectAll}
                />
            ),
            renderCell: ({ id }) => (
                <div>
                    <Checkbox
                        className='size-5 mt-1 border-border'
                        value={id}
                        checked={selectedOutlet.includes(id)}
                        onCheckedChange={() => handleChecked(id)}
                    />
                </div>
            ),
            className: cn("text-center justify-center"),
        },
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
            label: "Action",
            renderCell: ({ id, name }) => (
                <Button variant="outline" size="icon" onClick={() => handleOpenModalSpesific(id, name)}>
                    <Trash2 />
                </Button>
            ),
            className: cn("text-center justify-center"),
        },
    ]

    // Modal Delete (menggunakan useMemo untuk optimasi)
    const memoModalDeleteSpesific = useMemo(() => {
        if (openModalDelete) {
            return (
                <ModalDelete
                    open={openModalDelete}
                    onClose={setOpenModalDelete}
                    title="Delete Outlet"
                    description={<span>Are you sure want to delete outlet <b>{outletName}</b>?</span>}
                    onConfirm={handleDeleteSpesific}
                    onCancel={hadleCloseModalSpesific}
                />
            );
        }
    }, [openModalDelete]);

    const memoModalDeleteMultiOutlets = useMemo(() => {
        if (openModalMultiOutlets) {
            return (
                <ModalDelete
                    open={openModalMultiOutlets}
                    onClose={setOpenModalMultiOutlets}
                    title="Delete Confirmation"
                    description={<span>Are you sure you want to delete <b>{selectedOutlet.length + " Outlets"}</b>? This action cannot be undone.</span>}
                    onConfirm={handleMultiDelete}
                    onCancel={() => setOpenModalMultiOutlets(false)}
                />
            );
        }
    }, [openModalMultiOutlets]);

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
                options={[
                    { value: "name", label: "Name" },
                ]}
                className="rounded-md"
                onSearch={handleSearch}
            />

            {/* Table */}
            <div>
                {selectedOutlet.length > 0 ? (
                    <div className="flex w-full py-4 px-10 rounded-t-lg bg-orange-100 justify-between items-center">
                        <Text variant="h5" className="text-orange-500">
                            Selected {selectedOutlet.length} {selectedOutlet.length > 1 ? "outlets" : "outlet"}
                        </Text>
                        {selectedOutlet.length > 1 && (
                            <Button size="sm" variant="outline" onClick={() => setOpenModalMultiOutlets(true)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Delete All
                            </Button>
                        )}
                    </div>
                ) : null}
                <Tables columns={columnsOutletList} data={outlets} />
                <div className="flex justify-between items-center p-4 border-slate-100 border-t-[2px]">
                    {/* Pagination Info */}
                    <PaginationInfo displayed={limit} total={outletInternal?.pagination.total_records ?? 0} onChangeDisplayed={setLimit} className="" />
                    {/* Pagination */}
                    <TablePagination limit={limit} page={page} onPageChange={setPage} totalItems={outletInternal?.pagination.total_records ?? 1} />
                </div>
            </div>
            {memoModalDeleteSpesific}
            {memoModalDeleteMultiOutlets}
        </div>
    )
}

export default OutletInternal
