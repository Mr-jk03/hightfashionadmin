import { Button, Paper, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import React, { useEffect, useState } from "react";
import { ColumnCustomer } from "../../ColumnTable/ColumnCustomer";
import { deleteCustomer, getListCustomer } from "../../config/apiFunction";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Customer = () => {
  const [refresh, setRefresh] = useState(false);
  const [dataTable, setDataTable] = useState<any>({
    totalPagesCustomer: 0,
    totalCustomer: 0,
    currentPage: 1,
    data: [],
  });
  const [idUser, setIdUser] = useState("");
  const [nameUser, setNameUser] = useState("");
  const [phoneUser, setPhoneUser] = useState("");
  const [emaiUser, setEmailUser] = useState("");
  const [addressUser, setAddressUser] = useState("");
  const [avataCus, setAvataCus] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getListCustomer();
        const updatedData = res.data.map((item: any, index: number) => ({
          ...item,
          stt: index + 1,
          created_at: new Date(item.created_at).toLocaleDateString("vi-VN"),
        }));
        setDataTable({
          totalPagesCustomer: res.totalPagesCustomer,
          totalCustomer: res.totalCustomer,
          currentPage: res.currentPage,
          data: updatedData,
        });
      } catch (err: any) {
        toast.error(err.response?.data?.message);
      }
    };
    fetchData();
  }, [refresh]);
  const paginationModel = { page: dataTable.currentPage, pageSize: 10 };

  const handleDeleteUser = async (row: any) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa user này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      try {
        await deleteCustomer(row.id);
        toast.success("Xóa danh mục thành công");
        setRefresh((prev) => !prev);
      } catch (error: any) {
        toast.error(error.response?.data?.message);
      }
    }
  };
  const handleViewUser = (row: any) => {
    setIdUser(row?.id);
    setNameUser(row?.full_name);
    setAvataCus(row?.avata)
    setPhoneUser(row?.phone);
    setEmailUser(row?.email);
    setAddressUser(row?.address);
  };
  console.log('object', avataCus)
  const handleClearAll = () => {
    setIdUser("");
    setNameUser("");
    setPhoneUser("");
    setEmailUser("");
    setAddressUser("");
  };
  return (
    <div className="row">
      <div className="col-3">
        <div
          style={{
            height: "250px",
            width: "250px",
            borderRadius: "7px",
            padding: "5px",
            border: "1px solid gray",
          }}
        >
          <img
            style={{ height: "100%", width: "100%" }}
            src={avataCus}
            alt="avata khách hàng"
          />
        </div>
      </div>
      <div className="col-9">
        <div className="row" style={{ height: "100%" }}>
          <div
            className="col-6"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div className="col-12">
              <TextField
                id="outlined-error"
                label="Id"
                size="small"
                fullWidth
                value={idUser}
              />
            </div>
            <div className="col-12">
              <TextField
                id="outlined-error"
                label="Tên khách hàng"
                size="small"
                fullWidth
                value={nameUser}
              />
            </div>
            <div className="col-12">
              <TextField
                id="outlined-error"
                label="Số điện thoại"
                size="small"
                fullWidth
                value={phoneUser}
              />
            </div>
            <div className="col-12">
              <TextField
                id="outlined-error"
                label="Email"
                size="small"
                fullWidth
                value={emaiUser}
              />
            </div>
          </div>
          <div className="col-6">
            <TextField
              id="outlined-multiline"
              label="Địa chỉ"
              multiline
              fullWidth
              minRows={7}
              value={addressUser}
            />
            <Button
              fullWidth
              variant="contained"
              endIcon={<CleaningServicesIcon />}
              onClick={handleClearAll}
              sx={{ marginTop: "18px" }}
            >
              Clear all
            </Button>
          </div>
        </div>
      </div>
      <Paper
        sx={{ height: "450px", width: "100%", marginTop: "15px" }}
      >
        <DataGrid
          rows={dataTable.data}
          columns={ColumnCustomer(handleDeleteUser, handleViewUser)}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
        />
      </Paper>
    </div>
  );
};

export default Customer;
