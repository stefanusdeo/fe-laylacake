import PaginationInfo from '@/components/atoms/Table/TableInfo'
import TablePagination from '@/components/atoms/Table/TablePagination'
import Tables from '@/components/atoms/Table/Tables'
import Breadcrums from '@/components/molecules/breadcrums'
import ButtonAction from '@/components/molecules/buttonAction'
import ModalDelete from '@/components/molecules/modal/ModalDelete'
import { users } from '@/components/template/user-management/user-list/data'
import { Button } from '@/components/ui/button'
import { SearchInputGroup } from '@/components/ui/searchInput'
import Text from '@/components/ui/text'
import { cn } from "@/lib/utils"
import { User, UserOutlet } from '@/types/userTypes'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import ModalCreateUser from './modal/modalCreate'
import ModalUpdateUser from './modal/modalUpdate'
import { Checkbox } from '@/components/ui/checkbox'
import { PiTrashDuotone } from 'react-icons/pi'

function UserList() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [selectedUser, setSelectedUser] = useState<number[]>([]); // hanya array of number
    const totalList = users.length;

    const handleChecked = (id: number) => {
        setSelectedUser((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((val) => val !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedUser.length === totalList) {
            setSelectedUser([]);
        } else {
            setSelectedUser(users.map(user => user.id));
        }
    };

    const columnsUserList: Column<User>[] = [
        {
            label: (
                <Checkbox
                    className='size-5 mt-1 data-[state=unchecked]:bg-white border-border'
                    checked={selectedUser.length === totalList}
                    onCheckedChange={handleSelectAll}
                />
            ),
            renderCell: ({ id }) => (
                <div>
                    <Checkbox
                        className='size-5 mt-1 border-border'
                        value={id}
                        checked={selectedUser.includes(id)}
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
            label: "Role",
            renderCell: (row) => <p>{row.role.name}</p>,
            className: "",
        },
        {
            label: "Phone",
            renderCell: (row) => <p>{row.no_hp}</p>,
            className: "",
        },
        {
            label: "Outlets",
            renderCell: ({ outlets }) => (
                <p>{outlets.map((val: UserOutlet) => val.outlet.alamat).join(" ; ")}</p>
            ),
        },
        {
            label: "",
            renderCell: ({ id }) => (
                <ButtonAction
                    onDelete={() => setOpenModalDelete(true)}
                    onEdit={() => setOpenModalEdit(true)}
                />
            ),
        },
    ];

    // Modal Delete (menggunakan useMemo untuk optimasi)
    const memoModalDelete = useMemo(() => {
        if (openModalDelete) {
            return (
                <ModalDelete
                    open={openModalDelete}
                    onClose={setOpenModalDelete}
                    title="Delete User"
                    description="Are you sure want to delete this user?"
                    onConfirm={() => setOpenModalDelete(false)}
                    onCancel={() => setOpenModalDelete(false)}
                />
            );
        }
    }, [openModalDelete]);

    // Modal Create
    const memoModalCreate = useMemo(() => {
        if (openModalCreate)
            return <ModalCreateUser open={openModalCreate} onClose={setOpenModalCreate} />;
    }, [openModalCreate]);

    // Modal Edit
    const memoModalEdit = useMemo(() => {
        if (openModalEdit)
            return <ModalUpdateUser open={openModalEdit} onClose={setOpenModalEdit} />;
    }, [openModalEdit]);

    return (
        <div className="flex flex-col gap-7">
            {/* Header */}
            <div className="flex justify-between items-center gap-5 select-none">
                <div className="flex flex-col gap-3">
                    <Text variant="h2">User List</Text>
                    <Breadcrums />
                </div>
                <Button size="lg" onClick={() => setOpenModalCreate(true)}>
                    <Plus /> Add User
                </Button>
            </div>

            {/* Table Section */}
            <div className="w-full min-h-5/6 shadow-md shadow-accent border-accent border rounded-lg px-5 py-5 space-y-7">
                {/* Search Input */}
                <SearchInputGroup
                    options={[
                        { value: "name", label: "Name" },
                        { value: "phone", label: "Phone" },
                    ]}
                    className="rounded-md"
                />


                {/* Table */}
                <div>
                    {selectedUser.length > 0 ? (
                        <div className="flex w-full py-4 px-10 rounded-t-lg bg-orange-100 justify-between items-center">
                            <Text variant='h5' className='text-orange-500'>Selected {selectedUser.length} {selectedUser.length > 1 ? "users" : "user"}</Text>
                            {selectedUser.length > 1 && (
                                <Button size="sm" variant={"outline"}>
                                    <PiTrashDuotone /> Delete All
                                </Button>
                            )}
                        </div>
                    ) : ""}
                    <Tables columns={columnsUserList} data={users} />
                    <div className="flex justify-between items-center p-4 border-slate-100 border-t-[2px]">
                        {/* Pagination Info */}
                        <PaginationInfo
                            displayed={limit}
                            total={users.length ?? 0}
                            onChangeDisplayed={setLimit}
                            className=""
                        />
                        {/* Pagination */}
                        <TablePagination
                            {...{ limit, page }}
                            onPageChange={setPage}
                            totalItems={users.length ?? 0}
                        />
                    </div>
                </div>
            </div>

            {/* Modals */}
            {memoModalCreate}
            {memoModalEdit}
            {memoModalDelete}
        </div>
    );
}

export default UserList;
