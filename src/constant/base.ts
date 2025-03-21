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
    ],
  },
  {
    title: "Store",
    show: true,
    items: [
      {
        title: "Outlets",
        href: "/outlets",
        permission: ["Kasir", "Admin", "Super Admin"],
        show: true,
      },
    ],
  },
];
