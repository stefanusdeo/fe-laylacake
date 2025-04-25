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
    title: "Transaction",
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
        title: "Cashier",
        href: "/cashier",
        permission: ["Kasir"],
        show: true,
      },
      {
        title: "Payment Method",
        href: "/payment-method",
        permission: ["Super Admin"],
        show: true,
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
        permission: ["Super Admin"],
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
];

// utils/sidebar.ts

export function getFilteredMenu(profileRole: string | undefined): MenuSection[] {
  if (!profileRole) return [];

  return listMenu
    .map((section) => {
      const filteredItems = section.items.filter(
        (item) => item.permission.includes(profileRole) && item.show
      );

      if (filteredItems.length === 0) return null;

      return {
        ...section,
        show: true,
        items: filteredItems,
      };
    })
    .filter(Boolean) as MenuSection[];
}
