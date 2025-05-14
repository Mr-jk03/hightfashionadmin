import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatter } from "../../../helps/Helps";
import { selectOrdetStatus } from "../Enum/EnumOrderStatus";

export const exportExcelByTimeRange = (
  orders: any[],
  type: "year" | "month" | "week" | "day",
  value: number
) => {
  const now = new Date();

  const isSameDay = (date1: Date, date2: Date) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  const isInCurrentWeek = (date: Date) => {
    const now = new Date();
    const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

    return date >= firstDayOfWeek && date <= lastDayOfWeek;
  };

  const filtered = orders.filter((order) => {
    const createdAt = new Date(order.created_at);
    switch (type) {
      case "year":
        return createdAt.getFullYear() === value;
      case "month":
        return (
          createdAt.getFullYear() === now.getFullYear() &&
          createdAt.getMonth() + 1 === value
        );
      case "week":
        return isInCurrentWeek(createdAt);
      case "day":
        return isSameDay(createdAt, now);
      default:
        return false;
    }
  });

  const data = filtered.map((order: any) => ({
    "Mã đơn hàng": order.order_code,
    "Tên khách hàng": order.customer_name,
    "Trạng thái": order.order_status
      ? selectOrdetStatus.find((item: any) => item.value == order.order_status)
          ?.label || ""
      : "",
    "Tổng tiền": formatter(order.total_price),
    "Địa chỉ": `${order.detail_address}, ${order.address}`,
    "Ngày tạo": new Date(order.created_at).toLocaleString(),
    "Sản phẩm": order.items.map((i: any) => i.product_name).join(", "),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Báo cáo");

  const label =
    type === "year"
      ? `nam_${value}`
      : type === "month"
        ? `thang_${value}`
        : type === "week"
          ? "tuan_nay"
          : `Ngay_${new Date().getDate().toString().padStart(2, "0")}-${(
              new Date().getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}-${new Date().getFullYear()}`;

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `bao_cao_don_hang_${label}.xlsx`);
};
