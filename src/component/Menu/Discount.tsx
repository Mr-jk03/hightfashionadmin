import { Button, Paper, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import { getColumnDiscount } from "../../ColumnTable/ColumnDiscount";
import { addDisCount, deleteDiscount, getListDiscount } from "../../config/apiFunction";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Discount = () => {
  const [statusBtn, setStatusBtn] = useState(false);
  const disCountInputForcus = useRef<HTMLInputElement>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountPerCentage, setDiscountPerCentage] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });
  const [dataTable, setDataTable] = useState({
    data: [],
    totalItems: 0,
  });
  useEffect(() => {
    const listDiscount = async () => {
      try {
        const listDiscount = await getListDiscount();
        if (listDiscount) {
          const updatedData = listDiscount.data.map(
            (item: any, index: number) => ({
              ...item,
              stt: index + 1,
              valid_from: new Date(item.valid_from).toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
              valid_until: new Date(item.valid_until).toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
            })
          );
          setDataTable({
            data: updatedData,
            totalItems: listDiscount.total,
          });
        }
      } catch (err) {
        toast.error("Lỗi lấy danh sách mã giảm giá");
      }
    };
    listDiscount();
  }, [refresh]);

  const handleAddDiscount = async () => {
    if (!discountCode && !discountPerCentage && !fromDate && !toDate) {
      toast.error("Vui lòng điền đẩy đủ thông tin");
    } else {
      try {
        const res = await addDisCount(
          discountCode,
          discountPerCentage,
          fromDate,
          toDate
        );
        if (res) {
          toast.success("Tạo mã thành công");
          setDiscountCode("");
          setDiscountPerCentage("");
          setFromDate("");
          setToDate("");
          setRefresh((prev) => !prev);
          disCountInputForcus.current?.focus();
        } else {
          toast.error("Tạo mã thất bại");
        }
      } catch (err) {
        toast.error("Lỗi kết nối");
      }
    }
  };

  // const handleSelectToEdit = (param: any) => {
  //   setDiscountCode(param.discount_code);
  //   setDiscountPerCentage(param.discount_percentage);
  //   setFromDate(param.valid_from);
  //   setToDate(param.valid_until);
  // };
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
        await deleteDiscount(row.id);
        toast.success("Xóa mã thành công");
        setRefresh((prev) => !prev);
      } catch (error: any) {
        toast.error(error.response?.data?.message);
      }
    }
  };
  return (
    <div>
      <div className="row">
        <div className="col-3">
          <TextField
            id="outlined-error"
            label="Mã Code"
            defaultValue=""
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            fullWidth
            size="small"
            inputRef={disCountInputForcus}
          />
        </div>
        <div className="col-3">
          <TextField
            id="outlined-multiline"
            label="% Giảm giá"
            multiline
            fullWidth
            size="small"
            value={discountPerCentage}
            onChange={(e) => setDiscountPerCentage(e.target.value)}
          />
        </div>
        <div className="col-3">
          <TextField
            id="date-picker"
            label="Từ ngày"
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="col-3">
          <TextField
            id="date-picker"
            label="Đến ngày"
            type="date"
            fullWidth
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            value={toDate} // Thay selectedDate bằng state lưu ngày tháng
            onChange={(e) => setToDate(e.target.value)} // Cập nhật state khi thay đổi
          />
        </div>

        <div className="col-2">
          <Button
            fullWidth
            variant="contained"
            sx={{ marginTop: "10px" }}
            endIcon={<AddCircleIcon />}
            onClick={handleAddDiscount}
          >
            Thêm
          </Button>
        </div>
        <div className="col-2">
          <Button
            fullWidth
            variant="contained"
            endIcon={<CleaningServicesIcon />}
            //onClick={handleClearAll}
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
            columns={getColumnDiscount(handleDelete)}
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

export default Discount;
