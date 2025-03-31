import React, { useState, useEffect } from 'react';
import { Form, Switch, Select, InputNumber, Button, message, Tabs, Divider } from 'antd';
import { 
  BellOutlined, 
  SettingOutlined, 
  UserOutlined,
  SecurityScanOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import PageTitle from '../../../components/PageTitle';
import ResponsiveCard from '../../../components/ResponsiveCard';

const { TabPane } = Tabs;
const { Option } = Select;

function UserSettings() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      examReminders: true,
      studyReminders: true,
      achievements: true
    },
    preferences: {
      theme: 'light',
      language: 'english',
      fontSize: 14,
      studySessionLength: 25
    },
    privacy: {
      showProfilePublic: true,
      showScoresPublic: false,
      showAchievementsPublic: true
    }
  });

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      dispatch(ShowLoading());
      // TODO: Replace with actual API call
      // For now using mock data set above
      form.setFieldsValue({
        ...settings.notifications,
        ...settings.preferences,
        ...settings.privacy
      });
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error('Failed to load settings');
    }
  };

  const handleSave = async (values) => {
    try {
      dispatch(ShowLoading());
      // TODO: Implement actual API call
      console.log('Saving settings:', values);
      message.success('Settings saved successfully');
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error('Failed to save settings');
    }
  };

  const renderNotificationSettings = () => (
    <Form.Item noStyle>
      <div className="settings-section">
        <div className="section-title">
          <BellOutlined /> Notification Preferences
        </div>
        <Form.Item
          name="emailNotifications"
          valuePropName="checked"
          label="Email Notifications"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name="examReminders"
          valuePropName="checked"
          label="Exam Reminders"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name="studyReminders"
          valuePropName="checked"
          label="Study Reminders"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name="achievements"
          valuePropName="checked"
          label="Achievement Notifications"
        >
          <Switch />
        </Form.Item>
      </div>
    </Form.Item>
  );

  const renderPreferences = () => (
    <Form.Item noStyle>
      <div className="settings-section">
        <div className="section-title">
          <SettingOutlined /> Display & Study Preferences
        </div>
        <Form.Item name="theme" label="Theme">
          <Select>
            <Option value="light">Light</Option>
            <Option value="dark">Dark</Option>
            <Option value="system">System Default</Option>
          </Select>
        </Form.Item>
        <Form.Item name="language" label="Language">
          <Select>
            <Option value="english">English</Option>
            <Option value="spanish">Spanish</Option>
            <Option value="french">French</Option>
          </Select>
        </Form.Item>
        <Form.Item name="fontSize" label="Font Size">
          <InputNumber min={12} max={20} />
        </Form.Item>
        <Form.Item name="studySessionLength" label="Study Session Length (minutes)">
          <InputNumber min={5} max={60} />
        </Form.Item>
      </div>
    </Form.Item>
  );

  const renderPrivacySettings = () => (
    <Form.Item noStyle>
      <div className="settings-section">
        <div className="section-title">
          <SecurityScanOutlined /> Privacy Settings
        </div>
        <Form.Item
          name="showProfilePublic"
          valuePropName="checked"
          label="Show Profile Publicly"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name="showScoresPublic"
          valuePropName="checked"
          label="Show Exam Scores Publicly"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name="showAchievementsPublic"
          valuePropName="checked"
          label="Show Achievements Publicly"
        >
          <Switch />
        </Form.Item>
      </div>
    </Form.Item>
  );

  return (
    <div className="settings-container">
      <PageTitle 
        title="Settings" 
        subtitle="Customize your learning experience"
      />

      <ResponsiveCard>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          className="settings-form"
        >
          <Tabs defaultActiveKey="notifications">
            <TabPane
              tab={
                <span>
                  <BellOutlined />
                  Notifications
                </span>
              }
              key="notifications"
            >
              {renderNotificationSettings()}
            </TabPane>
            <TabPane
              tab={
                <span>
                  <SettingOutlined />
                  Preferences
                </span>
              }
              key="preferences"
            >
              {renderPreferences()}
            </TabPane>
            <TabPane
              tab={
                <span>
                  <SecurityScanOutlined />
                  Privacy
                </span>
              }
              key="privacy"
            >
              {renderPrivacySettings()}
            </TabPane>
          </Tabs>

          <Divider />

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </ResponsiveCard>

      <style jsx="true">{`
        .settings-container {
          padding: 1rem;
        }

        .settings-form {
          max-width: 600px;
          margin: 0 auto;
        }

        .settings-section {
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        :global(.ant-form-item) {
          margin-bottom: 1.5rem;
        }

        :global(.ant-form-item-label) {
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .settings-form {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default UserSettings;