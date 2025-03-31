import React, { useState, useEffect } from 'react';
import { Form, Input, Switch, Select, InputNumber, Button, message, Tabs, Upload, Divider } from 'antd';
import { 
  SettingOutlined, 
  SecurityScanOutlined,
  CloudUploadOutlined,
  MailOutlined,
  GlobalOutlined,
  FileImageOutlined,
  ApiOutlined
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import PageTitle from '../../../components/PageTitle';
import ResponsiveCard from '../../../components/ResponsiveCard';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

function AdminSettings() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [settings, setSettings] = useState({
    general: {
      siteName: 'Quiz Platform',
      siteDescription: 'Online learning and assessment platform',
      logoUrl: '',
      faviconUrl: '',
      defaultLanguage: 'english'
    },
    security: {
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      passwordMinLength: 8,
      requirePasswordReset: 90,
      enableTwoFactor: false
    },
    email: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      senderName: '',
      senderEmail: '',
      enableEmailVerification: true
    },
    certificates: {
      enableCertificates: true,
      certificateTemplate: '',
      certificateValidityDays: 365,
      minimumPassScore: 70
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      dispatch(ShowLoading());
      // TODO: Replace with actual API call
      // For now using mock data set above
      form.setFieldsValue({
        ...settings.general,
        ...settings.security,
        ...settings.email,
        ...settings.certificates
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

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <Form.Item
        name="siteName"
        label="Site Name"
        rules={[{ required: true, message: 'Please enter site name' }]}
      >
        <Input prefix={<GlobalOutlined />} />
      </Form.Item>
      
      <Form.Item
        name="siteDescription"
        label="Site Description"
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="logoUrl"
        label="Logo"
      >
        <Upload
          name="logo"
          listType="picture"
          maxCount={1}
          beforeUpload={() => false}
        >
          <Button icon={<FileImageOutlined />}>Upload Logo</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="defaultLanguage"
        label="Default Language"
      >
        <Select>
          <Option value="english">English</Option>
          <Option value="spanish">Spanish</Option>
          <Option value="french">French</Option>
        </Select>
      </Form.Item>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <Form.Item
        name="maxLoginAttempts"
        label="Maximum Login Attempts"
        rules={[{ required: true }]}
      >
        <InputNumber min={1} max={10} />
      </Form.Item>

      <Form.Item
        name="lockoutDuration"
        label="Account Lockout Duration (minutes)"
        rules={[{ required: true }]}
      >
        <InputNumber min={5} max={120} />
      </Form.Item>

      <Form.Item
        name="passwordMinLength"
        label="Minimum Password Length"
        rules={[{ required: true }]}
      >
        <InputNumber min={6} max={20} />
      </Form.Item>

      <Form.Item
        name="requirePasswordReset"
        label="Require Password Reset (days)"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} max={365} />
      </Form.Item>

      <Form.Item
        name="enableTwoFactor"
        label="Enable Two-Factor Authentication"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="settings-section">
      <Form.Item
        name="smtpHost"
        label="SMTP Host"
        rules={[{ required: true }]}
      >
        <Input prefix={<ApiOutlined />} />
      </Form.Item>

      <Form.Item
        name="smtpPort"
        label="SMTP Port"
        rules={[{ required: true }]}
      >
        <InputNumber min={1} max={65535} />
      </Form.Item>

      <Form.Item
        name="smtpUser"
        label="SMTP Username"
        rules={[{ required: true }]}
      >
        <Input prefix={<MailOutlined />} />
      </Form.Item>

      <Form.Item
        name="smtpPassword"
        label="SMTP Password"
        rules={[{ required: true }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="senderName"
        label="Sender Name"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="senderEmail"
        label="Sender Email"
        rules={[{ required: true, type: 'email' }]}
      >
        <Input prefix={<MailOutlined />} />
      </Form.Item>

      <Form.Item
        name="enableEmailVerification"
        label="Enable Email Verification"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
    </div>
  );

  const renderCertificateSettings = () => (
    <div className="settings-section">
      <Form.Item
        name="enableCertificates"
        label="Enable Certificates"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>

      <Form.Item
        name="certificateTemplate"
        label="Certificate Template"
      >
        <Upload
          name="template"
          listType="picture"
          maxCount={1}
          beforeUpload={() => false}
        >
          <Button icon={<CloudUploadOutlined />}>Upload Template</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="certificateValidityDays"
        label="Certificate Validity (days)"
        rules={[{ required: true }]}
      >
        <InputNumber min={1} max={3650} />
      </Form.Item>

      <Form.Item
        name="minimumPassScore"
        label="Minimum Pass Score (%)"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} max={100} />
      </Form.Item>
    </div>
  );

  return (
    <div className="admin-settings-container">
      <PageTitle 
        title="System Settings" 
        subtitle="Configure global application settings"
      />

      <ResponsiveCard>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          className="settings-form"
        >
          <Tabs defaultActiveKey="general">
            <TabPane
              tab={
                <span>
                  <SettingOutlined />
                  General
                </span>
              }
              key="general"
            >
              {renderGeneralSettings()}
            </TabPane>
            <TabPane
              tab={
                <span>
                  <SecurityScanOutlined />
                  Security
                </span>
              }
              key="security"
            >
              {renderSecuritySettings()}
            </TabPane>
            <TabPane
              tab={
                <span>
                  <MailOutlined />
                  Email
                </span>
              }
              key="email"
            >
              {renderEmailSettings()}
            </TabPane>
            <TabPane
              tab={
                <span>
                  <FileImageOutlined />
                  Certificates
                </span>
              }
              key="certificates"
            >
              {renderCertificateSettings()}
            </TabPane>
          </Tabs>

          <Divider />

          <Form.Item className="form-actions">
            <Button type="primary" htmlType="submit" size="large">
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </ResponsiveCard>

      <style jsx="true">{`
        .admin-settings-container {
          padding: 1rem;
        }

        .settings-form {
          max-width: 800px;
          margin: 0 auto;
        }

        .settings-section {
          padding: 1rem 0;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 0;
        }

        :global(.ant-upload-list-item-info) {
          padding: 0 1rem;
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

export default AdminSettings;