import React from "react";
import {
  Form,
  Input,
  Button,
  Select,
  AutoComplete,
  Card,
  Typography,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useApp } from "../../contexts/AppContext";

const { Option } = Select;
const { Title } = Typography;

function AddClient({ onResult, onClose }) {
  const { addClient, state } = useApp();
  const [form] = Form.useForm();

  const universityOptions = state.universities.map((university) => ({
    value: `${university.id}-${university.name}`,
    label: university.name,
  }));

  const onFinish = async (values) => {
    const [universityId, universityName] = values.university.split("-");
    const data = {
      ...values,
      suspend: false,
      universityId,
    };
    console.log("Form data:", data);

    try {
      const result = await addClient(data);
      onResult(result);
    } catch (error) {
      onResult("An unexpected error occurred while adding the client.");
      console.error("Unexpected error:", error);
    }
  };

  return (
    <Card
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Add Client
          </Title>
          <CloseOutlined onClick={onClose} style={{ cursor: "pointer" }} />
        </div>
      }
      bodyStyle={{
        maxHeight: "calc(100vh - 200px)",
        overflowY: "auto",
        paddingRight: "20px",
      }}
      style={{ width: 400, margin: "auto" }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label={
            <span style={{ color: "black" }}>
              Name <span style={{ color: "red" }}>*</span>
            </span>
          }
          rules={[{ required: true, message: "Please input the client name!" }]}
        >
          <Input placeholder="Type Client Name" />
        </Form.Item>

        <Form.Item
          name="contact"
          label={
            <span style={{ color: "black" }}>
              Contact <span style={{ color: "red" }}>*</span>
            </span>
          }
          rules={[{ required: true, message: "Please input contact details!" }]}
        >
          <Input placeholder="Type Contact Details" />
        </Form.Item>

        <Form.Item
          name="university"
          label={
            <span style={{ color: "black" }}>
              University <span style={{ color: "red" }}>*</span>
            </span>
          }
          rules={[{ required: true, message: "Please select a university!" }]}
        >
          <AutoComplete
            options={universityOptions}
            placeholder="Select University"
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          />
        </Form.Item>

        <Form.Item
          name="username"
          label={<span style={{ color: "black" }}>Username</span>}
        >
          <Input placeholder="Type Username" />
        </Form.Item>

        <Form.Item
          name="password"
          label={<span style={{ color: "black" }}>Password</span>}
        >
          <Input.Password placeholder="Type Password" />
        </Form.Item>

        <Form.Item
          name="amount"
          label={
            <span style={{ color: "black" }}>
              Amount <span style={{ color: "red" }}>*</span>
            </span>
          }
          rules={[
            { required: true, message: "Please input the payment amount!" },
          ]}
          style={{
            display: "inline-block",
            width: "calc(50% - 8px)",
            marginRight: "16px",
          }}
        >
          <Input placeholder="Type Payment Amount" />
        </Form.Item>

        <Form.Item
          name="currency"
          label={
            <span style={{ color: "black" }}>
              Currency <span style={{ color: "red" }}>*</span>
            </span>
          }
          rules={[{ required: true, message: "Please select a currency!" }]}
          style={{ display: "inline-block", width: "calc(50% - 8px)" }}
        >
          <Select placeholder="Select Currency">
            <Option value="USD">USD</Option>
            <Option value="EUR">EUR</Option>
            <Option value="GBP">GBP</Option>
            <Option value="INR">INR</Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button onClick={onClose} style={{ marginRight: "10px" }}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#5BD8A6", borderColor: "#5BD8A6" }}
          >
            Add Client
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default AddClient;
