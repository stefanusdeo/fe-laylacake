"use client";
import { CustomSelect, SelectOption } from '@/components/atoms/Selects';
import PaginationInfo from '@/components/atoms/Table/TableInfo';
import TablePagination from '@/components/atoms/Table/TablePagination';
import Tables from '@/components/atoms/Table/Tables';
import ButtonAction from '@/components/molecules/buttonAction';
import { CustomCalendar } from '@/components/molecules/customCalendar';
import ModalDelete from '@/components/molecules/modal/ModalDelete';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Text from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { getOutletsInternal } from '@/store/action/outlets';
import { getPaymentInternal } from '@/store/action/payment-method';
import { deleteMultiTrx, delTransaction, getListTransactions } from '@/store/action/transactions';
import { useOutletStore } from '@/store/hooks/useOutlets';
import { usePaymentStore } from '@/store/hooks/usePayment';
import { useTransactionStore } from '@/store/hooks/useTransactions';
import { OutletData } from '@/types/outletTypes';
import { PaymentMethodData } from '@/types/paymentTypes';
import { IDeleteMultiTransaction, IParamTransaction, TTransactionData } from '@/types/transactionTypes';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { DateRange } from 'react-day-picker';
import { MdOutlineClear } from 'react-icons/md';
import { PiTrashDuotone } from 'react-icons/pi';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'sonner';
import ModalMigrate from './modal/migrate';
import Cookie from "js-cookie"
import { useProfileStore } from '@/store/hooks/useProfile';
import { TbListDetails } from 'react-icons/tb';

export default function Transactions() {
  const { profile } = useProfileStore()
  const router = useRouter()

  const roleUser = Cookie.get('role') ?? profile?.role_name

  const { outletInternal } = useOutletStore()
  const { paymentInternal } = usePaymentStore()
  const { transactions, setIdTransaction } = useTransactionStore()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(false)

  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalMultiTrx, setOpenModalMultiTrx] = useState(false);
  const [openModalMigrate, setOpenModalMigrate] = useState(false);

  const [trxlist, setTrxlist] = useState<TTransactionData[]>([])
  const [selectedTrx, setSelectedTrx] = useState<number[]>([])
  const [trxId, setTrxId] = useState<number | null>(null)
  const [trxCode, setTrxCode] = useState<string | null>(null)

  const [isPending, startTransition] = useTransition()

  const [dateRange, setDateRange] = useState<DateRange | any>("")
  const isDateRangeComplete = dateRange?.from && dateRange?.to

  const [outletSelect, setOutletSelect] = useState<string>("")
  const [outletOptions, setOutletOptions] = useState<SelectOption[]>(outletInternal?.data?.map((item: OutletData) => ({ value: item.id.toString(), label: item.name })) ?? [])
  const [isLoadingOutlet, setIsLoadingOutlet] = useState(false)

  const [methodSelect, setMethodSelect] = useState<string>("")
  const [methodOptions, setMethodOptions] = useState<SelectOption[]>(paymentInternal?.data?.map((item: PaymentMethodData) => ({ value: item.id.toString(), label: item.name })) ?? [])
  const [isLoadingMethod, setIsLoadingMethod] = useState(false)

  const fetchOutlet = async () => {
    setIsLoadingOutlet(true)
    try {
      const res = await getOutletsInternal({ page: 0, limit: 0 })
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
    if (outletInternal?.data?.length === 0 || !outletInternal?.data || outletOptions.length === 0 || !outletOptions) {
      fetchOutlet()
    }

    if (paymentInternal?.data?.length === 0 || !paymentInternal?.data || methodOptions.length === 0 || !methodOptions) {
      fetchMethod()
    }
  }, [])

  // fetch data transactions
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      fetchTransactions(dateRange?.from?.toISOString(), dateRange?.to?.toISOString())
      return
    } else if (openModalMigrate === false) {
      fetchTransactions()
    }
  }, [page, limit, isDateRangeComplete, outletSelect, methodSelect, openModalMigrate])

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
    if (id) {
      router.push(`/transaction/detail`)
    } else {
      toast.error("Failed get route edit: missing transactions")
    }
  }

  const handleResetFilter = () => {
    setDateRange(undefined)
    setOutletSelect("")
    setMethodSelect("")
  }

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
      label: "No",
      renderCell: () => null,
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
      renderCell: (row) => <p>{row.price}</p>,
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
          {isDateRangeComplete || outletSelect || methodSelect ? (
            <Button size={"default"} variant={"outline"} onClick={handleResetFilter} className='max-sm:w-full'><MdOutlineClear /> <span className='md:hidden block'>Clear</span></Button>
          ) : null}
        </div>
        {roleUser && roleUser !== "Kasir" && (
          <Button onClick={() => setOpenModalMigrate(true)} className='max-sm:w-full'><Plus /> <span className=''>Add Transaction</span></Button>
        )}
      </div>
      <div id='table'>
        {loading ? (
          <Text variant="span" className="flex items-center justify-center gap-2 py-3 px-4">
            <ClipLoader loading={loading} size={15} /> Getting transaction list...
          </Text>
        ) : (
          <div>
            {selectedTrx.length > 0 ? (
              <div className="flex w-full py-4 px-10 rounded-t-lg bg-orange-100 justify-between items-center">
                <Text variant='h5' className='text-orange-500'>Selected {selectedTrx.length} {selectedTrx.length > 1 ? "transactions" : "transaction"}</Text>
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
      {memoModalDelete}
      {memoModalMultiTrx}
    </div>
  )
}
