import React, { useEffect, useState } from 'react';
import { Table, Badge, Space, Popconfirm, message, Button, Modal, Tooltip } from 'antd';
import { DeleteOutlined, FileOutlined } from '@ant-design/icons';
import { useApp } from '../../../contexts/AppContext';
import moment from 'moment';

const calculateProjectPayments = (extraProjects, projectPayments) => {
    return extraProjects.map(project => {
        const projectId = project.id.toLowerCase();
        const projectPaymentData = projectPayments.filter(payment =>
            payment.projectName.replace(/\s/g, '').toLowerCase() === projectId && payment.status === 'verified'
        );

        const totalPaid = projectPaymentData.reduce((sum, payment) => sum + Number(payment.amount), 0);
        const pendingAmount = Number(project.payment) - totalPaid;

        let status = 'Pending';
        if (pendingAmount === 0) {
            status = 'Completed';
        } else if (totalPaid > Number(project.payment)) {
            status = 'Exceeded';
        } else if (totalPaid > 0) {
            status = 'Pending';
        }

        return {
            ...project,
            totalPaid,
            pendingAmount,
            status,
            payments: projectPaymentData,
        };
    });
};
function ExtraProjectSales() {
    const { state, deleteProjectPayment } = useApp();
    const [data, setData] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentNote, setCurrentNote] = useState('');


    useEffect(() => {
        const aggregatedData = calculateProjectPayments(state.extraProjects, state.projectPayments);
        setData(aggregatedData);
    }, [state.projectPayments, state.extraProjects]);

    const showNote = (note) => {
        setCurrentNote(note);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'Project Name',
            dataIndex: 'projectName',
            key: 'projectName',
        },
        {
            title: 'Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Price',
            dataIndex: 'payment',
            key: 'payment',
            render: payment => `$${payment}`,
        },
        {
            title: 'Paid',
            dataIndex: 'totalPaid',
            key: 'totalPaid',
            render: totalPaid => `$${totalPaid}`,
        },
        {
            title: 'Pending',
            dataIndex: 'pendingAmount',
            key: 'pendingAmount',
            render: pendingAmount => `$${pendingAmount}`,
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: status => {
                let badgeStatus;
                switch (status) {
                    case 'Completed':
                        badgeStatus = 'success';
                        break;
                    case 'Exceeded':
                        badgeStatus = 'error';
                        break;
                    case 'Pending':
                        badgeStatus = 'warning';
                        break;
                    case 'Partial':
                        badgeStatus = 'default';
                        break;
                    default:
                        badgeStatus = 'default';
                        break;
                }
                return <Badge status={badgeStatus} text={status} />;
            },
        },
    ];

    const handleDelete = async (record) => {
        try {
            console.log('these are the record values:', record);
            const result = await deleteProjectPayment(record);
            if (result === null) {
                messageApi.open({
                    type: 'success',
                    content: 'Subject deleted successfully',
                });
            } else {
                message.error(result);
            }
        } catch (error) {
            message.error('Failed to delete payment');
            console.error('Error deleting payment:', error);
        }
    };

    const expandedRowRender = record => {
        const paymentColumns = [
            {
                title: 'Transaction ID',
                dataIndex: 'transactionId',
                key: 'transactionId',
            },
            {
                title: 'Bank Account',
                dataIndex: 'bankAccount',
                key: 'bankAccount',
            },
            {
                title: 'Date',
                dataIndex: 'timestamp',
                key: 'timestamp',
                render: timestamp => {
                    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                    return moment(date).format('DD/MM/YYYY, dddd');
                },
            },
            {
                title: 'Time',
                dataIndex: 'timestamp',
                key: 'timestamp',
                render: timestamp => {
                    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                    return moment(date).format('hh:mm A');
                },
            },
            {
                title: 'Amount',
                dataIndex: 'amount',
                key: 'amount',
                render: amount => `$${amount}`,
            },
            {
                title: 'Note',
                dataIndex: 'note',
                key: 'note',
                render: note => (
                    <Tooltip title="Click to view note">
                        <Button
                            type="link"
                            icon={<FileOutlined />}
                            onClick={() => showNote(note)}
                        />
                    </Tooltip>
                ),
            },
            {
                title: 'Actions',
                key: 'actions',
                render: (_, paymentRecord) => (
                    <Space size="middle">
                        <Popconfirm
                            title="Are you sure you want to delete this payment?"
                            onConfirm={() => handleDelete(paymentRecord)}
                        >
                            <Button danger icon={<DeleteOutlined />} size="small" />
                        </Popconfirm>
                    </Space>
                ),
            },
        ];

        return <Table  components={{
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
        }} columns={paymentColumns} dataSource={record.payments} pagination={false} size="small" />;
    };

    return (
        <div>
            <div>
                {contextHolder}
                <Table
                    columns={columns}
                    expandable={{ expandedRowRender }}
                    dataSource={data}
                    rowKey="id"
                    size="small"

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
                <Modal title="Note" open={isModalVisible}  onCancel={handleCancel} footer={null}>
                    <p>{currentNote}</p>
                </Modal>
            </div>
        </div>
    )
}
export default ExtraProjectSales
