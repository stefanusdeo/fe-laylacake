import PaginationInfo from '@/components/atoms/Table/TableInfo'
import TablePagination from '@/components/atoms/Table/TablePagination'
import Tables from '@/components/atoms/Table/Tables'
import Breadcrums from '@/components/molecules/breadcrums'
import ButtonAction from '@/components/molecules/buttonAction'
import ModalDelete from '@/components/molecules/modal/ModalDelete'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { SearchInputGroup } from '@/components/ui/searchInput'
import Text from '@/components/ui/text'
import { cn, useDebounce } from "@/lib/utils"
import { deleteAllUsers, deleteUser, getListUsers } from '@/store/action/user-management'
import { useUserStore } from '@/store/hooks/useUsers'
import { IParamUsers, User, UserOutlet } from '@/types/userTypes'
import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { PiTrashDuotone } from 'react-icons/pi'
import BeatLoader from 'react-spinners/BeatLoader'
import ModalCreateUser from './modal/modalCreate'
import ModalUpdateUser from './modal/modalUpdate'
import { toast } from 'sonner'

function UserList() {
    const { users } = useUserStore()

    const [userlist, setUserList] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchInput, setSearchInput] = useState("")
    const [filter, setFilter] = useState("")

    const [loading, setLoading] = useState(false);

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [openModalMultiUser, setOpenModalMultiUser] = useState(false);

    const [userId, setUserId] = useState<number | null>(null)
    const [userName, setUserName] = useState("")
    const [selectedUser, setSelectedUser] = useState<number[]>([]); // hanya array of number

    const search = useDebounce(searchInput, 600)
    const [isPending, startTransition] = useTransition()

    const getUsersList = async () => {
        setLoading(true)
        const params: IParamUsers = { page, limit, search, filter }
        const res = await getListUsers(params).finally(() => setLoading(false))
        if (res?.pagination) {
            if (res?.pagination.total_page === 1) {
                setPage(1)
            }
        }
        setUserList(res?.data || [])

    };

    useEffect(() => {
        startTransition(() => {
            if (openModalCreate || openModalEdit || openModalDelete) return;
            getUsersList()
        })
    }, [page, limit, search, openModalDelete, openModalEdit, openModalCreate])

    const handleSearch = (value: string, filter: string) => {
        setSearchInput(value)
        setFilter(filter)
    }

    const handleChecked = (id: number) => {
        setSelectedUser((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((val) => val !== id) : [...prevSelected, id],
        )
    };

    const handleSelectAll = () => {
        if (selectedUser.length === users?.pagination.total_records && userlist.length > 0) {
            setSelectedUser([])
        } else {
            try {
                startTransition(async () => {
                    const res = await getListUsers({ page: 0, limit: 0 })
                    const allUsers = res?.data || []
                    setSelectedUser(allUsers.map((value: User) => value.id))
                })
            } catch (error) {
                toast.error("Failed select all: missing data users")
            }
        }
    };

    const handleOpenModalDelete = (id: number, name: string) => {
        if (id && name) {
            setUserId(id)
            setUserName(name)
            setOpenModalDelete(true)
        }
    }

    const hadleCloseModalDelete = () => {
        setOpenModalDelete(false)
        setUserId(null)
        setUserName("")
    }

    const handleMultiDelete = async () => {
        const resp = new Promise((reslove, rejects) => {
            const typeDel = selectedUser.length === users?.pagination.total_records ? "all" : "partial"
            deleteAllUsers(selectedUser, typeDel)
                .then((res: any) => {
                    if (res?.status === 200) {
                        reslove(res)
                        getUsersList()
                        setSelectedUser([])
                        setOpenModalMultiUser(false)
                    } else {
                        rejects(res)
                    }
                })
        })
        toast.promise(resp, {
            loading: "Deleting users...",
            success: "Users deleted successfully",
            error: (err: any) => `Failed to delete outlets: ${err?.message || 'Please try again'}`
        })
    }

    const handleDeleteSpesific = async () => {
        if (!userId) {
            toast.error("Failed delete: missing id outlet")
            return
        }
        const resp = new Promise((reslove, rejects) => {
            deleteUser(userId).then((res: any) => {
                if (res?.status === 200) {
                    reslove(res)
                    getUsersList()
                    if (selectedUser.includes(userId)) setSelectedUser((prevSelected) => prevSelected.filter((val) => val !== userId))
                    hadleCloseModalDelete()
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

    const columnsUserList: Column<User>[] = [
        {
            label: (
                <Checkbox
                    className='size-5 mt-1 data-[state=unchecked]:bg-white border-border'
                    checked={selectedUser.length === users?.pagination.total_records && userlist.length > 0}
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
            renderCell: (row) => <p>{row.role_name}</p>,
            className: "",
        },
        {
            label: "Email",
            renderCell: (row) => <p>{row.email}</p>,
            className: "",
        },
        {
            label: "Phone",
            renderCell: (row) => <p>{row.phone_number}</p>,
            className: "",
        },
        {
            label: "Outlets",
            renderCell: ({ outlets }) => (
                <p>{outlets.map((val: UserOutlet) => val.name).join(" ; ")}</p>
            ),
        },
        {
            label: "",
            renderCell: ({ id, name }) => (
                <ButtonAction
                    onDelete={() => handleOpenModalDelete(id, name)}
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
                    description={<span>Are you sure want to delete user <b>{userName}</b>?</span>}
                    onConfirm={handleDeleteSpesific}
                    onCancel={hadleCloseModalDelete}
                />
            );
        }
    }, [openModalDelete]);

    const memoModalDeleteMultiUser = useMemo(() => {
        if (openModalMultiUser) {
            return (
                <ModalDelete
                    open={openModalMultiUser}
                    onClose={setOpenModalMultiUser}
                    title="Delete Confirmation"
                    description={<span>Are you sure you want to delete <b>{selectedUser.length + " Outlets"}</b>? This action cannot be undone.</span>}
                    onConfirm={handleMultiDelete}
                    onCancel={() => setOpenModalMultiUser(false)}
                />
            );
        }
    }, [openModalMultiUser]);

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
                        { value: "email", label: "Email" },
                    ]}
                    className="rounded-md"
                    onSearch={handleSearch}
                />

                {loading ? (
                    <div className='flex justify-center items-center h-full gap-4'>
                        <BeatLoader color="#010101" size={8} />
                    </div>
                ) : (
                    <div>
                        {selectedUser.length > 0 ? (
                            <div className="flex w-full py-4 px-10 rounded-t-lg bg-orange-100 justify-between items-center">
                                <Text variant='h5' className='text-orange-500'>Selected {selectedUser.length} {selectedUser.length > 1 ? "users" : "user"}</Text>
                                {selectedUser.length > 1 && (
                                    <Button size="sm" variant={"outline"} onClick={() => setOpenModalMultiUser(true)}>
                                        <PiTrashDuotone /> Delete All
                                    </Button>
                                )}
                            </div>
                        ) : ""}
                        <Tables columns={columnsUserList} data={userlist} />
                        <div className="flex justify-between items-center p-4 border-slate-100 border-t-[2px]">
                            {/* Pagination Info */}
                            <PaginationInfo
                                displayed={limit}
                                total={users?.pagination.total_records ?? 0}
                                onChangeDisplayed={setLimit}
                                className=""
                            />
                            {/* Pagination */}
                            <TablePagination
                                {...{ limit, page }}
                                onPageChange={setPage}
                                totalItems={users?.pagination.total_records ?? 0}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {memoModalCreate}
            {memoModalEdit}
            {memoModalDelete}
            {memoModalDeleteMultiUser}
        </div>
    );
}

export default UserList;
