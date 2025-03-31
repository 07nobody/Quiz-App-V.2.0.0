import React, { useState, useEffect } from 'react';
import { Form, Select, InputNumber, Switch, Button, Card, Divider, Space, Tag, Typography } from 'antd';
import { ClockCircleOutlined, UserOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-hot-toast';

const { Option } = Select;
const { Title, Text } = Typography;

const TimerSettingsForm = ({ initialValues, onFinish, usersList = [] }) => {
  const [form] = Form.useForm();
  const [timerType, setTimerType] = useState(initialValues?.timerType || 'fixed');
  const [allowTimeExtension, setAllowTimeExtension] = useState(
    initialValues?.timerSettings?.allowTimeExtension || false
  );
  const [extraTimeUsers, setExtraTimeUsers] = useState(
    initialValues?.accessibilitySettings?.extraTimeUsers || []
  );

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        timerType: initialValues.timerType || 'fixed',
        duration: initialValues.duration || 60,
        'timerSettings.timePerQuestion': initialValues.timerSettings?.timePerQuestion || 60,
        'timerSettings.showTimer': initialValues.timerSettings?.showTimer ?? true,
        'timerSettings.allowTimeExtension': initialValues.timerSettings?.allowTimeExtension || false,
        'timerSettings.maxTimeExtension': initialValues.timerSettings?.maxTimeExtension || 0,
        'timerSettings.warningTime': initialValues.timerSettings?.warningTime || 5,
        'accessibilitySettings.highContrastMode': initialValues.accessibilitySettings?.highContrastMode || false,
        'accessibilitySettings.largerText': initialValues.accessibilitySettings?.largerText || false,
      });
      
      setTimerType(initialValues.timerType || 'fixed');
      setAllowTimeExtension(initialValues.timerSettings?.allowTimeExtension || false);
      setExtraTimeUsers(initialValues.accessibilitySettings?.extraTimeUsers || []);
    }
  }, [initialValues, form]);

  const handleValuesChange = (changedValues) => {
    if (changedValues.timerType) {
      setTimerType(changedValues.timerType);
    }
    
    if (changedValues.timerSettings?.allowTimeExtension !== undefined) {
      setAllowTimeExtension(changedValues.timerSettings.allowTimeExtension);
    }
  };

  const handleAddExtraTimeUser = () => {
    const userId = form.getFieldValue('newExtraTimeUser');
    const percentage = form.getFieldValue('extraTimePercentage') || 25;
    const reason = form.getFieldValue('extraTimeReason') || 'Accessibility accommodation';
    
    if (!userId) {
      toast.error('Please select a user');
      return;
    }
    
    const user = usersList.find(u => u._id === userId);
    if (!user) return;
    
    const userExists = extraTimeUsers.some(u => u.user?._id === userId);
    if (userExists) {
      toast.error('User already added');
      return;
    }
    
    const newExtraTimeUsers = [
      ...extraTimeUsers,
      {
        user: { _id: user._id, name: user.name },
        extraTimePercentage: percentage,
        reason
      }
    ];
    
    setExtraTimeUsers(newExtraTimeUsers);
    form.setFieldValue('accessibilitySettings.extraTimeUsers', newExtraTimeUsers);
    form.resetFields(['newExtraTimeUser', 'extraTimePercentage', 'extraTimeReason']);
  };

  const handleRemoveExtraTimeUser = (userId) => {
    const filteredUsers = extraTimeUsers.filter(u => u.user?._id !== userId);
    setExtraTimeUsers(filteredUsers);
    form.setFieldValue('accessibilitySettings.extraTimeUsers', filteredUsers);
  };

  const handleSubmit = (values) => {
    const formattedValues = {
      ...values,
      accessibilitySettings: {
        ...values.accessibilitySettings,
        extraTimeUsers
      }
    };
    
    onFinish(formattedValues);
  };

  return (
    <Card 
      title={
        <Space>
          <ClockCircleOutlined /> 
          <span>Quiz Timer Settings</span>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        onFinish={handleSubmit}
        initialValues={{
          timerType: 'fixed',
          duration: 60,
          'timerSettings.timePerQuestion': 60,
          'timerSettings.showTimer': true,
          'timerSettings.allowTimeExtension': false,
          'timerSettings.maxTimeExtension': 0,
          'timerSettings.warningTime': 5,
          'accessibilitySettings.highContrastMode': false,
          'accessibilitySettings.largerText': false
        }}
      >
        <Form.Item
          name="timerType"
          label="Timer Type"
          tooltip="Choose how time should be handled for this quiz"
        >
          <Select>
            <Option value="fixed">Fixed Duration (Same time for entire exam)</Option>
            <Option value="flexible">Flexible (Allow time extension)</Option>
            <Option value="perQuestion">Per Question (Set time for each question)</Option>
          </Select>
        </Form.Item>

        {timerType === 'fixed' || timerType === 'flexible' ? (
          <Form.Item
            name="duration"
            label="Total Duration (minutes)"
            rules={[{ required: true, message: 'Please enter the duration' }]}
          >
            <InputNumber min={1} max={240} style={{ width: '100%' }} />
          </Form.Item>
        ) : (
          <Form.Item
            name="timerSettings.timePerQuestion"
            label="Time Per Question (seconds)"
            rules={[{ required: true, message: 'Please enter time per question' }]}
          >
            <InputNumber min={10} max={600} style={{ width: '100%' }} />
          </Form.Item>
        )}

        <Form.Item
          name="timerSettings.showTimer"
          label="Show Timer to Students"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="timerSettings.warningTime"
          label="Time Warning (minutes before end)"
          tooltip="When to show time warning notification"
        >
          <InputNumber min={1} max={30} style={{ width: '100%' }} />
        </Form.Item>

        {timerType === 'flexible' && (
          <>
            <Form.Item
              name="timerSettings.allowTimeExtension"
              label="Allow Time Extension Requests"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            {allowTimeExtension && (
              <Form.Item
                name="timerSettings.maxTimeExtension"
                label="Maximum Extension (minutes)"
                rules={[{ required: true, message: 'Please enter max extension time' }]}
              >
                <InputNumber min={0} max={60} style={{ width: '100%' }} />
              </Form.Item>
            )}
          </>
        )}

        <Divider orientation="left">Accessibility Settings</Divider>

        <Form.Item
          name="accessibilitySettings.highContrastMode"
          label="High Contrast Mode Available"
          valuePropName="checked"
          tooltip="Enable high contrast option for visually impaired users"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="accessibilitySettings.largerText"
          label="Larger Text Option Available"
          valuePropName="checked"
          tooltip="Enable larger text options for visually impaired users"
        >
          <Switch />
        </Form.Item>

        <Divider orientation="left">Extra Time Accommodations</Divider>

        <div className="extra-time-users">
          {extraTimeUsers.length > 0 ? (
            <>
              <Title level={5}>Users with Extra Time</Title>
              <div style={{ marginBottom: 16 }}>
                {extraTimeUsers.map((item) => (
                  <Tag 
                    key={item.user?._id} 
                    closable 
                    onClose={() => handleRemoveExtraTimeUser(item.user?._id)}
                    style={{ marginBottom: 8 }}
                    color="blue"
                  >
                    <UserOutlined /> {item.user?.name} (+{item.extraTimePercentage}%)
                  </Tag>
                ))}
              </div>
            </>
          ) : (
            <Text type="secondary">No users with extra time accommodations</Text>
          )}
        </div>

        <Card size="small" style={{ marginBottom: 16 }}>
          <Title level={5}>Add User with Extra Time</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Form.Item
              name="newExtraTimeUser"
              label="Select User"
            >
              <Select
                showSearch
                placeholder="Select a user"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {usersList.map(user => (
                  <Option key={user._id} value={user._id}>{user.name}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="extraTimePercentage"
              label="Extra Time (%)"
              initialValue={25}
            >
              <InputNumber min={5} max={100} style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item
              name="extraTimeReason"
              label="Reason"
              initialValue="Accessibility accommodation"
            >
              <Select>
                <Option value="Accessibility accommodation">Accessibility accommodation</Option>
                <Option value="Learning disability">Learning disability</Option>
                <Option value="Medical condition">Medical condition</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
            
            <Button 
              type="dashed" 
              icon={<PlusOutlined />} 
              onClick={handleAddExtraTimeUser}
              block
            >
              Add Extra Time User
            </Button>
          </Space>
        </Card>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Save Timer Settings
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default TimerSettingsForm;