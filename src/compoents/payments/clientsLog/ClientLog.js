import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  AutoComplete,
  message,
  Space,
  Popconfirm,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import moment from "moment";
import { useApp } from "../../../contexts/AppContext";

const { Option } = Select;

function ClientLog() {
  const {
    state,
    addClientPayment,
    fetchClientPayments,
    deleteClientPayment,
    addTransactionId,
  } = useApp();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const universityOptions = state.universities.map((university) => ({
    value: `${university.id}-${university.name}`,
    label: university.name,
  }));

  useEffect(() => {
    fetchClientPayments();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddPayment = async (values) => {
    const [universityId, universityName] = values.university.split("-");
    const clientUsernameId = `${universityId}-${values.username}`;

    if (!state.clients.some((client) => client.id === clientUsernameId)) {
      message.error(`No client exists with username: ${values.username}`);
      return;
    }
    const newPayment = {
      ...values,
      clientId: clientUsernameId,
      transactionId: values.transactionId || "",
      status: "unverified",
      type: "client",
    };
    console.log("the data being added :", newPayment);

    try {
      const result = await addClientPayment(newPayment);
      if (result === null) {
        message.success("Payment added successfully");
        setIsModalVisible(false);
      } else {
        message.error(result);
      }
    } catch (error) {
      message.error("An unexpected error occurred while adding the payment.");
      console.error("Unexpected error:", error);
    }
  };

  const AddPayment = () => (
    <Form
      layout="vertical"
      onFinish={handleAddPayment}
      style={{ maxWidth: "600px", margin: "auto" }}
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: "Please input the username!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="university"
        label="University"
        rules={[{ required: true, message: "Please select a university!" }]}
      >
        <AutoComplete
          options={universityOptions}
          placeholder="Select University"
          filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />
      </Form.Item>
      <Form.Item
        name="amount"
        label="Amount"
        rules={[{ required: true, message: "Please input the amount!" }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        name="currency"
        label="Currency"
        rules={[{ required: true, message: "Please select a currency!" }]}
      >
        <Select placeholder="Select Currency">
          <Option value="USD">USD</Option>
          <Option value="EUR">EUR</Option>
          <Option value="GBP">GBP</Option>
          <Option value="INR">INR</Option>
        </Select>
      </Form.Item>
      <Form.Item name="transactionId" label="Transaction ID">
        <Input />
      </Form.Item>
      <Form.Item
        name="bankAccount"
        label="Bank Account"
        rules={[{ required: true, message: "Please select the bank account!" }]}
      >
        <Select>
          <Option value="ICICI - 0769">ICICI - 0769</Option>
          <Option value="Citibank - 1234">Citibank - 1234</Option>
          <Option value="Chase - 5678">Chase - 5678</Option>
          <Option value="Bank of America - 9101">Bank of America - 9101</Option>
        </Select>
      </Form.Item>
      <Form.Item name="note" label="Note">
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Payment
        </Button>
      </Form.Item>
    </Form>
  );

  const handleDelete = async (record) => {
    try {
      console.log("these are the record values:", record);
      const result = await deleteClientPayment(record);
      if (result === null) {
        messageApi.open({
          type: "success",
          content: "Subject deleted successfully",
        });
      } else {
        message.error(result);
      }
    } catch (error) {
      message.error("Failed to delete payment");
      console.error("Error deleting payment:", error);
    }
  };

  const showVerifyModal = (record) => {
    setSelectedRecord(record);
    setIsVerifyModalVisible(true);
  };

  const handleVerifyCancel = () => {
    setIsVerifyModalVisible(false);
  };

  const handleVerify = async (values) => {
    try {
      console.log("this is the transactionId:", values);
      const result = await addTransactionId(
        selectedRecord.id,
        selectedRecord.type,
        values.transactionId
      );
      if (result === null) {
        message.success("Payment verified successfully");
        setIsVerifyModalVisible(false);
      } else {
        message.error(result);
      }
    } catch (error) {
      message.error("Failed to verify payment");
      console.error("Error verifying payment:", error);
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp) => moment(timestamp).format("DD/MM/YYYY, hh:mm A"), // Formatting timestamp for display
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "University",
      dataIndex: "university",
      key: "university",
    },
    {
      title: "Bank Account",
      dataIndex: "bankAccount",
      key: "bankAccount",
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
    },
    {
      title: "Paid",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Are you sure you want to delete this payment?"
            onConfirm={() => handleDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
          <Button
            style={{ color: "#13C2C2" }}
            disabled={record.status === "verified"}
            onClick={() => showVerifyModal(record)}
            size="small"
          >
            {record.status === "verified" ? "Verified" : "Verify"}
          </Button>
        </Space>
      ),
    },
  ];

  const VerifyPayment = () => (
    <Form
      layout="vertical"
      onFinish={handleVerify}
      style={{ maxWidth: "600px", margin: "auto" }}
    >
      <Form.Item
        name="transactionId"
        label="Transaction ID"
        rules={[
          { required: true, message: "Please input the transaction ID!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Verify
        </Button>
      </Form.Item>
    </Form>
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPayments = state.clientPayments.filter((payment) =>
    payment.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {contextHolder}
      <div className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-300">
        <h1 className="text-2xl font-bold">Client Sales</h1>
        <div className="relative w-64">
          <Input.Search
            placeholder="Search by username"
            style={{ width: 200 }}
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      <hr />

      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={showModal}>
          Add Payment
        </Button>
      </Space>
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
        dataSource={searchQuery ? filteredPayments : state.clientPayments}
        columns={columns}
        style={{ marginTop: 20 }}
      />
      <Modal
        title="Add Payment"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <AddPayment />
      </Modal>
      <Modal
        title="Verify Payment"
        open={isVerifyModalVisible}
        onCancel={handleVerifyCancel}
        footer={null}
      >
        <VerifyPayment />
      </Modal>
    </div>
  );
}

export default ClientLog;
