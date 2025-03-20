type Column<T> = {
  label: string;
  renderCell: (row: T) => React.ReactNode;
  className?: string;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  className?: string;
  currentPage?: number;
  itemsPerPage?: number;
};
