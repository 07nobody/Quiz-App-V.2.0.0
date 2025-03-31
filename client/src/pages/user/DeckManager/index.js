import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, Select, Tag, 
  Empty, Space, message, Tooltip, Popconfirm 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  ShareAltOutlined, EyeOutlined, BookOutlined,
  LockOutlined, GlobalOutlined, TeamOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import {
  createDeck,
  getUserDecks,
  updateDeck,
  deleteDeck,
  shareDeck,
  getDeckStats
} from '../../../apicalls/flashcards';
import PageTitle from '../../../components/PageTitle';
import ResponsiveCard from '../../../components/ResponsiveCard';

const { Option } = Select;
const { TextArea } = Input;

function DeckManager() {
  const [decks, setDecks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [form] = Form.useForm();
  const [shareForm] = Form.useForm();
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getUserDecks(user._id);
      if (response.success) {
        setDecks(response.data);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error('Failed to load decks');
    }
  };

  const handleCreate = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await createDeck({
        ...values,
        userId: user._id
      });
      if (response.success) {
        message.success('Deck created successfully');
        setModalVisible(false);
        form.resetFields();
        loadDecks();
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error('Failed to create deck');
    }
  };

  const handleEdit = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await updateDeck(selectedDeck._id, values);
      if (response.success) {
        message.success('Deck updated successfully');
        setModalVisible(false);
        form.resetFields();
        loadDecks();
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error('Failed to update deck');
    }
  };

  const handleDelete = async (deckId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteDeck(deckId);
      if (response.success) {
        message.success('Deck deleted successfully');
        loadDecks();
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error('Failed to delete deck');
    }
  };

  const handleShare = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await shareDeck(selectedDeck._id, values);
      if (response.success) {
        message.success('Deck shared successfully');
        setShareModalVisible(false);
        shareForm.resetFields();
        loadDecks();
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error('Failed to share deck');
    }
  };

  const editDeck = (deck) => {
    setSelectedDeck(deck);
    form.setFieldsValue({
      name: deck.name,
      description: deck.description,
      category: deck.category,
      visibility: deck.visibility,
      reviewSchedule: deck.reviewSchedule
    });
    setModalVisible(true);
  };

  const showShareModal = (deck) => {
    setSelectedDeck(deck);
    setShareModalVisible(true);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className="deck-name">
          <BookOutlined className="deck-icon" />
          <div>
            <div className="deck-title">{name}</div>
            <div className="deck-category">{record.category}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Cards',
      dataIndex: 'totalCards',
      key: 'totalCards',
      width: 100,
      render: (count) => (
        <Tag color="blue">{count} cards</Tag>
      ),
    },
    {
      title: 'Visibility',
      dataIndex: 'visibility',
      key: 'visibility',
      width: 120,
      render: (visibility) => {
        const icons = {
          private: <LockOutlined />,
          public: <GlobalOutlined />,
          shared: <TeamOutlined />
        };
        const colors = {
          private: 'default',
          public: 'green',
          shared: 'blue'
        };
        return (
          <Tag color={colors[visibility]} icon={icons[visibility]}>
            {visibility.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Last Studied',
      dataIndex: 'lastStudied',
      key: 'lastStudied',
      width: 150,
      render: (date) => date ? new Date(date).toLocaleDateString() : 'Never',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Tooltip title="Study">
            <Button 
              icon={<EyeOutlined />}
              onClick={() => window.location.href = \`/flashcards/\${record._id}\`}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              icon={<EditOutlined />}
              onClick={() => editDeck(record)}
            />
          </Tooltip>
          <Tooltip title="Share">
            <Button 
              icon={<ShareAltOutlined />}
              onClick={() => showShareModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete this deck?"
              onConfirm={() => handleDelete(record._id)}
            >
              <Button 
                icon={<DeleteOutlined />}
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const renderDeckForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={selectedDeck ? handleEdit : handleCreate}
    >
      <Form.Item
        name="name"
        label="Deck Name"
        rules={[{ required: true, message: 'Please enter deck name' }]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item
        name="description"
        label="Description"
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: 'Please select a category' }]}
      >
        <Select>
          <Option value="mathematics">Mathematics</Option>
          <Option value="science">Science</Option>
          <Option value="english">English</Option>
          <Option value="history">History</Option>
          <Option value="programming">Programming</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="visibility"
        label="Visibility"
        rules={[{ required: true }]}
      >
        <Select>
          <Option value="private">Private</Option>
          <Option value="public">Public</Option>
          <Option value="shared">Shared</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="reviewSchedule"
        label="Review Schedule"
        rules={[{ required: true }]}
      >
        <Select>
          <Option value="daily">Daily</Option>
          <Option value="spaced">Spaced Repetition</Option>
          <Option value="custom">Custom</Option>
        </Select>
      </Form.Item>
    </Form>
  );

  const renderShareForm = () => (
    <Form
      form={shareForm}
      layout="vertical"
      onFinish={handleShare}
    >
      <Form.Item
        name="users"
        label="Share with (User IDs)"
        rules={[{ required: true, message: 'Please enter user IDs' }]}
      >
        <Select mode="tags" placeholder="Enter user IDs to share with" />
      </Form.Item>

      <Form.Item
        name="permission"
        label="Permission Level"
        rules={[{ required: true }]}
      >
        <Select>
          <Option value="view">View Only</Option>
          <Option value="edit">Edit</Option>
        </Select>
      </Form.Item>
    </Form>
  );

  return (
    <div className="deck-manager-container">
      <PageTitle 
        title="Study Decks" 
        subtitle="Manage your flashcard decks"
      />

      <div className="controls">
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedDeck(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Create Deck
        </Button>
      </div>

      <ResponsiveCard>
        {decks.length > 0 ? (
          <Table 
            columns={columns} 
            dataSource={decks}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showTotal: (total) => \`Total \${total} decks\`
            }}
          />
        ) : (
          <Empty 
            description="No decks created yet" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {
                setSelectedDeck(null);
                form.resetFields();
                setModalVisible(true);
              }}
            >
              Create Your First Deck
            </Button>
          </Empty>
        )}
      </ResponsiveCard>

      <Modal
        title={selectedDeck ? "Edit Deck" : "Create New Deck"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        {renderDeckForm()}
      </Modal>

      <Modal
        title="Share Deck"
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        onOk={() => shareForm.submit()}
      >
        {renderShareForm()}
      </Modal>

      <style jsx="true">{`
        .deck-manager-container {
          padding: 1rem;
        }

        .controls {
          margin-bottom: 1.5rem;
        }

        .deck-name {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .deck-icon {
          font-size: 1.2rem;
          padding: 0.5rem;
          background: var(--background-secondary);
          border-radius: 50%;
        }

        .deck-title {
          font-weight: 500;
        }

        .deck-category {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .ant-table-content {
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
}

export default DeckManager;