"use client";
import { CustomSelect, SelectOption } from '@/components/atoms/Selects';
import PaginationInfo from '@/components/atoms/Table/TableInfo';
import TablePagination from '@/components/atoms/Table/TablePagination';
import Tables from '@/components/atoms/Table/Tables';
import Breadcrums from '@/components/molecules/breadcrums';
import ButtonAction from '@/components/molecules/buttonAction';
import { CustomCalendar } from '@/components/molecules/customCalendar';
import ModalDelete from '@/components/molecules/modal/ModalDelete';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Text from '@/components/ui/text';
import { cn, formatCurrency } from '@/lib/utils';
import { getPaymentInternal } from '@/store/action/payment-method';
import { checkMigration, deleteMultiTrx, delTransaction, getListTransactions } from '@/store/action/transactions';
import { getAccessOutlet } from '@/store/action/user-management';
import { useOutletStore } from '@/store/hooks/useOutlets';
import { usePaymentStore } from '@/store/hooks/usePayment';
import { useProfileStore } from '@/store/hooks/useProfile';
import { useTransactionStore } from '@/store/hooks/useTransactions';
import { useUserStore } from '@/store/hooks/useUsers';
import { OutletData } from '@/types/outletTypes';
import { PaymentMethodData } from '@/types/paymentTypes';
import { IDeleteMultiTransaction, IParamTransaction, TTransactionData } from '@/types/transactionTypes';
import Cookie from "js-cookie";
import { FileDown, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { DateRange } from 'react-day-picker';
import { MdOutlineClear } from 'react-icons/md';
import { PiTrashDuotone } from 'react-icons/pi';
import { TbListDetails } from 'react-icons/tb';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'sonner';
import ModalDetail from './modal/detail';
import ModalMigrate from './modal/migrate';

export default function Transactions() {
  const router = useRouter()
  const { profile } = useProfileStore()
  const { statusMigration } = useTransactionStore()

  const roleUser = Cookie.get('role') ?? profile?.role_name

  const { outletInternal } = useOutletStore()
  const { paymentInternal } = usePaymentStore()
  const { myOutlet } = useUserStore()
  const { transactions, setIdTransaction } = useTransactionStore()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(false)

  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalMultiTrx, setOpenModalMultiTrx] = useState(false);
  const [openModalMigrate, setOpenModalMigrate] = useState(false);
  const [openModalDetail, setOpenModalDetail] = useState(false);

  const [trxlist, setTrxlist] = useState<TTransactionData[]>([])
  const [selectedTrx, setSelectedTrx] = useState<number[]>([])
  const [trxId, setTrxId] = useState<number | null>(null)
  const [trxCode, setTrxCode] = useState<string | null>(null)

  const [isPending, startTransition] = useTransition()

  const [dateRange, setDateRange] = useState<DateRange | any>("")
  const isDateRangeComplete = dateRange?.from && dateRange?.to

  const [outletSelect, setOutletSelect] = useState<string>("")
  const [outletOptions, setOutletOptions] = useState<SelectOption[]>(myOutlet?.map((item: OutletData) => ({ value: item.id.toString(), label: item.name })) ?? [])
  const [isLoadingOutlet, setIsLoadingOutlet] = useState(false)

  const [methodSelect, setMethodSelect] = useState<string>("")
  const [methodOptions, setMethodOptions] = useState<SelectOption[]>(paymentInternal?.data?.map((item: PaymentMethodData) => ({ value: item.id.toString(), label: item.name })) ?? [])
  const [isLoadingMethod, setIsLoadingMethod] = useState(false)

  const [typeOptions, setTypeOptions] = useState<SelectOption[]>([
    { value: "0", label: "All Transactions" },
    { value: "1", label: "Basic Transactions" },
    { value: "2", label: "Manual Transactions" },]
  )
  const [typeSelect, setTypeSelect] = useState<string>("0")


  const fetchOutlet = async () => {
    setIsLoadingOutlet(true)
    try {
      const res = await getAccessOutlet()
      setOutletOptions(res.data.map((item: OutletData) => ({ value: item.id.toString(), label: item.name })))
      setIsLoadingOutlet(false)
    }
    catch (err) {
      setIsLoadingOutlet(false)
    }
  }

  const fetchMethod = async () => {
    setIsLoadingMethod(true)
    try {
      const res = await getPaymentInternal({ page: 0, limit: 0 })
      setMethodOptions(res.data.map((item: PaymentMethodData) => ({ value: item.id.toString(), label: item.name })))
      setIsLoadingMethod(false)
    } catch (err) {
      setIsLoadingMethod(false)
    }
  }

  const fetchTransactions = async (start_date?: string, end_date?: string) => {
    setLoading(true)
    const params: IParamTransaction = {
      page,
      limit,
    }

    if (dateRange?.from && dateRange?.to) {
      params.start_date = start_date
      params.end_date = end_date
    }

    if (outletSelect) {
      params.outlet_id = Number(outletSelect)
    }

    if (methodSelect) {
      params.payment_method = methodSelect
    }

    if (typeSelect !== "0") {
      params.type = typeSelect
    }

    const res = await getListTransactions(params).finally(() => setLoading(false))
    if (res?.pagination) {
      if (res?.pagination.total_page === 1) {
        setPage(1)
      }
    }
    setTrxlist(res?.data || [])

  };

  // fetch data filter
  useEffect(() => {
    if (myOutlet?.length === 0 || !myOutlet || outletOptions.length === 0 || !outletOptions) {
      fetchOutlet()
    }

    if (paymentInternal?.data?.length === 0 || !paymentInternal?.data || methodOptions.length === 0 || !methodOptions) {
      fetchMethod()
    }
  }, [])

  // fetch data transactions
  useEffect(() => {
    if (openModalMigrate === false) {
      fetchTransactions()
    }
  }, [page, limit, isDateRangeComplete, outletSelect, methodSelect, typeSelect, openModalMigrate])

  useEffect(() => {
    if (isDateRangeComplete || methodSelect || outletSelect || limit || typeSelect || openModalMigrate === false) {
      setPage(1)
      setSelectedTrx([])
    }
  }, [isDateRangeComplete, methodSelect, outletSelect, typeSelect, limit, openModalMigrate])

  const handleChecked = (id: number) => {
    setSelectedTrx((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((val) => val !== id) : [...prevSelected, id],
    )
  };

  const handleSelectAll = () => {
    if (selectedTrx.length === transactions?.pagination.total_records && trxlist.length > 0) {
      setSelectedTrx([])
    } else {
      try {
        const params: IParamTransaction = {
          page: 0,
          limit: 0,
        }

        if (dateRange?.from && dateRange?.to) {
          params.start_date = dateRange?.from?.toISOString()
          params.end_date = dateRange?.to?.toISOString()
        }

        if (outletSelect) {
          params.outlet_id = Number(outletSelect)
        }

        if (methodSelect) {
          params.payment_method = methodSelect
        }

        if (typeSelect !== "0") {
          params.type = typeSelect
        }

        startTransition(async () => {
          const res = await getListTransactions(params)
          const allTransactions = res?.data || []
          setSelectedTrx(allTransactions.map((value: TTransactionData) => value.id))
        })
      } catch (error) {
        toast.error("Failed select all: missing data transactions")
      }
    }
  };

  const handleOpenModalDelete = (id: number, code: string) => {
    if (id && code) {
      setTrxId(id)
      setTrxCode(code)
      setOpenModalDelete(true)
    }
  }

  const hadleCloseModalDelete = () => {
    setOpenModalDelete(false)
    setTrxId(null)
    setTrxCode("")
  }

  const handleDeleteSpesific = async () => {
    if (!trxId) {
      toast.error("Failed delete: missing id transactions")
      return
    }
    const resp = new Promise((reslove, rejects) => {
      delTransaction(trxId).then((res: any) => {
        if (res?.status === 200) {
          reslove(res)
          fetchTransactions()
          if (selectedTrx.includes(trxId)) setSelectedTrx((prevSelected) => prevSelected.filter((val) => val !== trxId))
          hadleCloseModalDelete()
        } else {
          rejects(res)
        }
      })
    })
    toast.promise(resp, {
      loading: "Deleting transaction...",
      success: "Transaction deleted successfully.",
      error: (err: any) => `Failed to delete transaction: ${err?.message || 'Please try again'}`
    })
  }

  const handleMultiDelete = async () => {
    const resp = new Promise((reslove, rejects) => {
      const typeDel = selectedTrx.length === trxlist.length ? "all" : "partial"

      const requestBody: IDeleteMultiTransaction = {
        type: typeDel,
        trx_ids: selectedTrx,
        filters: {
          start_date: dateRange?.from?.toISOString(),
          end_date: dateRange?.to?.toISOString(),
          outlet_id: Number(outletSelect),
          payment_method: Number(methodSelect),
        }
      }

      if (typeDel === "all") {
        delete requestBody.trx_ids
      }

      deleteMultiTrx(requestBody)
        .then((res: any) => {
          if (res?.status === 200) {
            reslove(res)
            fetchTransactions()
            setSelectedTrx([])
            setOpenModalMultiTrx(false)
          } else {
            rejects(res)
          }
        })
    })
    toast.promise(resp, {
      loading: "Deleting transactions...",
      success: "Transactions deleted successfully",
      error: (err: any) => `Failed to delete transactions: ${err?.message || 'Please try again'}`
    })
  }

  const handleGetRouteDetail = (id: number) => {
    setIdTransaction(id)
    setOpenModalDetail(true)
  }

  const handleResetFilter = () => {
    setDateRange(undefined)
    setOutletSelect("")
    setMethodSelect("")
    setTypeSelect("0")
  }

  const checkMigrationStatus = () => {
    const intervalCheking = setInterval(async () => {
      const checkResult = await checkMigration();
      if (checkResult?.status === 200) {
        if (isDateRangeComplete) {
          fetchTransactions(dateRange?.from?.toISOString(), dateRange?.to?.toISOString())
        } else {
          fetchTransactions()
        }
        clearInterval(intervalCheking);
        localStorage.removeItem("tiketId");
        toast.success("Transfer is completed.");
      } else if (checkResult?.status === 102) {
        toast.info(checkResult?.message || "Transfer is still in progress. Please wait.");
      } else {
        localStorage.removeItem("tiketId");
        toast.error("Failed to check transfer status. Please try again.");
        clearInterval(intervalCheking);
      }
    }, 1000);
  };

  const handleExportExcel = async () => {
    setLoading(true)
    try {
      const params: IParamTransaction = {
        page: 0,
        limit: 0,
      }

      if (dateRange?.from && dateRange?.to) {
        params.start_date = dateRange?.from?.toISOString()
        params.end_date = dateRange?.to?.toISOString()
      }

      if (outletSelect) {
        params.outlet_id = Number(outletSelect)
      }

      if (methodSelect) {
        params.payment_method = methodSelect
      }

      if (typeSelect !== "0") {
        params.type = typeSelect
      }

      const res = await getListTransactions(params)
      const allTransactions = res?.data || []

      if (allTransactions.length === 0) {
        toast.warning("No transaction data to export")
        setLoading(false)
        return
      }

      // Membuat workbook dan worksheet
      const XLSX = await import('xlsx')
      const workbook = XLSX.utils.book_new()

      // Menyiapkan data untuk Excel
      const excelData = allTransactions.map((trx: TTransactionData) => ({
        'Code': trx.code,
        'Outlet': trx.outlet_name,
        'Staff': trx.staff_name,
        'Amount': trx.price,
        'Payment Method': trx.payment_method,
        'Date Time': trx.time
      }))

      // Membuat worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData)

      // Menambahkan worksheet ke workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions')

      // Membuat nama file dengan timestamp
      const fileName = `trx_${new Date().toISOString().split('T')[0]}.xlsx`

      // Mengekspor file Excel
      XLSX.writeFile(workbook, fileName)

      toast.success("Transaction data successfully exported to Excel")
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      toast.error("Failed to export transaction data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (statusMigration) {
      checkMigrationStatus()
    }
  }, [statusMigration])

  const columnsTrxList: Column<TTransactionData>[] = [
    {
      label: roleUser && roleUser !== "Kasir" ? (
        <Checkbox
          className='size-5 mt-1 data-[state=unchecked]:bg-white border-border'
          checked={selectedTrx.length === transactions?.pagination.total_records && trxlist.length > 0}
          onCheckedChange={isDateRangeComplete || selectedTrx.length === transactions?.pagination.total_records ? handleSelectAll : () => toast.warning("Please select date range to select all", { duration: 3000 })}
        />
      ) : "",
      renderCell: ({ id }) => (
        <div>
          {roleUser && roleUser !== "Kasir" && (
            <Checkbox
              className='size-5 mt-1 border-border'
              value={id}
              checked={selectedTrx.includes(id)}
              onCheckedChange={() => handleChecked(id)}
            />
          )}
        </div>
      ),
      className: cn("text-center justify-center"),
    },
    {
      label: "Code",
      renderCell: (row) => <p>{row.code}</p>,
      className: "w-fit text-left",
    },
    {
      label: "Outlet",
      renderCell: (row) => <p>{row.outlet_name}</p>,
      className: "",
    },
    {
      label: "Staff",
      renderCell: (row) => <p>{row.staff_name}</p>,
      className: "",
    },
    {
      label: "Amount",
      renderCell: (row) => <p>{formatCurrency(row.price)}</p>,
      className: "",
    },
    {
      label: "Payment Method",
      renderCell: (row) => (
        <p>{row.payment_method}</p>
      ),
    },
    {
      label: "Date Time",
      renderCell: (row) => (
        <p>{row.time}</p>
      ),
    },
    {
      label: "",
      renderCell: ({ id, code }) => (
        <div>
          {roleUser && roleUser !== "Kasir" ? (
            <ButtonAction
              onDelete={() => handleOpenModalDelete(id, code)}
              onDetail={() => handleGetRouteDetail(id)}
            />
          ) : <Button size={"sm"} variant={"outline"} onClick={() => handleGetRouteDetail(id)}><TbListDetails /> Detail</Button>}
        </div>
      ),
    },
  ];

  const memoModalMigrate = useMemo(() => {
    if (openModalMigrate) {
      return <ModalMigrate onClose={setOpenModalMigrate} open={openModalMigrate} />
    }
  }, [openModalMigrate])

  const memoModalDetail = useMemo(() => {
    if (openModalDetail) {
      return <ModalDetail onClose={setOpenModalDetail} open={openModalDetail} />
    }
  }, [openModalDetail])

  const memoModalDelete = useMemo(() => {
    if (openModalDelete) {
      return (
        <ModalDelete
          open={openModalDelete}
          onClose={setOpenModalDelete}
          title="Delete Transaction"
          description={<span>Are you sure you want to delete the transaction with code <b>{trxCode}</b>?</span>}
          onConfirm={handleDeleteSpesific}
          onCancel={hadleCloseModalDelete}
        />
      );
    }
  }, [openModalDelete]);

  const memoModalMultiTrx = useMemo(() => {
    if (openModalMultiTrx) {
      return (
        <ModalDelete
          open={openModalMultiTrx}
          onClose={setOpenModalMultiTrx}
          title="Delete Confirmation"
          description={<span>Are you sure you want to delete <b>{selectedTrx.length + " Transactions"}</b>? This action cannot be undone.</span>}
          onConfirm={handleMultiDelete}
          onCancel={() => setOpenModalMultiTrx(false)}
        />
      );
    }
  }, [openModalMultiTrx])

  return (
    <div className='flex flex-col gap-5 md:gap-7'>
      <div className="flex flex-wrap justify-between items-center gap-5 select-none">
        <div className="flex flex-col gap-3">
          <Text variant='h2' className=' max-sm:text-2xl'>Transaction List</Text>
          <Breadcrums />
        </div>
        <div className="flex gap-2 max-sm:w-full">
          <Button
            onClick={handleExportExcel}
            variant="outline"
            className='max-sm:flex-1'
            disabled={loading}
          >
            <FileDown className="mr-1 h-4 w-4" />
            <span className=''>Export Excel</span>
          </Button>
          {roleUser && roleUser === "Super Admin" && (
            <Button onClick={() => setOpenModalMigrate(true)} className='max-sm:flex-1'>
              <Plus className="mr-1 h-4 w-4" />
              <span className=''>Add Transaction</span>
            </Button>
          )}
        </div>
      </div>
      <div className="w-full min-h-5/6 shadow-md shadow-accent border-accent border rounded-lg p-2.5 md:px-5 md:py-5 space-y-7">
        <div id='filter' className="flex max-sm:flex-col md:justify-between items-start gap-2.5 md:gap-5 select-none">
          <div className='w-full flex flex-wrap gap-2.5 items-center'>
            <CustomCalendar
              mode="range"
              placeholder="Chose a date range"
              onDateChange={(range) => setDateRange(range as DateRange)}
              defaultValue={dateRange}
              className=' max-sm:w-full '
            />
            <CustomSelect
              options={outletOptions}
              label="Outlet"
              placeholder={outletOptions.length > 0 ? "Select a outlet" : "No data available"}
              isLoading={isLoadingOutlet}
              value={outletSelect}
              onChange={setOutletSelect}
              className='!h-10 max-sm:w-full'
            />
            <CustomSelect
              options={methodOptions}
              label="Method"
              placeholder={methodOptions.length > 0 ? "Select a method" : "No data available"}
              isLoading={isLoadingMethod}
              value={methodSelect}
              onChange={setMethodSelect}
              className='!h-10 max-sm:w-full'
            />
            <CustomSelect
              options={typeOptions}
              label="Type Transaction"
              placeholder={typeOptions.length > 0 ? "Select a type" : "No data available"}
              value={typeSelect}
              onChange={setTypeSelect}
              className='!h-10 max-sm:w-full'
            />
            {isDateRangeComplete || outletSelect || methodSelect ? (
              <Button size={"default"} variant={"outline"} onClick={handleResetFilter} className='max-sm:w-full'><MdOutlineClear /> <span className='md:hidden block'>Clear</span></Button>
            ) : null}
          </div>
        </div>
        <div id='table'>
          {loading ? (
            <Text variant="span" className="flex items-center justify-center gap-2 py-3 px-4">
              <ClipLoader loading={loading} size={15} /> Getting transaction list...
            </Text>
          ) : (
            <div>
              {selectedTrx.length > 0 ? (
                <div className="flex w-full py-4 px-10 rounded-t-lg bg-green-100 justify-between items-center">
                  <Text variant='h5' className='text-green-600'>Selected {selectedTrx.length} {selectedTrx.length > 1 ? "transactions" : "transaction"}</Text>
                  {selectedTrx.length > 1 && (
                    <Button size="sm" variant={"outline"} onClick={() => setOpenModalMultiTrx(true)}>
                      <PiTrashDuotone /> Delete All
                    </Button>
                  )}
                </div>
              ) : ""}
              <Tables columns={columnsTrxList} data={trxlist} />
              <div className="flex flex-wrap justify-center md:justify-between items-center gap-2.5 p-2.5 md:p-4 border-slate-100 border-t-[2px]">
                {/* Pagination Info */}
                <PaginationInfo
                  displayed={limit}
                  total={transactions?.pagination.total_records ?? 0}
                  onChangeDisplayed={setLimit}
                  className="w-auto"
                />
                {/* Pagination */}
                <TablePagination
                  {...{ limit, page }}
                  onPageChange={setPage}
                  totalItems={transactions?.pagination.total_records ?? 0}
                />
              </div>
            </div>
          )}
        </div>
        {memoModalMigrate}
        {memoModalDetail}
        {memoModalDelete}
        {memoModalMultiTrx}
      </div>
    </div>
  )
}
