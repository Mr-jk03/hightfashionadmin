import { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

export const getColumnProducts = (
  handleSelectToEdit: (row: any) => void,
  handleDelete: (row: any) => void
): GridColDef[] => [
  { field: "stt", headerName: "STT", width: 70 },
  { field: "id", headerName: "ID", width: 170 },
  { field: "category_name", headerName: "TÊN DANH MỤC", width: 270 },
  { field: "product_name", headerName: "TÊN SẢN PHẨM", width: 500 },
  { field: "description", headerName: "MÔ TẢ", width: 300 },
  { field: "price", headerName: "GIÁ SẢN PHẨM", width: 150 },
  { field: "stock_quantity", headerName: "SỐ LƯỢNG", width: 150 },
  { field: "discount", headerName: "GIẢM GIÁ", width: 150 },
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
];
