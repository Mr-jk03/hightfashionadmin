import { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

export const ColumnCategori = (
  handleSelectToEdit: (row: any) => void,
  handleDelete: (row: any) => void
): GridColDef[] => [
  { field: "stt", headerName: "STT", width: 70 },
  { field: "id", headerName: "ID", width: 170 },
  { field: "category_name", headerName: "TÊN DANH MỤC", width: 300 },
  { field: "description", headerName: "MÔ TẢ", width: 500 },
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
