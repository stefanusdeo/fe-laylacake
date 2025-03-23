import PaginationInfo from '@/components/atoms/Table/TableInfo'
import TablePagination from '@/components/atoms/Table/TablePagination'
import Tables from '@/components/atoms/Table/Tables'
import ModalDelete from '@/components/molecules/modal/ModalDelete'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { SearchInputGroup } from '@/components/ui/searchInput'
import Text from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { OutletData } from '@/types/outletTypes'
import { Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

const outlets: OutletData[] = [
    {
        id: 1,
        name: "Regency",
        address: "Villa tangerang indah CC5 No. 3, kec periuk, kota Tangerang.",
        phone_number: "082113716706",
    },
    {
        id: 2,
        name: "Sepatan",
        address: " Jl raya mauk km 19, sulang, kec sepatan kab. Tangerang",
        phone_number: "81281965250",
    },
    {
        id: 3,
        name: "Kehakiman",
        address: " Jl TM Taruna no 27. Tangerang",
        phone_number: "81311506249",
    },
]


function OutletInternal() {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [selectedOutlet, setSelectedOutlet] = useState<number[]>([])
    const [openModalDelete, setOpenModalDelete] = useState(false);

    const totalList = outlets.length

    const handleChecked = (id: number) => {
        setSelectedOutlet((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((val) => val !== id) : [...prevSelected, id],
        )
    }

    const handleSelectAll = () => {
        if (selectedOutlet.length === totalList) {
            setSelectedOutlet([])
        } else {
            setSelectedOutlet(outlets.map((outlet) => outlet.id))
        }
    }

    const columnsOutletList: Column<OutletData>[] = [
        {
            label: (
                <Checkbox
                    className='size-5 mt-1 data-[state=unchecked]:bg-white border-border'
                    checked={selectedOutlet.length === totalList}
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
            renderCell: () => (
                <Button variant="outline" size="icon" onClick={() => setOpenModalDelete(true)}>
                    <Trash2 />
                </Button>
            ),
            className: cn("text-center justify-center"),
        },
    ]

    // Modal Delete (menggunakan useMemo untuk optimasi)
    const memoModalDelete = useMemo(() => {
        if (openModalDelete) {
            return (
                <ModalDelete
                    open={openModalDelete}
                    onClose={setOpenModalDelete}
                    title="Delete Outlet"
                    description={`Are you sure want to delete ${selectedOutlet.length > 1 ? selectedOutlet.length + " Outlets?" : "this outlet?"}`}
                    onConfirm={() => setOpenModalDelete(false)}
                    onCancel={() => setOpenModalDelete(false)}
                />
            );
        }
    }, [openModalDelete]);

    return (
        <div className="w-full space-y-7">
            {/* Search Input */}
            <SearchInputGroup
                options={[
                    { value: "name", label: "Name" },
                    { value: "address", label: "Address" },
                    { value: "phone_number", label: "Phone Number" },
                ]}
                className="rounded-md"
            />

            {/* Table */}
            <div>
                {selectedOutlet.length > 0 ? (
                    <div className="flex w-full py-4 px-10 rounded-t-lg bg-amber-100 justify-between items-center">
                        <Text variant="h5" className="text-amber-500">
                            Selected {selectedOutlet.length} {selectedOutlet.length > 1 ? "outlets" : "outlet"}
                        </Text>
                        {selectedOutlet.length > 1 && (
                            <Button size="sm" variant="outline" onClick={() => setOpenModalDelete(true)}>
                                <Trash2 className="h-4 w-4 mr-2" /> Delete All
                            </Button>
                        )}
                    </div>
                ) : null}
                <Tables columns={columnsOutletList} data={outlets} />
                <div className="flex justify-between items-center p-4 border-slate-100 border-t-[2px]">
                    {/* Pagination Info */}
                    <PaginationInfo displayed={limit} total={outlets.length} onChangeDisplayed={setLimit} className="" />
                    {/* Pagination */}
                    <TablePagination limit={limit} page={page} onPageChange={setPage} totalItems={outlets.length} />
                </div>
            </div>
            {memoModalDelete}
        </div>
    )
}

export default OutletInternal
