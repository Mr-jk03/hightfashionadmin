import { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { formatter } from "../helps/Helps";
import moment from "moment";

export const ColumnInventory = (
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
  { field: "id", headerName: "ID", width: 170 },
  {
    field: "dateofentry",
    headerName: "NGÀY NHẬP",
    headerAlign: "center",
    width: 150,
  },
  {
    field: "brandname",
    headerName: "NHÀ CUNG CẤP",
    headerAlign: "center",
    width: 150,
    align: "center",
  },
  {
    field: "product_name",
    headerName: "TÊN SẢN PHẨM",
    headerAlign: "center",
    width: 350,
  },
  {
    field: "stock_quantity",
    headerName: "SỐ LƯỢNG",
    headerAlign: "center",
    width: 120,
    align: "center",
  },
  {
    field: "unit",
    headerName: "ĐƠN VỊ",
    headerAlign: "center",
    width: 120,
    align: "center",
  },
  {
    field: "import_price",
    headerName: "GIÁ NHẬP",
    headerAlign: "center",
    width: 150,
    valueFormatter: (params) => {
      return formatter(params);
    },
    align: "right",
  },
  { field: "color", headerName: "MÀU SẮC", headerAlign: "center", width: 230 },
  {
    field: "size",
    headerName: "KÍCH THƯỚC",
    headerAlign: "center",
    width: 230,
  },
  {
    field: "total_price",
    headerName: "TỔNG TIỀN NHẬP",
    headerAlign: "center",
    width: 150,
    align: "right",
    valueFormatter: (params) => {
      return formatter(params);
    },
  },
  { field: "NOTE", headerName: "GHI CHÚ", headerAlign: "center", width: 250 },
];
