import React, { useEffect, useState } from 'react'
import { Modal, Button, Form, Input, Select, message, Space, Popconfirm, Table } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useApp } from '../../../contexts/AppContext';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;


function ExtraProjectLog() {
    const { state, fetchProjectPayments,fetchExtraProjects, addProjectPayment, deleteProjectPayment ,addTransactionId} = useApp();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isVerifyModalVisible, setIsVerifyModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        fetchExtraProjects();
        fetchProjectPayments();
    }, [])

    console.log(state.projectPayments);
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleAddPayment = async (values) => {
        let { projectName } = values;
        projectName = projectName.replace(/\s+/g, '');
        const projectExists = state.extraProjects.some(project => project.id === projectName);

        if (!projectExists) {
            message.error(`Project name not found: ${projectName}`);
            return;
        }

        const newPayment = {
            ...values,
            status: 'unverified',
            transactionId: values.transactionId || '',
            type: 'project'
        };
        console.log('the payment values:', newPayment);

        try {
            const result = await addProjectPayment(newPayment);

            if (result === null) {
                message.success('Payment added successfully');
                setIsModalVisible(false);
            } else {
                message.error(result);
            }
        } catch (error) {
            message.error('An unexpected error occurred while adding the payment.');
            console.error('Unexpected error:', error);
        }
    };

    const AddPayment = () => (
        <Form
            form={form}
            layout="vertical"
            name="form_in_modal"
            initialValues={{ currency: 'USD' }}
            onFinish={handleAddPayment}
        >
            <Form.Item
                name="projectName"
                label="Project Name"
                rules={[{ required: true, message: 'Please input the project name!' }]}
            >
                <Input placeholder="Type Client Username" />
            </Form.Item>
            <Form.Item
                name="amount"
                label="Amount"
                rules={[{ required: true, message: 'Please input the payment amount!' }]}
            >
                <Input placeholder="Type Payment Amount" type="number" />
            </Form.Item>
            <Form.Item
                name="currency"
                label="Currency"
                rules={[{ required: true, message: 'Please select the currency!' }]}
            >
                <Select>
                    <Option value="USD">USD</Option>
                    <Option value="EUR">EUR</Option>
                    <Option value="INR">INR</Option>
                    {/* Add more currency options as needed */}
                </Select>
            </Form.Item>
            <Form.Item
                name="transactionId"
                label="Transaction ID"
            >
                <Input placeholder="Type Transaction ID" />
            </Form.Item>
            <Form.Item
                name="bankAccount"
                label="Bank Account"
                rules={[{ required: true, message: 'Please select the bank account!' }]}
            >
                <Select>
                    <Option value="ICICI - 0769">ICICI - 0769</Option>
                    <Option value="Citibank - 1234">Citibank - 1234</Option>
                    <Option value="Chase - 5678">Chase - 5678</Option>
                    <Option value="Bank of America - 9101">Bank of America - 9101</Option>
                </Select>
            </Form.Item>
            <Form.Item
                name="note"
                label="Note"
            >
                <TextArea placeholder="Add a Note..." rows={4} />
            </Form.Item>
            <Form.Item>
                <div style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit">
                        Add Payment
                    </Button>
                </div>
            </Form.Item>
        </Form>
    )

    const handleDelete = async (record) => {
        console.log('the record received is:', record);
        try {
            console.log('These are the record values:', record);
            const result = await deleteProjectPayment(record);
            if (result === null) {
                messageApi.open({
                    type: 'success',
                    content: 'Payment deleted successfully',
                });
            } else {
                message.error(result);
            }
        } catch (error) {
            message.error('Failed to delete payment');
            console.error('Error deleting payment:', error);
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
        console.log('the type is:',selectedRecord);
        console.log('these are the values:',values);
        try {
            const result = await addTransactionId(selectedRecord.id, selectedRecord.type,values.transactionId);
            if (result === null) {
                message.success('Payment verified successfully');
                setIsVerifyModalVisible(false);
            } else {
                message.error(result);
            }
        } catch (error) {
            message.error('Failed to verify payment');
            console.error('Error verifying payment:', error);
        }
    };

    const VerifyPayment = () => (
        <Form
            layout="vertical"
            onFinish={handleVerify}
            style={{ maxWidth: '600px', margin: 'auto' }}
        >
            <Form.Item
                name="transactionId"
                label="Transaction ID"
                rules={[{ required: true, message: 'Please input the transaction ID!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Verify
                </Button>
            </Form.Item>
        </Form >
    );
    const columns = [
        {
            title: 'Date and Time',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp) => moment(timestamp).format('DD/MM/YYYY, hh:mm A'), // Formatting timestamp
        },
        {
            title: 'Project Name',
            dataIndex: 'projectName',
            key: 'projectName',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Paid',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Bank Account',
            dataIndex: 'bankAccount',
            key: 'bankAccount',
        },
        {
            title: 'Transaction ID',
            dataIndex: 'transactionId',
            key: 'transactionId',
        },
        {
            title: 'Note',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Popconfirm
                        title="Are you sure you want to delete this payment?"
                        onConfirm={() => handleDelete(record)}
                    >
                        <Button danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                    <Button
                        style={{ color: '#13C2C2' }} // Customize color to match the "Verify" button style
                        disabled={record.status === 'verified'}
                        onClick={() => showVerifyModal(record)}
                        size="small"
                    >
                        {record.status === 'verified' ? 'Verified' : 'Verify'}
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={showModal}>
                Add Payment
            </Button>
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
            <Table
                columns={columns}
                dataSource={state.projectPayments}

                components={{
          header: {
            cell: props => (
           <th
  {...props}
  className="font-semibold px-4 text-left"
  style={{
    backgroundColor: '#5DDBD3',
    color: 'white',
    paddingTop: 6,
    paddingBottom: 6,
  }}
/>

            ),
          },
          body: {
            row: props => (
              <tr {...props} className="hover:bg-gray-50"
                style={{
    paddingTop: 6,
    paddingBottom: 6,
  }}
              />
            ),
            cell: props => (
              <td {...props} className=" border-b border-gray-200" style={{
    paddingTop: 6,
    paddingBottom: 6,
  }} />
            ),
          },
        }}
            />
        </div>
    )
}

export default ExtraProjectLog