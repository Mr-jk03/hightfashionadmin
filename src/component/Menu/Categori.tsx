import {
  Button,
  MenuItem,
  Paper,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import React, { useEffect, useRef, useState } from "react";
import { ColumnCategori } from "../../ColumnTable/ColumnCategori";
import { toast } from "react-toastify";
import {
  addCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../config/apiFunction";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import Swal from "sweetalert2";
import * as category from "../../features/redux/reduxGrid/reducer";
import { useDispatch } from "react-redux";

const Categori = () => {
  const dispatch = useDispatch();
  const categoryInputForcus = useRef<HTMLInputElement>(null);
  const [dataTable, setDataTable] = useState<any>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    data: [],
  });
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [description, setDesCription] = useState("");
  const [statusBtn, setStatusBtn] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCategories();
        const updatedData = res.data.map((item: any, index: number) => ({
          ...item,
          stt: index + 1,
        }));
        setDataTable({
          totalItems: res.totalItems,
          totalPages: res.totalPages,
          currentPage: res.currentPage,
          data: updatedData,
        });
      } catch (error: any) {
        toast.error(error.response?.data?.message);
      }
    };
    fetchData();
  }, [refresh]);

  const handleAddcategory = async () => {
    if (!categoryName) {
      toast.warning("Vui lòng điền tên danh mục");
    } else {
      try {
        await addCategory(categoryName, description);
        setCategoryName("");
        setDesCription("");
        toast.success("Thêm danh mục thành công!");
        setRefresh((prev) => !prev);
        categoryInputForcus.current?.focus();
      } catch (error: any) {
        toast.error(error.response?.data?.message);
      }
    }
  };
  const handleSelectToEdit = (row: any) => {
    setCategoryId(row?.id);
    setCategoryName(row?.category_name);
    setDesCription(row?.description);
    setStatusBtn(true);
  };
  const handleEditcategory = async () => {
    try {
      await updateCategory(categoryName, description, categoryId);
      toast.success("Cập nhật danh mục thành công");
      setRefresh((prev) => !prev);
      setStatusBtn(false);
      setCategoryName("");
      setDesCription("");
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };
  const handleClearAll = () => {
    setCategoryName("");
    setDesCription("");
    setStatusBtn(false);
  };

  const handleDelete = async (row: any) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa danh mục?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      try {
        const res: any = await deleteCategory(row.id);
        if (res) {
          toast.success("Xóa danh mục thành công");
          setRefresh((prev) => !prev);
        }else{
          toast.error('Lỗi khi xóa danh mục!')
        }
      } catch (error: any) {
        toast.error(error.response);
      }
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-4">
          <TextField
            id="outlined-error"
            label="Danh mục"
            defaultValue=""
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            fullWidth
            size="small"
            inputRef={categoryInputForcus}
          />
        </div>
        <div className="col-6">
          <TextField
            id="outlined-multiline"
            label="Mô tả danh mục"
            multiline
            rows={3}
            fullWidth
            size="small"
            value={description}
            onChange={(e) => setDesCription(e.target.value)}
          />
        </div>
        <div className="col-2">
          {!statusBtn ? (
            <Button
              fullWidth
              variant="contained"
              endIcon={<AddCircleIcon />}
              onClick={handleAddcategory}
            >
              Thêm
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              endIcon={<SettingsIcon />}
              color={"info"}
              onClick={handleEditcategory}
            >
              Sửa
            </Button>
          )}
          <Button
            fullWidth
            variant="contained"
            endIcon={<CleaningServicesIcon />}
            onClick={handleClearAll}
            sx={{ marginTop: "10px" }}
          >
            Clear All
          </Button>
        </div>
      </div>
      <div className="row mt-3">
        <Paper sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={dataTable.data}
            columns={ColumnCategori(handleSelectToEdit, handleDelete)}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            sx={{ border: 0 }}
            paginationMode="client"
            onPaginationModelChange={setPaginationModel}
          />
        </Paper>
      </div>
    </div>
  );
};

export default Categori;
