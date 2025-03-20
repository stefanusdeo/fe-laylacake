import PaginationInfo from '@/components/atoms/Table/TableInfo'
import TablePagination from '@/components/atoms/Table/TablePagination'
import Tables from '@/components/atoms/Table/Tables'
import Breadcrums from '@/components/molecules/breadcrums'
import { columnsUserList } from '@/components/template/user-list/column'
import { users } from '@/components/template/user-list/data'
import { Button } from '@/components/ui/button'
import { SearchInputGroup } from '@/components/ui/searchInput'
import Text from '@/components/ui/text'
import { Plus } from 'lucide-react'
import { useState } from 'react'

function UserList() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    return (
        <div className='flex flex-col gap-7'>
            <div className='flex justify-between items-center gap-5'>
                <div className='flex flex-col gap-3'>
                    <Text variant='h2'>User List</Text>
                    <Breadcrums />
                </div>
                <Button size={'lg'}><Plus /> Add User</Button>
            </div>
            <div className='w-full min-h-5/6 shadow-md shadow-accent border-accent border rounded-lg px-5 py-5 space-y-7'>
                <SearchInputGroup options={[{ value: "name", label: "Name" }, { value: "phone", label: "Phone" }]} className='rounded-md' />
                <div className=''>
                    <Tables columns={columnsUserList} data={users} />
                    <div className="flex justify-between items-center p-4 border-slate-100 border-t-[2px]">
                        <PaginationInfo
                            displayed={limit}
                            total={users.length ?? 0}
                            onChangeDisplayed={setLimit}
                            className=""
                        />
                        <TablePagination
                            {...{ limit, page }}
                            onPageChange={setPage}
                            totalItems={users.length ?? 0}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserList
