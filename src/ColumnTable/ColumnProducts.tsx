import { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { formatter } from "../helps/Helps";

export const getColumnProducts = (
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
  { field: "category_name", headerName: "TÊN DANH MỤC", width: 230 },
  { field: "brand", headerName: "NHÀ CUNG CẤP", width: 230 },
  { field: "product_name", headerName: "TÊN SẢN PHẨM", width: 500 },
  { field: "description", headerName: "MÔ TẢ", width: 300 },
  { field: "price", headerName: "GIÁ SẢN PHẨM", width: 150, valueFormatter: (params) => {
        return formatter(params)
      }, },
  { field: "stock_quantity", headerName: "SỐ LƯỢNG", width: 150 },
  { field: "discount", headerName: "GIẢM GIÁ", width: 150 },
  { field: "color", headerName: "Màu sắc", width: 150 },
  { field: "size", headerName: "Kích thước", width: 150 },
];
