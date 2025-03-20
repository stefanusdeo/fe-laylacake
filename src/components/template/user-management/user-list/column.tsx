import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Outlet, User, UserOutlet } from "@/types/userTypes";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

export const columnsUserList: Column<User>[] = [
    {
        label: "No",
        renderCell: () => null,
        className: cn("text-center justify-center"),
    },
    {
        label: "Name",
        renderCell: (row) => <p>{row.name}</p>,
        className: "",
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
        renderCell: ({ outlets }) => <p>{outlets.map((val: UserOutlet) => val.outlet.alamat).join(" ; ")}</p>,
        // className: "",
    },
    {
        label: "",
        renderCell: (row) => (
            <Button
                variant={"ghost"}
                size={"icon"}
            >
                <PiDotsThreeOutlineVerticalFill />
            </Button>
        ),
    },
];
