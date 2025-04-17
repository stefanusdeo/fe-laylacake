export interface MenuItem {
  title: string;
  href: string;
  permission: string[];
  show: boolean;
}

export interface MenuSection {
  title: string;
  show: boolean;
  items: MenuItem[];
}

export const listMenu: MenuSection[] = [
  {
    title: "User Management",
    show: true,
    items: [
      {
        title: "User List",
        href: "/user-management/user-list",
        permission: ["Admin", "Super Admin"],
        show: true,
      },
      {
        title: "Create User",
        href: "/user-management/create-user",
        permission: ["Admin", "Super Admin"],
        show: false,
      },
      {
        title: "Edit User",
        href: "/user-management/edit-user",
        permission: ["Admin", "Super Admin"],
        show: false,
      },
    ],
  },
  {
    title: "Store",
    show: true,
    items: [
      {
        title: "Outlets",
        href: "/store/outlets",
        permission: ["Kasir", "Admin", "Super Admin"],
        show: true,
      },
      {
        title: "Cashier",
        href: "/store/cashier",
        permission: ["Kasir", "Admin", "Super Admin"],
        show: true,
      },
    ],
  },
  {
    title: "Account",
    show: false,
    items: [
      {
        title: "Profile",
        href: "/account",
        permission: ["Kasir", "Admin", "Super Admin"],
        show: false,
      },
    ],
  },
  {
    title: "Transaction management",
    show: true,
    items: [
      {
        title: "Transaction List",
        href: "/transaction",
        permission: ["Kasir", "Admin", "Super Admin"],
        show: true,
      },
      {
        title: "Transaction Detail",
        href: "/transaction/detail",
        permission: ["Kasir", "Admin", "Super Admin"],
        show: false,
      },
      {
        title: "Payment Method",
        href: "/payment-method",
        permission: ["Kasir", "Admin", "Super Admin"],
        show: true,
      },
    ],
  },
];
