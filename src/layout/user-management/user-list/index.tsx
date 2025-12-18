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
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState, useTransition } from 'react'
import { AiOutlineUserDelete } from 'react-icons/ai'
import { PiTrashDuotone } from 'react-icons/pi'
import { TbUserEdit } from 'react-icons/tb'
import ClipLoader from 'react-spinners/ClipLoader'
import { toast } from 'sonner'

function UserList() {
    const { users, setIdUser, id_user } = useUserStore()
    const router = useRouter()

    const [userlist, setUserList] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchInput, setSearchInput] = useState("")
    const [filter, setFilter] = useState("")

    const [loading, setLoading] = useState(false);

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
            if (openModalDelete || openModalMultiUser ) return;
            getUsersList()
        })
    }, [page, limit, search, openModalDelete, openModalMultiUser])

    useEffect(() => {
        if (search || openModalDelete === false || openModalMultiUser === false) {
            setPage(1)
            setSelectedUser([])
        }
    }, [search, openModalDelete, openModalMultiUser])

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
            toast.error("Failed delete: missing id user")
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
            loading: "Deleting User...",
            success: "User deleted successfully",
            error: (err: any) => `Failed to delete user: ${err?.message || 'Please try again'}`
        })
    }

    const handleGetRouteEdit = (id: number) => {
        setIdUser(id)
        if (id) {
            router.push(`/user-management/edit-user`)
        } else {
            toast.error("Failed get route edit: missing users")
        }
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
                    iconsEdit={<TbUserEdit />}
                    iconsDelete={<AiOutlineUserDelete />}
                    onDelete={() => handleOpenModalDelete(id, name)}
                    onEdit={() => handleGetRouteEdit(id)}
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

    return (
        <div className="flex flex-col gap-5 md:gap-7">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-5 select-none">
                <div className="flex flex-col gap-3">
                    <Text variant="h2" className=' max-sm:text-2xl'>User List</Text>
                    <Breadcrums />
                </div>
                <Button size="lg" className='text-sm md:text-base max-sm:w-full' onClick={() => router.push("/user-management/create-user")}>
                    <Plus className='text-sm md:text-base' /> <span>Add User</span>
                </Button>
            </div>
            {/* Table Section */}
            <div className="w-full min-h-5/6 shadow-md shadow-accent border-accent border rounded-lg p-2.5 md:p-5 space-y-7">
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
                    <Text variant="span" className="flex items-center justify-center gap-2 py-3 px-4">
                        <ClipLoader loading={loading} size={15} /> Getting users list...
                    </Text>
                ) : (
                    <div>
                        {selectedUser.length > 0 ? (
                            <div className="flex w-full py-4 px-10 rounded-t-lg bg-green-100 justify-between items-center">
                                <Text variant='h5' className='text-green-600'>Selected {selectedUser.length} {selectedUser.length > 1 ? "users" : "user"}</Text>
                                {selectedUser.length > 1 && (
                                    <Button size="sm" variant={"outline"} onClick={() => setOpenModalMultiUser(true)}>
                                        <PiTrashDuotone /> Delete All
                                    </Button>
                                )}
                            </div>
                        ) : ""}
                        <Tables columns={columnsUserList} data={userlist} />
                        <div className="flex flex-wrap justify-center md:justify-between items-center gap-2.5 p-2.5 md:p-4 border-slate-100 border-t-[2px]">
                            {/* Pagination Info */}
                            <PaginationInfo
                                displayed={limit}
                                total={users?.pagination.total_records ?? 0}
                                onChangeDisplayed={setLimit}
                                className="w-auto"
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
            {memoModalDelete}
            {memoModalDeleteMultiUser}
        </div>
    );
}

export default UserList;
