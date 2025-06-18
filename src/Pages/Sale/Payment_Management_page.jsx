import Admin_Navbar from "../Common/AdminNavbar";
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  message,
  Card,
  Statistic,
  Tag,
  ConfigProvider,
  theme,
} from "antd";
import { toast } from "sonner";
import axiosInstance from "../../Connection/Axios";
import ToasterHot from "../Common/ToasterHot";

function Payment_Management_page() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchData();
    fetchStats();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/payments/failed");
      console.log(response.data);
      setPayments(response.data.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get("/admin/payments/summary");
      setStats(response?.data || {});
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleReconcile = async () => {
    if (selectedRows.length === 0) return;

    try {
      await axiosInstance.post("/admin/payments/reconcile", {
        paymentIds: selectedRows.map((row) => row.orderId),
      });
      message.success("Payments reconciled successfully");
      setSelectedRows([]);
      fetchData();
      fetchStats();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to reconcile payments"
      );
    }
  };

  const showDetails = async (orderId) => {
    try {
      const response = await axiosInstance.get(
        `/admin/payments/details/${orderId}`
      );
      setPaymentDetails(response?.data?.data || null);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (text, record) => (
        <a
          onClick={() => showDetails(record.orderId)}
          className="text-blue-400 hover:underline"
        >
          {text}
        </a>
      ),
    },
    {
      title: "Customer Email",
      key: "email",
      render: (record) => record.customer?.email || "N/A",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `₹${amount}`,
    },
    {
      title: "Status",
      key: "status",
      render: (record) => {
        const status = record.status || "Unknown";
        return (
          <Tag color={status === "Failed" ? "red" : "orange"}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="relative bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-200 text-sm">
        <Admin_Navbar />

        <div className="p-6 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gray-800 text-white" bordered={false}>
              <Statistic
                title="Total Payments"
                value={stats?.total || 0}
                valueStyle={{ color: "white" }}
              />
            </Card>
            <Card className="bg-gray-800 text-white" bordered={false}>
              <Statistic
                title="Successful"
                value={stats?.success || 0}
                valueStyle={{ color: "white" }}
              />
            </Card>
            <Card className="bg-gray-800 text-white" bordered={false}>
              <Statistic
                title="Failed"
                value={stats?.failed || 0}
                valueStyle={{ color: "white" }}
              />
            </Card>
            <Card className="bg-gray-800 text-white" bordered={false}>
              <Statistic
                title="Reconciled"
                value={stats?.reconciled || 0}
                valueStyle={{ color: "white" }}
              />
            </Card>
          </div>

          <Card
            className="bg-gray-800 text-white"
            title="Failed Payments"
            extra={
              <Button
                type="primary"
                onClick={handleReconcile}
                disabled={selectedRows.length === 0}
              >
                Reconcile Selected
              </Button>
            }
          >
            <Table
              className="bg-gray-800 text-white"
              columns={columns}
              dataSource={payments}
              loading={loading}
              rowKey="_id"
              rowSelection={{
                onChange: (_, selected) => setSelectedRows(selected),
              }}
              pagination={{ pageSize: 10 }}
            />
          </Card>

          <PaymentDetailsModal
            open={!!paymentDetails}
            onClose={() => setPaymentDetails(null)}
            data={paymentDetails}
          />
        </div>
      </div>
    </ConfigProvider>
  );
}

// eslint-disable-next-line react/prop-types
const PaymentDetailsModal = ({ open, onClose, data }) => (
  <Modal
    // eslint-disable-next-line react/prop-types
    title={`Payment Details - ${data?.payment?.orderId || ""}`}
    open={open}
    onCancel={onClose}
    footer={null}
    width={800}
    className="dark:bg-gray-800 dark:text-gray-200"
    bodyStyle={{ backgroundColor: "#1f2937", color: "#f3f4f6" }}
  >
    {data ? (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Customer</h3>

            <p>{data.user?.username || "N/A"}</p>
            <p>{data.user?.email || "N/A"}</p>
          </div>
          <div>
            <h3 className="font-semibold">Payment</h3>
            <p>Amount: ₹{data.payment?.amount}</p>
            <p>Status: {data.payment?.status}</p>
          </div>
        </div>

        {data.rzpPayment && (
          <div>
            <h3 className="font-semibold">Razorpay Details</h3>
            <pre className="bg-gray-00 p-2 rounded overflow-x-auto text-xs text-white">
              {JSON.stringify(data.rzpPayment, null, 2)}
            </pre>
          </div>
        )}
      </div>
    ) : (
      <p>Loading...</p>
    )}
    <ToasterHot />
  </Modal>
);

export default Payment_Management_page;
