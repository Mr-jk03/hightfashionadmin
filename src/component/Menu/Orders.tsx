import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
} from "@mui/material";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { getColumnOrder } from "../../ColumnTable/ColumnOrder";
import { toast } from "react-toastify";
import { getDataLineChart } from "../../config/apiFunction";
import moment from "moment";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { orange } from "@mui/material/colors";

const Orders = () => {
  const [open, setOpen] = React.useState(false);
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
  useEffect(() => {
    const dataTable = async () => {
      try {
        const res: any = await getDataLineChart();
        if (res) {
          const dataTable = res.data.map((i: any) => ({
            ...i,
            id: i.id,
            user_id: i.user_id,
            customer_name: i.customer_name,
            total_price: i.total_price,
            order_status: i.order_status,
            payment_method:
              i.payment_method === 0
                ? "Thanh toán khi nhận hàng"
                : 1
                  ? "Thanh toán qua VnPay"
                  : "",
            address: i.address,
            created_at: moment(i.created_at).format("DD/MM/YYYY HH:mm"),
            order_code: i.order_code,
            product_id: i.product_id,
            quantity: i.quantity,
            price: i.price,
          }));
          setDataTable({
            totalItems: res.data.length,
            data: dataTable,
          });
        } else {
          toast.error("Lỗi lấy dữ liệu bảng !");
        }
      } catch (err: any) {
        toast.error("Lỗi liên quan đến netWork !");
      }
    };

    dataTable();
  }, []);

  const handleSelectToEdit = (row: any) => {};
  const handleDelete = () => {};
  const handleClicked = (param: any) => {
    setSelectedOrder(param.row);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
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
  return (
    <div>
      <div className="row"></div>
      <div className="row mt-3">
        <div className="row mt-3">
          <Paper sx={{ height: 600, width: "100%" }}>
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
                    <h1 style={{ fontWeight: "bold", color: "#d00" }}>
                      HÓA ĐƠN
                    </h1>
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
      </div>
    </div>
  );
};

export default Orders;
