import { GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

export const ColumnBanner = (
  handleDelete: (row: any) => void
): GridColDef[] => [
  { field: "stt", headerName: "STT", width: 70 },
  { field: "id", headerName: "ID", width: 170 },
  { field: "link_banner", headerName: "LINK BANNER", width: 780 },
  {
    field: "actions",
    headerName: "HÀNH ĐỘNG",
    width: 110,
    align:'center',
    renderCell: (params: any) => (
      <div>
        <IconButton color="secondary" onClick={() => handleDelete(params.row)}>
          <DeleteIcon />
        </IconButton>
      </div>
    ),
  },
];
