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
        permission: ["admin", "superadmin"],
        show: true,
      },
      {
        title: "Absensi",
        href: "/user-management/absensi",
        permission: ["admin", "superadmin"],
        show: true,
      },
      {
        title: "Member",
        href: "/user-management/member",
        permission: ["admin", "superadmin"],
        show: true,
      },
    ],
  },
  {
    title: "Master Data",
    show: true,
    items: [
      {
        title: "Kategori",
        href: "/kategori",
        permission: ["admin", "superadmin"],
        show: true,
      },
      {
        title: "Produk",
        href: "/produk",
        permission: ["admin", "superadmin"],
        show: true,
      },
      {
        title: "Pembelian",
        href: "/pembelian",
        permission: ["admin", "superadmin"],
        show: true,
      },
      {
        title: "Penjualan",
        href: "/penjualan",
        permission: ["admin", "superadmin"],
        show: true,
      },
    ],
  },
  {
    title: "Report",
    show: true,
    items: [
      {
        title: "Laporan Penjualan",
        href: "/laporan-penjualan",
        permission: ["admin", "superadmin"],
        show: true,
      },
    ],
  },
  {
    title: "Store",
    show: true,
    items: [
      {
        title: "Toko",
        href: "/toko",
        permission: ["admin", "superadmin"],
        show: true,
      },
    ],
  },
  {
    title: "Pengaturan",
    show: true,
    items: [
      {
        title: "Role",
        href: "/role",
        permission: ["admin", "superadmin"],
        show: true,
      },
      {
        title: "Permission",
        href: "/permission",
        permission: ["admin", "superadmin"],
        show: true,
      },
    ],
  },
  {
    title: "Profile",
    show: false,
    items: [
      {
        title: "Account Settings",
        href: "/account",
        permission: ["admin", "kasir", "superadmin"],
        show: false,
      },
    ],
  },
];
