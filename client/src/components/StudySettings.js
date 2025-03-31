import React, { useState, useEffect } from 'react';
import { 
  Card, Form, Switch, Select, Radio, 
  InputNumber, Button, Space, message 
} from 'antd';
import { 
  BulbOutlined, EyeOutlined, ClockCircleOutlined,
  BellOutlined, FontSizeOutlined 
} from '@ant-design/icons';
import { useTheme } from '../contexts/ThemeContext';
import { getSettingsByCategory, updateSettings } from '../apicalls/settings';

function StudySettings() {
  const { 
    studyMode, 
    setStudyModePreference,
    fontPreferences,
    updateFontPreferences
  } = useTheme();

  const [form] = Form.useForm();
  const [settings, setSettings] = useState({
    defaultConfidenceThreshold: 4,
    spacedRepetitionAlgorithm: 'supermemo2',
    studyReminders: true,
    reminderTime: '09:00',
    cardsPerSession: 20
  });

  useEffect(() => {
    loadStudySettings();
  }, []);

  const loadStudySettings = async () => {
    try {
      const response = await getSettingsByCategory('study');
      if (response.success) {
        const studySettings = {};
        response.data.forEach(setting => {
          studySettings[setting.key] = setting.value;
        });
        setSettings(studySettings);
        form.setFieldsValue(studySettings);
      }
    } catch (error) {
      message.error('Failed to load study settings');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const response = await updateSettings({
        settings: Object.entries(values).map(([key, value]) => ({
          key,
          value,
          category: 'study'
        }))
      });

      if (response.success) {
        message.success('Study settings updated successfully');
        // Update relevant context values
        if (values.studyMode !== studyMode) {
          setStudyModePreference(values.studyMode);
        }
        if (values.fontSize !== fontPreferences.size) {
          updateFontPreferences({
            ...fontPreferences,
            size: values.fontSize
          });
        }
      }
    } catch (error) {
      message.error('Failed to update study settings');
    }
  };

  return (
    <Card title="Study Settings" className="settings-card">
      <Form
        form={form}
        layout="vertical"
        initialValues={settings}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Study Mode"
          name="studyMode"
          tooltip="Choose your preferred study environment"
        >
          <Radio.Group buttonStyle="solid">
            <Space direction="vertical">
              <Radio.Button value="normal">
                <BulbOutlined /> Normal
              </Radio.Button>
              <Radio.Button value="focus">
                <EyeOutlined /> Focus Mode
              </Radio.Button>
              <Radio.Button value="night">
                <ClockCircleOutlined /> Night Mode
              </Radio.Button>
              <Radio.Button value="dyslexic">
                <FontSizeOutlined /> Dyslexic Friendly
              </Radio.Button>
            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Spaced Repetition Algorithm"
          name="spacedRepetitionAlgorithm"
          tooltip="Choose how cards are scheduled for review"
        >
          <Select>
            <Select.Option value="supermemo2">SuperMemo 2</Select.Option>
            <Select.Option value="leitner">Leitner System</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Cards Per Study Session"
          name="cardsPerSession"
          tooltip="Maximum number of cards to study in one session"
        >
          <InputNumber min={5} max={100} />
        </Form.Item>

        <Form.Item
          label="Mastery Threshold"
          name="defaultConfidenceThreshold"
          tooltip="Minimum confidence level to consider a card mastered"
        >
          <Radio.Group>
            <Radio.Button value={5}>Strict (5)</Radio.Button>
            <Radio.Button value={4}>Normal (4)</Radio.Button>
            <Radio.Button value={3}>Lenient (3)</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Font Size"
          name="fontSize"
          tooltip="Adjust the text size for flashcards"
        >
          <Select>
            <Select.Option value="small">Small</Select.Option>
            <Select.Option value="medium">Medium</Select.Option>
            <Select.Option value="large">Large</Select.Option>
            <Select.Option value="extra-large">Extra Large</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Study Reminders"
          name="studyReminders"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Reminder Time"
          name="reminderTime"
          tooltip="When should we remind you to study?"
          dependencies={['studyReminders']}
        >
          <Select disabled={!form.getFieldValue('studyReminders')}>
            {Array.from({ length: 24 }, (_, i) => {
              const hour = i.toString().padStart(2, '0');
              return (
                <Select.Option key={i} value={\`\${hour}:00\`}>
                  \`\${hour}:00\`
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Save Settings
            </Button>
            <Button onClick={() => form.resetFields()}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <style jsx="true">{`
        .settings-card {
          max-width: 600px;
          margin: 0 auto;
        }

        .ant-form-item-label {
          font-weight: 500;
        }

        .ant-radio-group {
          width: 100%;
        }

        .ant-radio-button-wrapper {
          width: 100%;
          text-align: left;
        }

        .ant-space {
          width: 100%;
        }
      `}</style>
    </Card>
  );
}

export default StudySettings;