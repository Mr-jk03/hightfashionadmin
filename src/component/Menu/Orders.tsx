import {
  Avatar,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { getColumnOrder } from "../../ColumnTable/ColumnOrder";
import { toast } from "react-toastify";
import { getDataLineChart, updateOrderStatus } from "../../config/apiFunction";
import PaidIcon from "@mui/icons-material/Paid";
import moment from "moment";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { selectOrdetStatus } from "./Enum/EnumOrderStatus";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { initPriceStatusOrder, TotalPriceStatusOrder } from "./type";
import { formatter } from "../../helps/Helps";

const Orders = () => {
  const [open, setOpen] = React.useState(false);
  const [openUpdateOrderStatus, setOpenUpdateOrderStatus] = useState(false);
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [selectOrderStt, setSelectOrderStt] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [dataTable, setDataTable] = useState<any>({
    totalItems: 0,
    currentPage: 1,
    data: [],
  });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 9,
  });
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [dataSelectedOrder, setDataSelectedOrder] = useState<any>(null);
  const [totalPriceStatusOrder, setTotalPriceStatusOrder] =
    useState<TotalPriceStatusOrder>(initPriceStatusOrder);

  const [listStatusOrder, setListStatusOrder] = useState({
    pendingStatus: 0,
    paySuccess: 0,
    shipped: 0,
    delivered: 0,
  });
  const [totalItemsOut, setTotalItemOut] = useState(0);

  const handleSelectToEdit = (param: any) => {
    setOpenUpdateOrderStatus(true);
    setDataSelectedOrder(param);
  };
  const handleDelete = () => {};
  const handleClicked = (param: any) => {
    setSelectedOrder(param.row);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };
  const handleCloseUpdateOrderStatus = () => {
    setOpenUpdateOrderStatus(false);
    setDataSelectedOrder(null);
  };
  const handlePrint = () => {
    setTimeout(() => {
      const printContent = document.getElementById("printArea")?.innerHTML;
      if (!printContent || printContent.trim() === "") {
        return;
      }
      const printWindow = window.open("", "_blank", "width=1250,height=650");
      if (!printWindow) {
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>HÓA ĐƠN HIGHTFASHION</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');

              body {
                font-family: 'Roboto', sans-serif;
                padding: 40px;
                color: #333;
                background: #fff;
              }

              .invoice-container {
                width: 80%;
                margin: auto;
                padding: 20px;
                border-radius: 8px;
                border: 2px solid #d00;
              }

              .invoice-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px dashed #d00;
                padding-bottom: 10px;
              }
              .title-order{
                text-align: center;
              }

              .company-logo {
                display: flex;
                align-items: center;
                gap: 10px;
              }

              .company-logo img {
                width: 50px;
              }

              .company-info {
                text-align: right;
                font-size: 14px;
              }

              h1 {
                color: #d00;
                font-size: 24px;
                font-weight: bold;
              }

              .customer-info {
                margin-top: 10px;
                font-size: 14px;
              }

              .table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }

              .table th, .table td {
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
              }

              .table th {
                background-color: #f2f2f2;
              }

              .total-section {
                text-align: right;
                margin-top: 10px;
                font-size: 16px;
                font-weight: bold;
              }

              .footer {
                margin-top: 30px;
                font-size: 14px;
              }

              .footer strong {
                color: #d00;
              }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              ${printContent}
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 500);
              };
            </script>
          </body>
        </html>
      `);

      printWindow.document.close();
    }, 500);
  };

  const handleShowAllOrder = () => {
    setDataTable({
      totalItems: originalData.length,
      data: originalData,
    });
  };

  const handleShowListOrderPendding = () => {
    const penddingFilter = originalData.filter(
      (item: any) => item.order_status == "pending"
    );

    setDataTable({
      totalItems: penddingFilter.length,
      data: penddingFilter,
    });
  };
  const handleShowListPaySuccess = () => {
    const paySuccessFilter = originalData.filter(
      (item: any) => item.order_status == "paySuccess"
    );
    setDataTable({
      totalItems: paySuccessFilter.length,
      data: paySuccessFilter,
    });
  };
  const handleShowShippedOrder = () => {
    const shippedFilter = originalData.filter(
      (item: any) => item.order_status == "shipped"
    );
    setDataTable({
      totalItems: shippedFilter.length,
      data: shippedFilter,
    });
  };
  const handleShowSuccessOrder = () => {
    const delivered = originalData.filter(
      (item: any) => item.order_status == "delivered"
    );
    setDataTable({
      totalItems: delivered.length,
      data: delivered,
    });
  };
  const handleChangeOrderStatus = (event: { target: { value: string } }) => {
    setSelectOrderStt(event.target.value);
  };

  const handleUpdateOrder = async () => {
  try {
    if (!dataSelectedOrder?.items) {
      toast.error("Không có sản phẩm nào trong đơn hàng");
      return;
    }

    
    const products = dataSelectedOrder.items.map((item: any) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));

   
    const res: any = await updateOrderStatus(
      selectOrderStt,
      products,
      dataSelectedOrder.id
    );

    if (res) {
      toast.success("Cập nhật sản phẩm thành công");
      setRefresh((prev) => !prev);
      setOpenUpdateOrderStatus(false);
    }
  } catch (err) {
    console.error("Lỗi:", err);
    toast.error("Lỗi liên quan đến netWork");
  }
};


  useEffect(() => {
    const dataTable = async () => {
      try {
        const res: any = await getDataLineChart();
        if (res) {
          setOriginalData(res.data);
          setDataTable({
            totalItems: res.data.length,
            data: res.data,
          });
          setTotalItemOut(res.data.length);
          const pendingStatus = res.data.filter(
            (item: any) => item.order_status == "pending"
          );
          const paySuccessOrder = res.data.filter(
            (item: any) => item.order_status == "paySuccess"
          );
          const shippedOrder = res.data.filter(
            (item: any) => item.order_status == "shipped"
          );
          const delivered = res.data.filter(
            (item: any) => item.order_status == "delivered"
          );
          setListStatusOrder((prev: any) => ({
            pendingStatus: pendingStatus.length,
            paySuccess: paySuccessOrder.length,
            shipped: shippedOrder.length,
            delivered: delivered.length,
          }));
        } else {
          toast.error("Lỗi lấy dữ liệu bảng !");
        }
      } catch (err: any) {
        toast.error("Lỗi liên quan đến netWork !");
      }
    };
    dataTable();
  }, [refresh]);

  useEffect(() => {
    const pending = originalData
      .filter((item: any) => item.order_status == "pending")
      .reduce((acc, curr) => acc + curr.total_price, 0);
    const payed = originalData
      .filter((item: any) => item.order_status == "paySuccess")
      .reduce((acc, curr) => acc + curr.total_price, 0);
    const shipper = originalData
      .filter((item: any) => item.order_status == "shipped")
      .reduce((acc, curr) => acc + curr.total_price, 0);
    const success = originalData
      .filter((item: any) => item.order_status == "delivered")
      .reduce((acc, curr) => acc + curr.total_price, 0);
    const all = pending + payed + shipper + success;
    setTotalPriceStatusOrder((prev: any) => ({
      ...prev,
      all: all,
      pending: pending,
      payed: payed,
      shipper: shipper,
      success: success,
    }));
  }, [originalData]);

  return (
    <div>
      <div className="row" style={{ height: "70px" }}>
        <div className="col-3 h-100">
          <div
            style={{
              height: "100%",
              border: "1px solid #c8c8c8",
              borderRadius: "7px",
              boxShadow:
                " 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
              display: "grid",
              gridTemplateColumns: "70% 30%",
              gridTemplateRows: "100%",
              padding: "5px",
              cursor: "pointer",
              position: "relative",
            }}
            className="parentHoverAll"
            onClick={handleShowAllOrder}
          >
            <div style={{ padding: "10px" }}>
              <h6
                style={{
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: "400",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08333em",
                  textTransform: "uppercase",
                  color: "GrayText",
                }}
              >
                Tổng số đơn
              </h6>
              <span
                style={{
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: "bold",
                  fontSize: "1rem",
                  letterSpacing: "0.08333em",
                  textTransform: "uppercase",
                  color: "#212529",
                }}
              >
                {totalItemsOut} đơn
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <StickyNote2Icon fontSize="large" color="success" />
            </div>
            <div className="hoverAll">
              <span>{formatter(totalPriceStatusOrder.all)} đ</span>
            </div>
          </div>
        </div>
        <div className="col-2 h-100">
          <div
            style={{
              height: "100%",
              border: "1px solid #c8c8c8",
              borderRadius: "7px",
              boxShadow:
                " 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
              display: "grid",
              gridTemplateColumns: "70% 30%",
              gridTemplateRows: "100%",
              padding: "5px",
              cursor: "pointer",
              position: "relative",
            }}
            className="parentHoverAll"
            onClick={handleShowListOrderPendding}
          >
            <div style={{ padding: "10px" }}>
              <h6
                style={{
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: "400",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08333em",
                  textTransform: "uppercase",
                  color: "GrayText",
                }}
              >
                Chờ xử lí
              </h6>
              <span
                style={{
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: "bold",
                  fontSize: "1rem",
                  letterSpacing: "0.08333em",
                  textTransform: "uppercase",
                  color: "#212529",
                }}
              >
                {listStatusOrder.pendingStatus} đơn
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AutorenewIcon fontSize="large" color="warning" />
            </div>
            <div className="hoverAll">
              <span>{formatter(totalPriceStatusOrder.pending)} đ</span>
            </div>
          </div>
        </div>
        <div className="col-3 h-100">
          <div
            style={{
              height: "100%",
              border: "1px solid #c8c8c8",
              borderRadius: "7px",
              boxShadow:
                " 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
              display: "grid",
              gridTemplateColumns: "70% 30%",
              gridTemplateRows: "100%",
              padding: "5px",
              cursor: "pointer",
              position: "relative",
            }}
            className="parentHoverAll"
            onClick={handleShowListPaySuccess}
          >
            <div style={{ padding: "10px" }}>
              <h6
                style={{
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: "400",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08333em",
                  textTransform: "uppercase",
                  color: "GrayText",
                }}
              >
                đã thanh toán
              </h6>
              <span
                style={{
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: "bold",
                  fontSize: "1rem",
                  letterSpacing: "0.08333em",
                  textTransform: "uppercase",
                  color: "#212529",
                }}
              >
                {listStatusOrder.paySuccess} đơn
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PaidIcon fontSize="large" color="success" />
            </div>
            <div className="hoverAll">
              <span>{formatter(totalPriceStatusOrder.payed)} đ</span>
            </div>
          </div>
        </div>
        <div className="col-2 h-100">
          <div
            style={{
              height: "100%",
              border: "1px solid #c8c8c8",
              borderRadius: "7px",
              boxShadow:
                " 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
              display: "grid",
              gridTemplateColumns: "70% 30%",
              gridTemplateRows: "100%",
              padding: "5px",
              cursor: "pointer",
              position: "relative",
            }}
            className="parentHoverAll"
            onClick={handleShowShippedOrder}
          >
            <div style={{ padding: "10px" }}>
              <h6
                style={{
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: "400",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08333em",
                  textTransform: "uppercase",
                  color: "GrayText",
                }}
              >
                Vận chuyển
              </h6>
              <span
                style={{
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: "bold",
                  fontSize: "1rem",
                  letterSpacing: "0.08333em",
                  textTransform: "uppercase",
                  color: "#212529",
                }}
              >
                {listStatusOrder.shipped} đơn
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LocalShippingIcon fontSize="large" color="success" />
            </div>
            <div className="hoverAll">
              <span>{formatter(totalPriceStatusOrder.shipper)} đ</span>
            </div>
          </div>
        </div>
        <div className="col-2 h-100">
          <div
            style={{
              height: "100%",
              border: "1px solid #c8c8c8",
              borderRadius: "7px",
              boxShadow:
                " 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
              display: "grid",
              gridTemplateColumns: "70% 30%",
              gridTemplateRows: "100%",
              padding: "5px",
              cursor: "pointer",
              position: "relative",
            }}
            className="parentHoverAll"
            onClick={handleShowSuccessOrder}
          >
            <div style={{ padding: "10px" }}>
              <h6
                style={{
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: "400",
                  fontSize: "0.75rem",
                  letterSpacing: "0.08333em",
                  textTransform: "uppercase",
                  color: "GrayText",
                }}
              >
                Đã giao
              </h6>
              <span
                style={{
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: "bold",
                  fontSize: "1rem",
                  letterSpacing: "0.08333em",
                  textTransform: "uppercase",
                  color: "#212529",
                }}
              >
                {listStatusOrder.delivered} đơn
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CheckCircleIcon fontSize="large" color="success" />
            </div>
            <div className="hoverAll">
              <span>{formatter(totalPriceStatusOrder.success)} đ</span>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <Paper sx={{ height: 510, width: "100%" }}>
          <DataGrid
            rows={dataTable.data}
            columns={getColumnOrder(handleSelectToEdit, handleDelete)}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[9, 50]}
            sx={{ border: 0 }}
            paginationMode="client"
            onPaginationModelChange={setPaginationModel}
            onCellDoubleClick={handleClicked}
          />
        </Paper>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        maxWidth="xl"
        PaperProps={{
          sx: { width: 850, height: 550 },
        }}
      >
        <DialogTitle>
          <span style={{ fontSize: "16px", fontWeight: "bold" }}>
            Thông tin chi tiết đơn hàng: {selectedOrder?.id}
          </span>
        </DialogTitle>

        <DialogContent>
          {selectedOrder ? (
            <div id="printArea" style={{ padding: "20px" }}>
              {/* HEADER */}
              <div className="row header-pr">
                <div className="col-12 text-center title-order">
                  <h1 style={{ fontWeight: "bold", color: "#d00" }}>HÓA ĐƠN</h1>
                </div>
              </div>

              {/* CUSTOMER INFO */}
              <Typography>
                <b>Mã đơn hàng:</b> {selectedOrder.order_code}
              </Typography>
              <Typography>
                <b>Khách hàng:</b> {selectedOrder.customer_name}
              </Typography>
              <Typography>
                <b>Địa chỉ:</b> {selectedOrder.detail_address},{" "}
                {selectedOrder.address}
              </Typography>
              <Typography>
                <b>Phương thức thanh toán:</b> {selectedOrder.payment_method}
              </Typography>
              <Typography>
                <b>Ngày đặt:</b> {selectedOrder.created_at}
              </Typography>

              {/* ORDER DETAILS */}
              <table className="table">
                <thead>
                  <tr>
                    <th>Mã sản phẩm</th>
                    <th>Tên sản phẩm</th>
                    <th>Màu sắc</th>
                    <th>Kích thước</th>
                    <th>Thương hiệu</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item: any, index: number) => (
                    <tr key={index}>
                      <td>{item.product_id}</td>
                      <td>{item.product_name}</td>
                      <td>{item.color}</td>
                      <td>{item.size}</td>
                      <td>{item.brand}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* TOTAL */}
              <div className="total-section">
                <p>
                  Tổng cộng:{" "}
                  {parseFloat(selectedOrder.total_price).toLocaleString(
                    "vi-VN",
                    { style: "currency", currency: "VND" }
                  )}
                </p>
                <p>
                  <strong style={{ color: "red" }}>
                    TỔNG TIỀN:{" "}
                    {parseFloat(selectedOrder.total_price).toLocaleString(
                      "vi-VN",
                      { style: "currency", currency: "VND" }
                    )}
                  </strong>
                </p>
              </div>
            </div>
          ) : (
            <Typography>Không có dữ liệu</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button variant="contained" color="success" onClick={handlePrint}>
            <LocalPrintshopIcon fontSize="medium" /> <span>In hóa đơn</span>
          </Button>
          <Button variant="outlined" color="success" onClick={handleClose}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openUpdateOrderStatus}
        onClose={handleCloseUpdateOrderStatus}
        aria-labelledby="alert-dialog-title"
        maxWidth="xl"
        PaperProps={{
          sx: { width: 850, height: 550 },
        }}
      >
        <DialogTitle>
          <span style={{ fontSize: "16px", fontWeight: "bold" }}>
            Cập nhật trạng thái đơn hàng: {dataSelectedOrder?.id} Khách hàng:{" "}
            {dataSelectedOrder?.customer_name}
          </span>
        </DialogTitle>
        <DialogContent>
          <div style={{ height: "100%", width: "100%" }}>
            <div className="row">
              <div className="col-4">
                <span style={{ fontSize: "15px" }}>Mã đơn hàng: </span>
                <br />
                <span>{dataSelectedOrder?.order_code}</span>
              </div>
              <div className="col-4">
                <div>
                  <span style={{ fontSize: "15px" }}>
                    Hình thức thanh toán:{" "}
                  </span>
                  <br />
                  <span>
                    {dataSelectedOrder?.payment_method == 1
                      ? "Thanh toán qua VnPay"
                      : "Thay toán khi nhận hàng"}
                  </span>
                </div>
              </div>
              <div className="col-4">
                <span style={{ fontSize: "15px" }}>
                  Trạng thái:{" "}
                  {dataSelectedOrder?.order_status
                    ? selectOrdetStatus.find(
                        (item: any) =>
                          item.value === dataSelectedOrder.order_status
                      )?.label
                    : ""}
                </span>
              </div>
            </div>
            <div className="row mt-3">
              <Select
                label="Trạng thái"
                labelId="category-label"
                id="demo-customized-select"
                onChange={handleChangeOrderStatus}
                size="small"
                fullWidth
                displayEmpty
                input={<OutlinedInput label="Trạng thái" />}
                defaultValue={dataSelectedOrder?.order_status}
              >
                <MenuItem value="" disabled>
                  Chọn trạng thái
                </MenuItem>
                {selectOrdetStatus.map((o: any, i: number) => (
                  <MenuItem key={i} value={o.value}>
                    {o.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div
              style={{
                height: "45px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                variant="outlined"
                size="small"
                className="mt-3"
                onClick={handleUpdateOrder}
              >
                Cập nhật
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
