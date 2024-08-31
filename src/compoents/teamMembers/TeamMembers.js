import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useApp } from "../../contexts/AppContext";
import {
  Table,
  Button,
  Input,
  Space,
  Typography,
  Popconfirm,
  message,
  Form,
  Avatar,
  AutoComplete,
  Modal,
  Select,
  Switch,
  Card,
} from "antd";
import {
  EditOutlined,
  ScheduleOutlined,
  UserAddOutlined,
  StopOutlined,
  PlaySquareOutlined,
  UserOutlined,
  SearchOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CloseOutlined,
} from "@ant-design/icons";
import "./teamMembers.scss";

const { Text } = Typography;
const { Option } = Select;

function TeamMembers() {
  const {
    fetchTeam,
    state,
    activateTeam,
    suspendTeam,
    addTeamMember,
    editTeam,
  } = useApp();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTeam, setFilteredTeam] = useState([]);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  useEffect(() => {
    const getTeam = async () => {
      await fetchTeam();
    };

    getTeam();
  }, []);

  const Title = Typography;

  const handleSuspend = async (record) => {
    let result;
    if (record.suspend) {
      result = await activateTeam(record.id);
    } else {
      result = await suspendTeam(record.id);
    }

    if (result.success) {
      messageApi.open({
        type: "success",
        content: result.message,
      });
    } else {
      messageApi.open({
        type: "error",
        content: result.message,
      });
    }
  };

  const handleAddTeam = () => {
    setIsModalVisible(true);
  };

  const onFinish = async (values, form) => {
    try {
      const newValues = { ...values, suspend: false };
      console.log("the values of adding team:", newValues);

      const result = await addTeamMember(newValues);
      if (result === null) {
        messageApi.open({
          type: "success",
          content: "Team member added successfully",
        });
        setIsModalVisible(false);
      } else {
        messageApi.open({
          type: "error",
          content: result,
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "An unexpected error occurred while adding the team member.",
      });
      console.error("Unexpected error:", error);
    }
  };

  const AddTeamMember = () => (
    <div
      style={{
        height: "618px",
        overflowY: "auto",
        padding: "0 24px 24px 24px",
      }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 24 }}
        >
          <Avatar
            size={64}
            icon={<UserOutlined />}
            style={{ marginRight: 16 }}
          />
          <Space size={8}>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[
                { required: true, message: "Please input the first name!" },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input placeholder="Type First Name" />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              style={{ marginBottom: 0 }}
            >
              <Input placeholder="Type Last Name" />
            </Form.Item>
          </Space>
        </div>

        <Form.Item name="contact" label="Contact">
          <Input placeholder="Type Contact" />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          rules={[{ required: true, message: "Please input the email!" }]}
        >
          <Input placeholder="Type E-Mail" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please input the password!" }]}
        >
          <Input.Password placeholder="Input Password" />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select the role!" }]}
        >
          <Select placeholder="Select Role">
            <Option value="Manager">Manager</Option>
            <Option value="Sr. Team Lead">Sr. Team Lead</Option>
            <Option value="Jr. Team Lead">Jr. Team Lead</Option>
            <Option value="Coordinator">Coordinator</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="team"
          label="Team"
          rules={[{ required: true, message: "Please select the team!" }]}
        >
          <Select placeholder="Select Team">
            <Option value="Alpha">Alpha</Option>
            <Option value="Beta">Beta</Option>
            <Option value="Gamma">Gamma</Option>
            <Option value="Delta">Delta</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button onClick={() => form.resetFields()}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Add Team Member
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredTeam(state.teamMembers);
    } else {
      const filtered = state.teamMembers.filter(
        (member) =>
          member.firstName.toLowerCase().includes(query) ||
          member.lastName.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query)
      );
      setFilteredTeam(filtered);
    }
  };

  const onEditFinish = async (values) => {
    try {
      // Get the changed fields using lodash
      const updatedFields = _.omitBy(
        values,
        (value, key) => value === currentRecord[key]
      );

      // Only call the update function if there are changes
      if (!_.isEmpty(updatedFields)) {
        const result = await editTeam(currentRecord.id, updatedFields);
        if (result.success) {
          messageApi.open({
            type: "success",
            content: "Team member edited successfully",
          });
          setIsEditModalVisible(false);
        } else {
          messageApi.open({
            type: "error",
            content: result.message,
          });
        }
      } else {
        messageApi.open({
          type: "info",
          content: "No changes detected.",
        });
        setIsEditModalVisible(false);
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "An unexpected error occurred while editing the team member.",
      });
      console.error("Unexpected error:", error);
    }
  };

  const handleEdit = (record) => {
    setCurrentRecord(record);
    editForm.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const EditTeamMember = () => (
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
            Add Team Member
          </Title>
          <Button type="text" icon={<CloseOutlined />} />
        </div>
      }
      style={{ width: 500 }}
    >
      <Form form={form} layout="vertical" onFinish={onEditFinish}>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 24 }}
        >
          <Avatar
            size={64}
            icon={<UserOutlined />}
            style={{ marginRight: 16 }}
          />
          <Space size={8}>
            <Form.Item
              name="firstName"
              label={<span style={{ color: "#ff4d4f" }}>* First Name</span>}
              rules={[
                { required: true, message: "Please input the first name!" },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input placeholder="Type First Name" />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              style={{ marginBottom: 0 }}
            >
              <Input placeholder="Type Last Name" />
            </Form.Item>
          </Space>
        </div>

        <Form.Item name="contact" label="Contact">
          <Input placeholder="Type Contact" />
        </Form.Item>

        <Form.Item
          name="email"
          label={<span style={{ color: "#ff4d4f" }}>* E-mail</span>}
          rules={[{ required: true, message: "Please input the email!" }]}
        >
          <Input placeholder="Type E-Mail" />
        </Form.Item>

        <Form.Item
          name="password"
          label={<span style={{ color: "#ff4d4f" }}>* Password</span>}
          rules={[{ required: true, message: "Please input the password!" }]}
        >
          <Input.Password
            placeholder="Input Password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item
          name="role"
          label={<span style={{ color: "#ff4d4f" }}>* Role</span>}
          rules={[{ required: true, message: "Please select the role!" }]}
        >
          <Select placeholder="Select Role">
            <Option value="Manager">Manager</Option>
            <Option value="Sr. Team Lead">Sr. Team Lead</Option>
            <Option value="Jr. Team Lead">Jr. Team Lead</Option>
            <Option value="Coordinator">Coordinator</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="team"
          label={<span style={{ color: "#ff4d4f" }}>* Team</span>}
          rules={[{ required: true, message: "Please select the team!" }]}
        >
          <Select placeholder="Select Team">
            <Option value="Alpha">Alpha</Option>
            <Option value="Beta">Beta</Option>
            <Option value="Gamma">Gamma</Option>
            <Option value="Delta">Delta</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Add Team Member
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
    },
    {
      title: "Contact",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Team",
      dataIndex: "team",
      key: "team",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="small">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          {record.suspend ? (
            <Button
              icon={<PlaySquareOutlined />}
              onClick={() => handleSuspend(record)}
            />
          ) : (
            <Popconfirm
              title="Are you sure you want to suspend this team member?"
              onConfirm={() => handleSuspend(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button icon={<StopOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
    {
      title: "Log",
      key: "log",
      render: (text, record) => <Button icon={<ScheduleOutlined />} />,
    },
  ];

  return (
    <div>
      {contextHolder}
      {/* <div className="team-header">
        <div className="search-section">
          <Input.Search
            placeholder="Search"
            style={{ width: 200 }}
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="add-button">
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleAddTeam}
          >
            Add Team Member
          </Button>
        </div>




      </div> */}

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-3xl font-medium">Team Database</span>
            <span className="text-gray-200">|</span>
          </div>

          <div className="flex justify-end">
            <Input
              placeholder="Search by Assignee or Client Name"
              suffix={
                <div className="border-l-2 p-1">
                  <SearchOutlined />
                </div>
              }
              className="w-[270px] p-0 rounded-none px-2 border-gray-300"
            />
          </div>
        </div>

        <hr />

        <div className="flex justify-between items-center mb-4">
          <div className="start-item  flex items-center space-x-2">
            <Select
              defaultValue="none"
              style={{ width: 120 }}
              className="border-gray-300"
            >
              <Option value="none">Filter By: None</Option>
            </Select>
            <Button className="border-gray-300" />
          </div>
          <Button
            icon={<UserOutlined />}
            suffix={<UserOutlined />}
            className="border-gray-300"
            onClick={handleAddTeam}
          >
            Add Team Member
          </Button>
        </div>
      </div>

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
        columns={columns}
        dataSource={searchQuery ? filteredTeam : state.teamMembers}
        rowKey="id"
      />
      <Modal
        title="Add Team Member"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        bodyStyle={{
          padding: "40px 0px 0px 0px",
          borderRadius: "16px 0px 0px 0px",
          border: "2px solid #f0f0f0",
          borderBottom: "none",
          borderRight: "none",
        }}
      >
        <AddTeamMember />
      </Modal>
      <Modal
        title="Edit Team Member"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        centered
      >
        <EditTeamMember />
      </Modal>
    </div>
  );
}

export default TeamMembers;
