import { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";


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
    { field: "total_price", headerName: "TỔNG TIỀN", width: 170 },
    { field: "order_status", headerName: "TRẠNG THÁI", width: 170 },
    { field: "payment_method", headerName: "PHƯƠNG THỨC THANH TOÁN", width: 220 },
    { field: "address", headerName: "ĐỊA CHỈ", width: 250 },
    { field: "created_at", headerName: "TẠO LÚC", width: 200 },
    { field: "order_code", headerName: "MÃ ĐƠN HÀNG", width: 200 },
  ];
  