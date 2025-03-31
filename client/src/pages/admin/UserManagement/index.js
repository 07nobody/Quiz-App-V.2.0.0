import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Tag, Modal, Form, message, Tooltip, Switch } from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  SearchOutlined,
  FilterOutlined,
  MailOutlined
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import PageTitle from '../../../components/PageTitle';
import ResponsiveCard from '../../../components/ResponsiveCard';

const { Option } = Select;

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      dispatch(ShowLoading());
      // TODO: Replace with actual API call
      const mockUsers = Array(10).fill().map((_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        role: i === 0 ? 'admin' : 'user',
        status: i % 5 === 0 ? 'inactive' : 'active',
        lastLogin: new Date(Date.now() - Math.random() * 864000000).toISOString(),
        examsCompleted: Math.floor(Math.random() * 20),
        joinDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString()
      }));
      setUsers(mockUsers);
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error('Failed to load users');
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status === 'active'
    });
    setEditModalVisible(true);
  };

  const handleDelete = (userId) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this user? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        // TODO: Implement actual delete
        message.success('User deleted successfully');
        loadUsers();
      }
    });
  };

  const handleSave = async (values) => {
    try {
      dispatch(ShowLoading());
      // TODO: Implement actual save
      console.log('Saving user:', { ...values, id: selectedUser.id });
      message.success('User updated successfully');
      setEditModalVisible(false);
      loadUsers();
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error('Failed to update user');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className="user-cell">
          <UserOutlined className="user-icon" />
          <div>
            <div className="user-name">{name}</div>
            <div className="user-email">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'blue' : 'default'}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Exams Completed',
      dataIndex: 'examsCompleted',
      key: 'examsCompleted',
      sorter: (a, b) => a.examsCompleted - b.examsCompleted
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.joinDate) - new Date(b.joinDate)
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.lastLogin) - new Date(b.lastLogin)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="action-buttons">
          <Tooltip title="Edit">
            <Button 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button 
              icon={<DeleteOutlined />} 
              danger
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="user-management-container">
      <PageTitle 
        title="User Management" 
        subtitle="Manage user accounts and permissions"
      />

      <div className="filters">
        <Input
          placeholder="Search by name or email"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />
        <Select
          value={filterRole}
          onChange={setFilterRole}
          className="role-filter"
          placeholder="Filter by role"
          prefix={<FilterOutlined />}
        >
          <Option value="all">All Roles</Option>
          <Option value="user">Users</Option>
          <Option value="admin">Admins</Option>
        </Select>
      </div>

      <ResponsiveCard>
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} users`
          }}
        />
      </ResponsiveCard>

      <Modal
        title="Edit User"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item className="form-actions">
            <Button onClick={() => setEditModalVisible(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx="true">{`
        .user-management-container {
          padding: 1rem;
        }

        .filters {
          margin-bottom: 1.5rem;
          display: flex;
          gap: 1rem;
        }

        .search-input {
          max-width: 300px;
        }

        .role-filter {
          min-width: 150px;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-icon {
          font-size: 1.2rem;
          padding: 0.5rem;
          background: var(--background-secondary);
          border-radius: 50%;
        }

        .user-name {
          font-weight: 500;
        }

        .user-email {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .filters {
            flex-direction: column;
          }

          .search-input,
          .role-filter {
            max-width: 100%;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default UserManagement;