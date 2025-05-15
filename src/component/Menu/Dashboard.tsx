import React, { FC } from "react";
import { extendTheme, styled } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LogoutIcon from "@mui/icons-material/Logout";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { AppProvider, Navigation, Router } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import ReceiptIcon from "@mui/icons-material/Receipt";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import Grid from "@mui/material/Grid2";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import Swal from "sweetalert2";
import Categori from "./Categori";
import Product from "./Product";
import DashboardContent from "./DashboardContent/DashboardContent";
import { Button } from "@mui/material";
import Customer from "./Customer";
import Banner from "./Banner";
import Discount from "./Discount";
import Orders from "./Orders";
import Revenue from "./Revenue";
import Inventory from "./Inventory";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const handleLogOut = () => {
  Swal.fire({
    title: "Bạn có chắc chắn muốn đăng xuất?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Đăng xuất",
    cancelButtonText: "Hủy",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/";
    }
  });
};

const NAVIGATION_ADMIN: Navigation = [
  { kind: "header", title: "Main items" },
  { segment: "dashboard", title: "DASHBOARD", icon: <DashboardIcon /> },
  { segment: "categori", title: "QUẢN LÍ DANH MỤC", icon: <CategoryIcon /> },
  { segment: "banner", title: "BANNER", icon: <CategoryIcon /> },
  { segment: "product", title: "QUẢN LÍ SẢN PHẨM", icon: <InventoryIcon /> },
  { segment: "order", title: "QUẢN LÍ ĐƠN HÀNG", icon: <ShoppingCartIcon /> },
  {
    segment: "customer",
    title: "QL KHÁCH HÀNG/NHÂN VIÊN",
    icon: <PersonIcon />,
  },
  {
    segment: "discount",
    title: "TẠO KHUYẾN MÃI",
    icon: <ConfirmationNumberIcon />,
  },
  { kind: "divider" },
  { kind: "header", title: "Analytics" },
  {
    segment: "statistical",
    title: "THỐNG KÊ",
    icon: <BarChartIcon />,
    children: [
      {
        segment: "revenue",
        title: "DOANH THU",
        icon: <LeaderboardIcon />,
      },
      {
        segment: "bestsaler",
        title: "SL SẢN PHẨM BÁN CHẠY",
        icon: <DescriptionIcon />,
      },
    ],
  },
  { segment: "warehouse", title: "KHO", icon: <WarehouseIcon /> },
  { kind: "divider" },
  {
    icon: <LogoutIcon onClick={handleLogOut} />,
    action: (
      <Button fullWidth onClick={handleLogOut}>
        ĐĂNG XUẤT
      </Button>
    ),
  },
];

const NAVIGATION_WAREHOUSE: Navigation = [
  { kind: "header", title: "Kho" },
  { segment: "warehouse", title: "KHO", icon: <WarehouseIcon /> },
  { kind: "divider" },
  {
    icon: <LogoutIcon onClick={handleLogOut} />,
    action: (
      <Button fullWidth onClick={handleLogOut}>
        ĐĂNG XUẤT
      </Button>
    ),
  },
];

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: "class",
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath: string): Router {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path: string | URL) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}

const Dashboard = (props: any) => {
  const roleUser = JSON.parse(localStorage.getItem('viewUser') || '{}');

  const navigation =
    roleUser?.role === "admin" ? NAVIGATION_ADMIN : NAVIGATION_WAREHOUSE;
  const { window } = props;
  const router = useDemoRouter("/dashboard");
  const demoWindow = window ? window() : undefined;

  return (
    <AppProvider
      navigation={navigation}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      branding={{ title: "HIGH FASHION !" }}
    >
      <DashboardLayout>
        <PageContainer
          title=""
          breadcrumbs={[]}
          sx={{ maxWidth: "none !important", width: "100%" }}
        >
          {router.pathname === "/dashboard" && <DashboardContent value="abc" />}
          {router.pathname === "/categori" && <Categori />}
          {router.pathname === "/banner" && <Banner />}
          {router.pathname === "/product" && <Product />}
          {router.pathname === "/order" && <Orders />}
          {router.pathname === "/customer" && <Customer />}
          {router.pathname === "/discount" && <Discount />}
          {router.pathname === "/statistical/revenue" && <Revenue />}
          {router.pathname === "/warehouse" && <Inventory />}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
};

export default Dashboard;
