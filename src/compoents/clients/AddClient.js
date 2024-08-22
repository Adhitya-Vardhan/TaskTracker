import React from 'react';
import { Form, Input, Button, Select, AutoComplete } from 'antd';
import { useApp } from '../../contexts/AppContext';

const { Option } = Select;




function AddClient({ onResult }) {

    const { addClient, state } = useApp();

    // const universityOptions = state.universities.map(university => ({
    //     value: university.name
    // }));
    const universityOptions = state.universities.map(university => ({
        value: `${university.id}-${university.name}`,
        label: university.name,
    }));

    const onFinish = async (values) => {
        const [universityId, universityName] = values.university.split('-');
        const data = {
            ...values,
            suspend: false,
            universityId,
        };
        console.log('Form data:', data);

        try {
            const result = await addClient(data);
            onResult(result);
        } catch (error) {
            onResult('An unexpected error occurred while adding the client.');
            console.error('Unexpected error:', error);
        }
    };

    return (
        <>
            <Form
                layout="vertical"
                onFinish={onFinish}
                style={{ maxWidth: '600px', margin: 'auto' }}
            >
                <h2>Add Client</h2>

                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please input the client name!' }]}
                >
                    <Input placeholder="Type Client Name" />
                </Form.Item>

                <Form.Item
                    name="contact"
                    label="Contact"
                    rules={[{ required: true, message: 'Please input contact details!' }]}
                >
                    <Input placeholder="Type Contact Details" />
                </Form.Item>

                <Form.Item
                    name="university"
                    label="University"
                    rules={[{ required: true, message: 'Please select a university!' }]}
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
                    name="username"
                    label="Username"
                >
                    <Input placeholder="Type Username" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                >
                    <Input placeholder="Type Password" />
                </Form.Item>

                <Form.Item
                    name="amount"
                    label="Amount"
                    rules={[{ required: true, message: 'Please input the payment amount!' }]}
                >
                    <Input placeholder="Type Payment Amount" />
                </Form.Item>

                <Form.Item
                    name="currency"
                    label="Currency"
                    rules={[{ required: true, message: 'Please select a currency!' }]}
                >
                    <Select placeholder="Select Currency">
                        <Option value="USD">USD</Option>
                        <Option value="EUR">EUR</Option>
                        <Option value="GBP">GBP</Option>
                        <Option value="INR">INR</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Client
                    </Button>
                    <Button style={{ marginLeft: '10px' }} type="default">
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default AddClient