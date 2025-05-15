import {
  Button,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import React, { useEffect, useState } from "react";
import { ColumnCustomer } from "../../ColumnTable/ColumnCustomer";
import {
  addStaffwareHouse,
  deleteCustomer,
  getListCustomer,
  getListStaffwarehouse,
} from "../../config/apiFunction";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { fontSize } from "@mui/system";
import { initValueStaff, valueInfoStaff } from "./type";

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
  const [passUser, setPassUser] = useState("");
  const [addressUser, setAddressUser] = useState("");
  const [role, setRole] = useState("");
  const [avataCus, setAvataCus] = useState("");
  const [valuePeople, setValuePeople] = useState("customer");
  const roleUser = JSON.parse(localStorage.getItem("viewUser") || "{}");
  const paginationModel = { page: dataTable.currentPage, pageSize: 10 };
  const [isDisable, setIsDisable] = useState(false);
  const [valueAddStaff, setValueAddStaff] =
    useState<valueInfoStaff>(initValueStaff);
  const [validate, setValidate] = useState(false);

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
    setAvataCus(row?.avata);
    setPhoneUser(row?.phone);
    setEmailUser(row?.email);
    setAddressUser(row?.address);
    setRole(row?.role);
  };

  const handleClearAll = () => {
    setIdUser("");
    setNameUser("");
    setPhoneUser("");
    setEmailUser("");
    setAddressUser("");
    setRole("");
  };
  const handleChangeManagement = (event: { target: { value: string } }) => {
    setValuePeople(event.target.value);
  };

  const handleBlur = (key: string, event: any) => {
    const value = event.target.value;
    setValueAddStaff((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };
  const handleAddStaffWarehouse = async () => {
    if (
      valueAddStaff.staffName == "" ||
      valueAddStaff.staffMobile == "" ||
      valueAddStaff.staffEmail == "" ||
      valueAddStaff.staffPass == "" ||
      valueAddStaff.staffAddress == "" ||
      valueAddStaff.staffRole == ""
    ) {
      setValidate(true);
      toast.error("Vui lòng điền đầy đủ thông tin nhân viên");
      return;
    }
    try {
      const res: any = await addStaffwareHouse(valueAddStaff);
      if (res) {
        toast.error("Thêm nhân viên thành công!");
        setValueAddStaff(initValueStaff);
        setValidate(false);
      }
    } catch (err: any) {
      toast.error("Lỗi liên quan đến netWork");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (valuePeople == "customer") {
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
      } else if (valuePeople == "staff") {
        setIsDisable(true);
        try {
          const res = await getListStaffwarehouse();
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
      }
    };
    fetchData();
  }, [refresh, valuePeople]);

  return (
    <div className="row">
      <div className="col-3 mb-2">
        <Select
          label="Quản lý"
          labelId="category-label"
          id="demo-customized-select"
          onChange={handleChangeManagement}
          size="small"
          fullWidth
          displayEmpty
          input={<OutlinedInput label="Quản lý" />}
          defaultValue={valuePeople}
        >
          <MenuItem value={"customer"}>Khách hàng</MenuItem>
          <MenuItem value={"staff"}>Nhân viên</MenuItem>
        </Select>
      </div>
      <div className="col-9"></div>
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
            alt="avatar"
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
                value={idUser ? idUser : ""}
                disabled={isDisable}
              />
            </div>
            <div className="col-12">
              <TextField
                id="outlined-error"
                label="Họ tên"
                size="small"
                fullWidth
                value={nameUser ? nameUser : ""}
                onChange={(e) => setNameUser(e.target.value)}
                onBlur={(value) => handleBlur("staffName", value)}
                error={validate && !valueAddStaff.staffName}
              />
            </div>
            <div className="col-12">
              <TextField
                id="outlined-error"
                label="Số điện thoại"
                size="small"
                fullWidth
                value={phoneUser ? phoneUser : ""}
                onBlur={(value) => handleBlur("staffMobile", value)}
                onChange={(e) => setPhoneUser(e.target.value)}
                error={validate && !valueAddStaff.staffMobile}
              />
            </div>
            <div className="col-12 d-flex justify-content-between gap-5">
              <TextField
                id="outlined-error"
                label="Email"
                size="small"
                fullWidth
                value={emaiUser ? emaiUser : ""}
                onBlur={(value) => handleBlur("staffEmail", value)}
                onChange={(e) => setEmailUser(e.target.value)}
                error={validate && !valueAddStaff.staffEmail}
              />
              {valuePeople == "staff" && roleUser.role == "admin" && (
                <TextField
                  id="outlined-error"
                  label="Mật khẩu tạm thời"
                  size="small"
                  fullWidth
                  value={passUser ? passUser : ""}
                  onBlur={(value) => handleBlur("staffPass", value)}
                  onChange={(e) => {
                    const noSpaceValue = e.target.value.replace(/\s/g, "");
                    setPassUser(noSpaceValue);
                  }}
                  error={validate && !valueAddStaff.staffPass}
                />
              )}
            </div>
          </div>
          <div className="col-6">
            <TextField
              id="outlined-multiline"
              label="Địa chỉ"
              multiline
              fullWidth
              minRows={7}
              value={addressUser ? addressUser : ""}
              onBlur={(value) => handleBlur("staffAddress", value)}
              onChange={(e) => setAddressUser(e.target.value)}
              error={validate && !valueAddStaff.staffAddress}
              sx={{ marginBottom: "5px" }}
            />
            <Select
              label="Trạng thái"
              labelId="category-label"
              id="demo-customized-select"
              size="small"
              fullWidth
              displayEmpty
              input={<OutlinedInput label="Trạng thái" />}
              value={role || ""}
              onChange={(e) => setRole(e.target.value)}
              onBlur={(value) => handleBlur("staffRole", value)}
              error={validate && !valueAddStaff.staffRole}
            >
              <MenuItem value="warehouse">Nhân viên thủ kho</MenuItem>
            </Select>
            <div className="d-flex justify-content-between gap-4">
              {valuePeople == "staff" && roleUser.role == "admin" && (
                <Button
                  variant="contained"
                  sx={{ marginTop: "18px", width: "250px" }}
                  size="small"
                  onClick={handleAddStaffWarehouse}
                >
                  <span style={{ fontSize: "13px" }}>Thêm nhân viên</span>
                </Button>
              )}
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
      </div>
      <Paper sx={{ height: "500px", width: "100%", marginTop: "15px" }}>
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
