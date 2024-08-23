import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Switch,
  Space,
  Form,
  Modal,
  message,
  AutoComplete,
  Popconfirm,
  Divider,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DeleteFilled,
  UserOutlined,
  CheckCircleOutlined,
  UpOutlined,
  DownOutlined,
  FilterOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import "./university.scss";
import { useApp } from "../../contexts/AppContext";

const { Option } = Select;

function Univeristy() {
  const {
    fetchUniversities,
    fetchSubjects,
    state,
    addUniversity,
    addSubject,
    deleteUniversity,
    editUniversity,
    editSubject,
    deleteSubject,
  } = useApp();
  const [showCompleted, setShowCompleted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubjectModalVisible, setIsSubjectModalVisible] = useState(false);
  const [error, setError] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [currentUniversity, setCurrentUniversity] = useState(null);
  const [editRowKey, setEditRowKey] = useState("");
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [editSubjectRowKey, setEditSubjectRowKey] = useState("");
  const [subjects, setSubjects] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const getUniversities = async () => {
      await fetchUniversities();
      await fetchSubjects();
      // console.log(state.universities); // Logging universities data
      // console.log(state.subjects); // Logging universities data
    };

    getUniversities();
  }, []);

  // const universitiesWithKey = state.universities.map(university => ({
  //     ...university,
  //     key: university.id,
  // }));

  const handleAddUniversity = () => {
    setIsModalVisible(true);
  };

  const onFinish = async (values) => {
    console.log("Form values: ", values);
    const universityData = {
      ...values,
      status: "active",
    };
    console.log("University data with status: ", universityData);

    const response = await addUniversity(universityData);

    if (response === null) {
      console.log("Document added: ", values);
      setIsModalVisible(false);
      setError("");
    } else if (response === "A university with this name already exists.") {
      setError("A university with this name already exists.");
      messageApi.open({
        type: "warning",
        content: "A university with this name already exists.",
      });
    } else {
      setError(response);
      messageApi.open({
        type: "error",
        content: response,
      });
    }
  };

  const AddUniversityForm = () => (
    <Form
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: "600px", margin: "auto" }}
    >
      <Form.Item>
        <p style={{ color: "grey" }}>
          Please Provide a Unique ID, ID cannot be edited once added.
        </p>
      </Form.Item>
      <Divider />

      <Form.Item
        name="id"
        label="Univerisity Id"
        rules={[
          { required: true, message: "Please input the university name!" },
        ]}
      >
        <Input placeholder="Please enter unique id" />
      </Form.Item>
      <Form.Item
        name="name"
        label="Univerisity Name"
        rules={[
          { required: true, message: "Please input the university name!" },
        ]}
      >
        <Input placeholder="Type University Name" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add University
        </Button>
      </Form.Item>
    </Form>
  );

  const handleUniDelete = async (record) => {
    await deleteUniversity(record);
  };

  const isEditing = (record) => record.key === editRowKey;

  const handleEdit = (record) => {
    //used for editing "main function in the table"
    console.log("the row being edited:", record);
    form.setFieldsValue({
      name: "",
      id: "",
      ...record,
    });
    setEditRowKey(record.key);
  };

  const handleCancel = () => {
    setEditRowKey("");
  };

  const handleSave = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...state.universities];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        const updatedItem = { ...item, ...row };
        newData.splice(index, 1, updatedItem);

        // Call editUniversity to update the database and dispatch the update
        await editUniversity(key, updatedItem);

        setEditRowKey("");
      } else {
        newData.push(row);
        setEditRowKey("");
      }
    } catch (err) {
      console.log("Validate Failed:", err);
    }
  };

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const handleSubject = (record) => {
    setCurrentUniversity(record.id);
    setIsSubjectModalVisible(true);
  };

  const onFinishSubject = async (values) => {
    //adds the subject data under
    const subjectData = {
      ...values,
      universityId: currentUniversity,
      status: "incomplete",
    };
    console.log("Subject form values:", subjectData);
    const response = await addSubject(subjectData);
    console.log("Subject form values after adding:", subjectData);

    if (response === null) {
      console.log("Document added: ", subjectData);
      setIsModalVisible(false);
      setError("");
    } else if (response === "A subject with this name already exists.") {
      setError("A subject with this name already exists.");
      messageApi.open({
        type: "warning",
        content: "A subject with this name already exists.",
      });
    } else {
      setError(response);
      messageApi.open({
        type: "error",
        content: response,
      });
    }
    console.log("these are the final subjects:", state.subjects);
    setIsSubjectModalVisible(false);
  };

  const AddSubjectForm = () => (
    <Form
      layout="vertical"
      onFinish={onFinishSubject}
      style={{ maxWidth: "600px", margin: "auto" }}
    >
      <Form.Item
        name="name"
        label="Subject Name"
        rules={[{ required: true, message: "Please input the subject name!" }]}
      >
        <Input placeholder="Type Subject Name" />
      </Form.Item>
      <Form.Item
        name="code"
        label="Subject Code"
        rules={[{ required: true, message: "Please input the subject code!" }]}
      >
        <Input placeholder="Type Subject Code" />
      </Form.Item>
      <Form.Item
        name="professor"
        label="Professor"
        rules={[
          { required: true, message: "Please input the professor name!" },
        ]}
      >
        <Input placeholder="Type Professor Name" />
      </Form.Item>
      <Form.Item
        name="note"
        label="Note"
        rules={[{ required: true, message: "Please input the note!" }]}
      >
        <Input placeholder="Type Note" />
      </Form.Item>
      <Form.Item
        name="deadlines"
        label="Deadlines"
        rules={[
          { required: true, message: "Please select the deadlines option!" },
        ]}
      >
        <AutoComplete
          options={[
            { value: "Open to Extensions" },
            { value: "Reasonable Extensions" },
            { value: "No Extensions" },
          ]}
          placeholder="Select Deadlines Option"
        />
      </Form.Item>
      <Form.Item
        name="replies"
        label="Replies"
        rules={[
          { required: true, message: "Please select the replies option!" },
        ]}
      >
        <AutoComplete
          options={[{ value: "Same Day" }, { value: "Different Day" }]}
          placeholder="Select Replies Option"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Subject
        </Button>
      </Form.Item>
    </Form>
  );

  const columns = [
    {
      title: "University Id",
      dataIndex: "id",
      key: "id",
      editable: false,
    },
    {
      title: "University Name",
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const editable = isEditing(record);
        return state.universities.length >= 1 ? (
          <Space>
            <Popconfirm
              title="Are you sure you want to delete?"
              onConfirm={() => handleUniDelete(record)}
            >
              <Button danger icon={<DeleteFilled />} disabled={editable} />
            </Popconfirm>
            {editable ? (
              <span>
                <Space size="middle">
                  <Button
                    onClick={() => handleSave(record.key)}
                    type="primary"
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </Button>
                  <Popconfirm
                    title="Are you sure you want to cancel?"
                    onConfirm={handleCancel}
                  >
                    <Button>Cancel</Button>
                  </Popconfirm>
                </Space>
              </span>
            ) : (
              <Button
                onClick={() => handleEdit(record)}
                icon={<EditOutlined />}
              />
            )}
            <Button
              icon={<PlusOutlined />}
              onClick={() => handleSubject(record)}
            >
              Add Subject
            </Button>
          </Space>
        ) : null;
      },
    },
  ];

  const showNoteModal = (note) => {
    setNoteContent(note);
    setIsNoteModalVisible(true);
  };
  const handleNoteModalCancel = () => {
    setIsNoteModalVisible(false);
    setNoteContent("");
  };

  const isSubjectEditing = (record) => record.key === editSubjectRowKey;

  const handleSubjectEdit = (record) => {
    form.setFieldsValue({
      name: "",
      code: "",
      professor: "",
      deadlines: "",
      replies: "",
      ...record,
    });
    setEditSubjectRowKey(record.key);
  };

  const handleSubjectCancel = () => {
    setEditSubjectRowKey("");
  };

  const handleSubjectSave = async (key) => {
    console.log("the key of editing subject is ", key);
    try {
      const row = await form.validateFields();
      const newData = [...state.subjects];
      console.log("these are subjects", newData);
      const index = newData.findIndex((item) => key === item.key);
      console.log("this is the index of the key", index);
      if (index > -1) {
        console.log("starting the update", index);
        const item = newData[index];
        const updatedItem = { ...item, ...row };
        newData.splice(index, 1, updatedItem);

        await editSubject(key, updatedItem);

        setEditSubjectRowKey("");
      } else {
        newData.push(row);
        setEditSubjectRowKey("");
      }
    } catch (err) {
      console.log("Validate Failed:", err);
    }
  };

  const handleSubjectDelete = async (record) => {
    await deleteSubject(record);
    messageApi.open({
      type: "success",
      content: "Subject deleted successfully",
    });
  };

  const subjectColumns = [
    { title: "Subject", dataIndex: "name", key: "name", editable: true },
    { title: "Subject Code", dataIndex: "code", key: "code", editable: true },
    {
      title: "Professor",
      dataIndex: "professor",
      key: "professor",
      editable: true,
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => showNoteModal(record.note)}
          icon={<FileTextOutlined />}
        />
      ),
    },
    {
      title: "Deadlines",
      dataIndex: "deadlines",
      key: "deadlines",
      editable: true,
    },
    { title: "Replies", dataIndex: "replies", key: "replies", editable: true },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const editable = isSubjectEditing(record);
        return state.subjects.length >= 1 ? (
          <Space>
            <Popconfirm
              title="Are you sure you want to delete?"
              onConfirm={() => handleSubjectDelete(record)}
            >
              <Button danger icon={<DeleteFilled />} disabled={editable} />
            </Popconfirm>
            {editable ? (
              <span>
                <Space size="middle">
                  <Button
                    onClick={() => handleSubjectSave(record.key)}
                    type="primary"
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </Button>
                  <Popconfirm
                    title="Are you sure you want to cancel?"
                    onConfirm={handleSubjectCancel}
                  >
                    <Button>Cancel</Button>
                  </Popconfirm>
                </Space>
              </span>
            ) : (
              <Button
                onClick={() => handleSubjectEdit(record)}
                icon={<EditOutlined />}
              />
            )}
          </Space>
        ) : null;
      },
    },
  ];
  const mergedSubjectColumns = subjectColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isSubjectEditing(record),
      }),
    };
  });

  const expandedRowRender = (record) => {
    console.log("the row being expanded", record.name); // Debugging log
    const universitySubjects = state.subjects
      .filter((subject) => subject.universityId === record.id)
      .map((subject) => ({
        ...subject,
        key: subject.id,
      }));
    // setSubjects(universitySubjects);

    return (
      <Form form={form} component={false}>
        <Table
          columns={mergedSubjectColumns}
          dataSource={universitySubjects}
          pagination={false}
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
                  className="border-b border-gray-200"
                  style={{
                    paddingTop: 6,
                    paddingBottom: 6,
                  }}
                />
              ),
            },
          }}
          size="small"
        />
      </Form>
    );
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div>
      {contextHolder}

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-3xl font-medium">Universities</span>
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
            <Button
              icon={<UserOutlined />}
              suffix={<UserOutlined />}
              className="border-gray-300"
            >
              Assignees
            </Button>
            <Select
              defaultValue="none"
              style={{ width: 120 }}
              className="border-gray-300"
            >
              <Option value="none">Filter By: None</Option>
            </Select>
            <Button icon={<FilterOutlined />} className="border-gray-300" />
          </div>
          <Select
            defaultValue="allTasks"
            style={{ width: 120 }}
            className="border-gray-300 end-item"
          >
            <Option value="allTasks">All Tasks</Option>
          </Select>
        </div>
      </div>

      <Form form={form} component={false}>
        <Table
          dataSource={state.universities}
          columns={mergedColumns}
          pagination={false}
          expandable={{
            expandedRowRender,
            defaultExpandedRowKeys: ["0"],
          }}
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
                  className="border-b border-gray-200"
                  style={{
                    paddingTop: 6,
                    paddingBottom: 6,
                  }}
                />
              ),
            },
          }}
          size="small"
        />
      </Form>
      <Modal
        title="Add University"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <AddUniversityForm />
      </Modal>
      <Modal
        title={`Add Subject in ${currentUniversity}`}
        visible={isSubjectModalVisible}
        onCancel={() => setIsSubjectModalVisible(false)}
        footer={null}
        centered
      >
        <AddSubjectForm />
      </Modal>
      <Modal
        title="Note"
        visible={isNoteModalVisible}
        onCancel={handleNoteModalCancel}
        footer={null}
      >
        <p>{noteContent}</p>
      </Modal>
    </div>
  );
}

export default Univeristy;
