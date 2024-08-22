import React, { useState, useEffect } from "react";
import { Menu, Input, Button, List, Badge, Modal, Form, message } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  FileOutlined,
  DollarOutlined,
  SettingOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import companyLogo from "../../assets/HeaderLogo.jpg";
import { useApp } from "../../contexts/AppContext";
import { GraduationCap, MonitorSmartphone } from "lucide-react";
import './sideBar.scss';
function SideBar({ onMenuClick }) {
  const { addSheet, state, setActiveSheet } = useApp();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    console.log(state.weeks);
    console.log(state.activeSheet);
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const items = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "addClient",
      icon: <UserOutlined />,
      icon2: <PlusOutlined />,
      label: "Add Client",
    },
    {
      key: "tasks",
      label: "Tasks",
      icon: <FileOutlined />,
      children: [
        {
          key: "overallTasks",
          label: "Overall Tasks",
        },
        {
          key: "extraProjects",
          label: "Extra Projects",
        },
      ],
    },
    {
      key: "payments",
      label: "Payments",
      icon: <DollarOutlined />,
      children: [
        {
          key: "clientSales",
          label: "Client Sales",
        },
        {
          key: "clientPaymentLog",
          label: "Client Payment Log",
        },
        {
          key: "extraProjectSales",
          label: "Extra Project Sales",
        },
        {
          key: "extraProjectLog",
          label: "Extra Project Log",
        },
        {
          key: "overallSales",
          label: "Overall Sales",
        },
      ],
    },
    {
      key: "manage",
      label: "Manage",
      icon: <SettingOutlined />,
      children: [
        {
          key: "team",
          label: "Team",
        },
        {
          key: "clients",
          label: "Clients",
        },
        {
          key: "universities",
          label: "Universities",
        },
      ],
    },
  ];

  const handleWeekClick = async (id) => {
    await setActiveSheet(id);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const sheetName = values.name;
      console.log("this is the subject name:", sheetName);
      const result = await addSheet(sheetName);
      if (result === null) {
        messageApi.success(`Sheet added and sheet set to '${sheetName}'`);
        setIsModalVisible(false);
        form.resetFields();
      } else {
        messageApi.error(result);
      }
    } catch (errorInfo) {
      console.error("Failed to save sheet:", errorInfo);
    }
  };

  const ADDSHEET = () => (
    <Form form={form} layout="vertical">
      <Form.Item
        name="name"
        label="Sheet Name"
        rules={[{ required: true, message: "Please input the sheet name!" }]}
      >
        <Input placeholder="Enter sheet name" />
      </Form.Item>
    </Form>
  );

  const [searchTerm, setSearchTerm] = useState("");

  const handleMenuClick = (e) => {
    onMenuClick(e.key);
  };

  return (
    <>

      <div
        className="sidebar"
        style={{
          width: "250px",
          backgroundColor: "#ffffff",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          rowGap: "10px",
        }}
      >
        <div className="logo">
          <img className="company-logo" src={companyLogo} alt="Company Logo" />
          <div className="company-name">
            <div className="company-subtext">Tutorsquest</div>
            <div className="company-maintext">TaskTracker</div>
          </div>
        </div>
        {contextHolder}
        <Menu
          theme="light"
          defaultSelectedKeys={["home"]}
          mode="inline"
          items={items}
          onClick={handleMenuClick}
          style={{ border: "none" }}
        />
        {/* <div
          className="sheet-list"
          style={{ marginTop: "auto", padding: "16px" }}
        >
          <Input
            placeholder="Search Sheets"
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
          <List
            dataSource={state.weeks}
            renderItem={(item) => (
              <List.Item
                onClick={() => handleWeekClick(item.id)}
                style={{ padding: "8px 0", cursor: "pointer" }}
              >
                <List.Item.Meta
                  title={item.name}
                  description={
                    <Badge
                      status={
                        item.id === state.activeSheet ? "success" : "default"
                      }
                      style={{ marginRight: "8px" }}
                    />
                  }
                />
              </List.Item>
            )}
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              marginBottom: "10px",
            }}
          />
        </div> */}

        <Modal
          title="ADD SHEET NAME"
          open={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="save" type="primary" onClick={handleSave}>
              Save
            </Button>,
          ]}
        >
          <ADDSHEET />
        </Modal>
      </div>
    </>
  );
}

export default SideBar;
