export interface MenuItem {
  title: string;
  href: string;
  permission: string[];
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const listMenu: MenuSection[] = [
  {
    title: "User Management",
    items: [
      {
        title: "User List",
        href: "/user-list",
        permission: ["admin", "superadmin"],
      },
      {
        title: "Absensi",
        href: "/absensi",
        permission: ["admin", "superadmin"],
      },
      {
        title: "Member",
        href: "/member",
        permission: ["admin", "superadmin"],
      },
    ],
  },
  {
    title: "Master Data",
    items: [
      {
        title: "Kategori",
        href: "/kategori",
        permission: ["admin", "superadmin"],
      },
      {
        title: "Produk",
        href: "/produk",
        permission: ["admin", "superadmin"],
      },
      {
        title: "Pembelian",
        href: "/pembelian",
        permission: ["admin", "superadmin"],
      },
      {
        title: "Penjualan",
        href: "/penjualan",
        permission: ["admin", "superadmin"],
      },
    ],
  },
  {
    title: "Laporan",
    items: [
      {
        title: "Laporan Penjualan",
        href: "/laporan-penjualan",
        permission: ["admin", "superadmin"],
      },
    ],
  },
  {
    title:"Toko",
    items:[
      {
        title:"Toko",
        href:"/toko",
        permission:["admin","superadmin"]
      }
    ]
  },
  {
    title:"Pengaturan",
    items:[
      {
        title:"Role",
        href:"/role",
        permission:["admin","superadmin"]
      },
      {
        title:"Permission",
        href:"/permission",
        permission:["admin","superadmin"]
      },
      {
        title:"Profile",
        href:"/profile",
        permission:["admin","superadmin"]
      }
    ]
  }
];
