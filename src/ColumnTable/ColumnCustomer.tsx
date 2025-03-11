import { GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

export const ColumnCustomer = (
  handleDeleteUser: (row: any) => void,
  handleViewUser: (row: any) => void
): GridColDef[] => [
  {
    field: "actions",
    headerName: "HÀNH ĐỘNG",
    width: 110,
    align: "center",
    renderCell: (params: any) => (
      <div>
        <IconButton
          color="secondary"
          onClick={() => handleViewUser(params.row)}
        >
          <RemoveRedEyeIcon />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={() => handleDeleteUser(params.row)}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    ),
  },
  {
    field: "stt",
    headerName: "STT",
    width: 50,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "id",
    headerName: "ID",
    width: 50,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "full_name",
    headerName: "TÊN KHÁCH HÀNG",
    width: 250,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "email",
    headerName: "EMAIL",
    width: 220,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "phone",
    headerName: "SỐ ĐIỆN THOẠI",
    width: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "address",
    headerName: "ĐỊA CHỈ",
    width: 350,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "created_at",
    headerName: "TẠO LÚC",
    width: 250,
    headerAlign: "center",
    align: "center",
  },
];
