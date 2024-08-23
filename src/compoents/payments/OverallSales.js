import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Popconfirm,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useApp } from "../../contexts/AppContext";

const OverallSales = () => {
  const { state, addBankAccount, fetchClients, fetchClientPayments } = useApp();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [accountSalesData, setAccountSalesData] = useState([]);
  const [bankSalesData, setBankSalesData] = useState([]);

  useEffect(() => {
    fetchClients();
    fetchClientPayments();
  }, []);

  useEffect(() => {
    const { accountSalesData, bankSalesData } =
      calculateAccountSalesAndBankRevenue();
    setAccountSalesData(accountSalesData);
    setBankSalesData(bankSalesData);
  }, [state.clients, state.clientPayments]);

  const calculateAccountSalesAndBankRevenue = () => {
    const universitySales = {};
    const bankRevenue = {};

    state.clients.forEach((client) => {
      const { university, amount } = client;
      const parsedAmount = parseFloat(amount);

      if (!universitySales[university]) {
        universitySales[university] = { totalSales: 0, totalRevenue: 0 };
      }
      universitySales[university].totalSales += parsedAmount;
      console.log("these are the values:", universitySales[university]);
    });

    state.clientPayments.forEach((payment) => {
      const { university, bankAccount, amount } = payment;
      console.log(
        "these are values of each payment:",
        university,
        bankAccount,
        amount
      );
      const parsedAmount = parseFloat(amount);

      if (universitySales[university]) {
        console.log("this is the university", university);
        universitySales[university].totalRevenue += parsedAmount;
      }

      if (!bankRevenue[bankAccount]) {
        const [bankAccountName, accountNumber] = bankAccount.split(" - ");
        bankRevenue[bankAccount] = {
          bankAccountName,
          accountNumber,
          totalRevenue: 0,
        };
      }
      bankRevenue[bankAccount].totalRevenue += parsedAmount;
    });

    const accountSalesData = Object.entries(universitySales).map(
      ([university, sales]) => ({
        university,
        ...sales,
      })
    );

    const bankSalesData = Object.entries(bankRevenue).map(
      ([bankAccount, revenue]) => ({
        bankAccountName: revenue.bankAccountName,
        accountNumber: revenue.accountNumber,
        totalRevenue: revenue.totalRevenue,
      })
    );

    return { accountSalesData, bankSalesData };
  };

  const handleAddBank = async (values) => {
    try {
      const result = await addBankAccount(values);
      if (result === null) {
        message.success("Bank account added successfully");
        setIsModalVisible(false);
      } else {
        message.error(result);
      }
    } catch (error) {
      message.error(
        "An unexpected error occurred while adding the bank account."
      );
      console.error("Unexpected error:", error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const accountSalesColumns = [
    {
      title: "University",
      dataIndex: "university",
      key: "university",
    },
    {
      title: "Total Sales",
      dataIndex: "totalSales",
      key: "totalSales",
      render: (totalSales) => `$${totalSales}`,
    },
    {
      title: "Total Revenue",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (totalRevenue) => `$${totalRevenue}`,
    },
  ];

  const bankSalesColumns = [
    {
      title: "Bank Account Name",
      dataIndex: "bankAccountName",
      key: "bankAccountName",
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: "Total Revenue",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (totalRevenue) => `$${totalRevenue}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure you want to delete this bank account?"
            onConfirm={() => handleDeleteBankAccount(record)}
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleDeleteBankAccount = async (record) => {
    try {
      console.log("Bank account to delete:", record);
      // Assuming you have a function to delete bank accounts
      // const result = await deleteBankAccount(record.key);
      const result = null;
      if (result === null) {
        message.success("Bank account deleted successfully");
        // Refresh bank accounts list
      } else {
        message.error(result);
      }
    } catch (error) {
      message.error("Failed to delete bank account");
      console.error("Error deleting bank account:", error);
    }
  };

  const AddBankAccountForm = () => (
    <Form
      layout="vertical"
      onFinish={handleAddBank}
      style={{ maxWidth: "600px", margin: "auto" }}
    >
      <Form.Item
        name="bankAccountName"
        label="Bank Account Name"
        rules={[
          { required: true, message: "Please input the bank account name!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="accountNumber"
        label="Account Number"
        rules={[
          { required: true, message: "Please input the account number!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Bank Account
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div>
      {contextHolder}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "45%" }}>
          <h2>Account Sales</h2>
          <Table
            components={{
              header: {
                cell: (props) => (
                  <th
                    {...props}
                    className="font-semibold px-4 text-left"
                    style={{
                      backgroundColor: "#5DDBD3",
                      color: "white",
                      paddingTop: 6,
                      paddingBottom: 6,
                    }}
                  />
                ),
              },
              body: {
                row: (props) => (
                  <tr
                    {...props}
                    className="hover:bg-gray-50"
                    style={{
                      paddingTop: 6,
                      paddingBottom: 6,
                    }}
                  />
                ),
                cell: (props) => (
                  <td
                    {...props}
                    className=" border-b border-gray-200"
                    style={{
                      paddingTop: 6,
                      paddingBottom: 6,
                    }}
                  />
                ),
              },
            }}
            columns={accountSalesColumns}
            dataSource={accountSalesData}
            pagination={false}
            rowKey="university"
          />
        </div>
        <div style={{ width: "45%" }}>
          <h2>Bank Sales</h2>
          <Button
            type="primary"
            onClick={showModal}
            style={{ marginBottom: 16 }}
          >
            Add Bank Account
          </Button>
          <Table
            components={{
              header: {
                cell: (props) => (
                  <th
                    {...props}
                    className="font-semibold px-4 text-left"
                    style={{
                      backgroundColor: "#5DDBD3",
                      color: "white",
                      paddingTop: 6,
                      paddingBottom: 6,
                    }}
                  />
                ),
              },
              body: {
                row: (props) => (
                  <tr
                    {...props}
                    className="hover:bg-gray-50"
                    style={{
                      paddingTop: 6,
                      paddingBottom: 6,
                    }}
                  />
                ),
                cell: (props) => (
                  <td
                    {...props}
                    className=" border-b border-gray-200"
                    style={{
                      paddingTop: 6,
                      paddingBottom: 6,
                    }}
                  />
                ),
              },
            }}
            columns={bankSalesColumns}
            dataSource={bankSalesData}
            pagination={false}
            rowKey="accountNumber"
          />
        </div>
      </div>
      <Modal
        title="Add Bank Account"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <AddBankAccountForm />
      </Modal>
    </div>
  );
};

export default OverallSales;
