import { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { formatter } from "../helps/Helps";

export const getColumnOrder = (
  handleSelectToEdit: (row: any) => void,
  handleDelete: (row: any) => void
): GridColDef[] => [
  {
    field: "actions",
    headerName: "HÀNH ĐỘNG",
    width: 110,
    renderCell: (params: any) => (
      <div>
        <IconButton
          color="primary"
          onClick={() => handleSelectToEdit(params.row)}
        >
          <EditIcon />
        </IconButton>
        <IconButton color="secondary" onClick={() => handleDelete(params.row)}>
          <DeleteIcon />
        </IconButton>
      </div>
    ),
  },
  { field: "id", headerName: "ID ĐƠN HÀNG", width: 150 },
  { field: "user_id", headerName: "MÃ KH", width: 170 },
  {
    field: "total_price",
    headerName: "TỔNG TIỀN",
    width: 170,
    valueFormatter: (params) => {
      return formatter(params);
    },
  },
  {
    field: "order_status",
    headerName: "TRẠNG THÁI",
    width: 170,
    valueFormatter: (params) => {
      const status = params;
      switch (status) {
        case "pending":
          return "Chờ xử lý";
        case "shipped":
          return "Đang vận chuyển";
        case "paySuccess":
          return "Đã thanh toán";
        case "cancelled":
          return "Đã hủy";
        case "payFail":
          return "Thanh toán thất bại";
        default:
          return "Đã giao";
      }
    },
  },
  {
    field: "payment_method",
    headerName: "PHƯƠNG THỨC THANH TOÁN",
    width: 220,
    valueFormatter: (value) => {
      switch (value) {
        case 0:
          return "Thanh toán khi nhận hàng";
        case 1:
          return "Thanh toán qua VnPay";
        default:
          return;
      }
    },
  },
  { field: "address", headerName: "ĐỊA CHỈ", width: 250 },
  { field: "created_at", headerName: "TẠO LÚC", width: 200 },
  { field: "order_code", headerName: "MÃ ĐƠN HÀNG", width: 200 },
];
