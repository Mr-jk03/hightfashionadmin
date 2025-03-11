import { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

export const getColumnDiscount = (
  handleDelete: (row: any) => void
): GridColDef[] => [
  { field: "stt", headerName: "STT", width: 70 },
  { field: "id", headerName: "ID", width: 170 },
  { field: "discount_code", headerName: "MÃ GIẢM GIÁ", width: 220 },
  { field: "discount_percentage", headerName: "% GIẢM GIÁ", width: 180 },
  { field: "valid_from", headerName: "THỜI GIAN BẮT ĐẦU", width: 200 },
  { field: "valid_until", headerName: "THỜI GIAN KẾT THÚC", width: 200 },
  {
    field: "actions",
    headerName: "HÀNH ĐỘNG",
    width: 110,
    align: 'center',
    renderCell: (params: any) => (
      <div>
        <IconButton color="secondary" onClick={() => handleDelete(params.row)}>
          <DeleteIcon />
        </IconButton>
      </div>
    ),
  },
];
