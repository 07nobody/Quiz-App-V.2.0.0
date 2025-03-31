import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Form, 
  Input, 
  InputNumber, 
  Row, 
  Col, 
  Select, 
  Switch, 
  Button, 
  message, 
  Divider, 
  Collapse, 
  Tooltip,
  Slider,
  Space
} from "antd";
import { 
  ArrowLeftOutlined,
  QuestionCircleOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { addExam, getExamById, editExamById } from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";

const { Panel } = Collapse;

function AddEditExam() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [form] = Form.useForm();
  const [examData, setExamData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [allowExtraTime, setAllowExtraTime] = useState(false);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      
      // Prepare timer settings
      const timerSettings = {
        timerVisible: values.timerVisible,
        warningThreshold: values.warningThreshold,
        allowExtraTime: values.allowExtraTime,
        extraTimeAmount: values.allowExtraTime ? values.extraTimeAmount : 0
      };
      
      // Format the form values
      const formattedValues = {
        ...values,
        status: values.status ? "active" : "inactive",
        settings: {
          shuffleQuestions: values.shuffleQuestions,
          showResults: values.showResults,
          allowReview: values.allowReview,
          showExplanation: values.showExplanation,
          attemptsAllowed: values.attemptsAllowed,
          passScore: values.passScore,
          timerSettings
        }
      };
      
      // Remove individual timer settings from the top level
      delete formattedValues.timerVisible;
      delete formattedValues.warningThreshold;
      delete formattedValues.allowExtraTime;
      delete formattedValues.extraTimeAmount;
      delete formattedValues.shuffleQuestions;
      delete formattedValues.showResults;
      delete formattedValues.allowReview;
      delete formattedValues.showExplanation;
      delete formattedValues.attemptsAllowed;
      delete formattedValues.passScore;
      
      let response;
      if (isEdit) {
        response = await editExamById({
          ...formattedValues,
          examId: params.id,
        });
      } else {
        response = await addExam(formattedValues);
      }
      
      if (response.success) {
        message.success(response.message);
        navigate("/admin/exams");
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setExamData(response.data);
        
        // Extract timer settings
        const { timerSettings = {} } = response.data.settings || {};
        setAllowExtraTime(timerSettings.allowExtraTime || false);
        
        // Set form values
        form.setFieldsValue({
          name: response.data.name,
          duration: response.data.duration,
          category: response.data.category,
          totalMarks: response.data.totalMarks,
          passingMarks: response.data.passingMarks,
          status: response.data.status === "active",
          isPaid: response.data.isPaid || false,
          price: response.data.price || 0,
          description: response.data.description || '',
          
          // Timer settings
          timerVisible: timerSettings.timerVisible !== undefined ? timerSettings.timerVisible : true,
          warningThreshold: timerSettings.warningThreshold || 20,
          allowExtraTime: timerSettings.allowExtraTime || false,
          extraTimeAmount: timerSettings.extraTimeAmount || 0,
          
          // Other settings
          shuffleQuestions: response.data.settings?.shuffleQuestions !== undefined ? 
            response.data.settings.shuffleQuestions : true,
          showResults: response.data.settings?.showResults !== undefined ? 
            response.data.settings.showResults : true,
          allowReview: response.data.settings?.allowReview !== undefined ? 
            response.data.settings.allowReview : true,
          showExplanation: response.data.settings?.showExplanation !== undefined ? 
            response.data.settings.showExplanation : true,
          attemptsAllowed: response.data.settings?.attemptsAllowed || 1,
          passScore: response.data.settings?.passScore || 60
        });
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (params.id) {
      setIsEdit(true);
      getExamData();
    }
  }, [params.id]);

  return (
    <div className="add-edit-exam">
      <div className="header-section">
        <PageTitle title={isEdit ? "Edit Exam" : "Add Exam"} />
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate("/admin/exams")}
        >
          Back
        </Button>
      </div>
      <div className="divider"></div>
      
      <div className="form-container">
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish}
          initialValues={{ 
            status: true, 
            duration: 60, 
            totalMarks: 10, 
            passingMarks: 7,
            category: "General Knowledge",
            shuffleQuestions: true,
            showResults: true,
            allowReview: true,
            showExplanation: true,
            attemptsAllowed: 1,
            timerVisible: true,
            warningThreshold: 20,
            allowExtraTime: false,
            extraTimeAmount: 0,
            passScore: 60
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={24} md={12}>
              <Form.Item
                name="name"
                label="Exam Name"
                rules={[{ required: true, message: "Please enter exam name" }]}
              >
                <Input placeholder="Enter exam name" />
              </Form.Item>
            </Col>
            
            <Col span={24} md={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: "Please select a category" }]}
              >
                <Select placeholder="Select a category">
                  <Select.Option value="General Knowledge">General Knowledge</Select.Option>
                  <Select.Option value="Science">Science</Select.Option>
                  <Select.Option value="Mathematics">Mathematics</Select.Option>
                  <Select.Option value="Computer Science">Computer Science</Select.Option>
                  <Select.Option value="History">History</Select.Option>
                  <Select.Option value="Geography">Geography</Select.Option>
                  <Select.Option value="Literature">Literature</Select.Option>
                  <Select.Option value="Current Affairs">Current Affairs</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
              >
                <Input.TextArea rows={3} placeholder="Enter exam description" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Basic Settings</Divider>
          
          <Row gutter={[16, 16]}>
            <Col span={24} md={8}>
              <Form.Item
                name="duration"
                label="Duration (in seconds)"
                tooltip="Base duration for this exam in seconds"
                rules={[
                  { required: true, message: "Please enter duration" },
                  { type: "number", min: 30, message: "Duration must be at least 30 seconds" }
                ]}
              >
                <InputNumber min={30} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            
            <Col span={24} md={8}>
              <Form.Item
                name="totalMarks"
                label="Total Marks"
                rules={[
                  { required: true, message: "Please enter total marks" },
                  { type: "number", min: 1, message: "Total marks must be at least 1" }
                ]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            
            <Col span={24} md={8}>
              <Form.Item
                name="passingMarks"
                label="Passing Marks"
                rules={[
                  { required: true, message: "Please enter passing marks" },
                  { type: "number", min: 1, message: "Passing marks must be at least 1" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('totalMarks') >= value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passing marks cannot be greater than total marks'));
                    },
                  }),
                ]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Collapse 
            className="settings-collapse"
            expandIconPosition="right"
          >
            <Panel 
              header={
                <span>
                  <ClockCircleOutlined /> Timer Settings
                </span>
              } 
              key="timer"
            >
              <Row gutter={[16, 16]}>
                <Col span={24} md={8}>
                  <Form.Item 
                    name="timerVisible" 
                    label="Show Timer" 
                    valuePropName="checked"
                    tooltip="Whether the timer is visible to students during the exam"
                  >
                    <Switch 
                      checkedChildren="Visible" 
                      unCheckedChildren="Hidden" 
                    />
                  </Form.Item>
                </Col>
                
                <Col span={24} md={8}>
                  <Form.Item
                    name="warningThreshold"
                    label={
                      <span>
                        Warning Threshold (%)
                        <Tooltip title="When to start showing warning color for the timer">
                          <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                        </Tooltip>
                      </span>
                    }
                  >
                    <Slider
                      min={5}
                      max={50}
                      marks={{ 5: '5%', 20: '20%', 50: '50%' }}
                    />
                  </Form.Item>
                </Col>
                
                <Col span={24} md={8}>
                  <Form.Item 
                    name="allowExtraTime" 
                    label="Allow Extra Time" 
                    valuePropName="checked"
                    tooltip="Whether to allow extra time for all students"
                  >
                    <Switch 
                      checkedChildren="Yes" 
                      unCheckedChildren="No" 
                      onChange={setAllowExtraTime}
                    />
                  </Form.Item>
                </Col>
                
                {allowExtraTime && (
                  <Col span={24}>
                    <Form.Item
                      name="extraTimeAmount"
                      label="Extra Time (in seconds)"
                      tooltip="Additional time available for all students"
                    >
                      <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </Panel>
            
            <Panel 
              header={
                <span>
                  <SettingOutlined /> Exam Behavior
                </span>
              } 
              key="behavior"
            >
              <Row gutter={[16, 16]}>
                <Col span={24} md={12}>
                  <Form.Item 
                    name="shuffleQuestions" 
                    label="Shuffle Questions" 
                    valuePropName="checked"
                    tooltip="Randomize question order for each student"
                  >
                    <Switch 
                      checkedChildren="Yes" 
                      unCheckedChildren="No" 
                    />
                  </Form.Item>
                </Col>
                
                <Col span={24} md={12}>
                  <Form.Item 
                    name="showResults" 
                    label="Show Results" 
                    valuePropName="checked"
                    tooltip="Show results immediately after exam completion"
                  >
                    <Switch 
                      checkedChildren="Yes" 
                      unCheckedChildren="No" 
                    />
                  </Form.Item>
                </Col>
                
                <Col span={24} md={12}>
                  <Form.Item 
                    name="allowReview" 
                    label="Allow Question Review" 
                    valuePropName="checked"
                    tooltip="Allow students to review past questions during the exam"
                  >
                    <Switch 
                      checkedChildren="Yes" 
                      unCheckedChildren="No" 
                    />
                  </Form.Item>
                </Col>
                
                <Col span={24} md={12}>
                  <Form.Item 
                    name="showExplanation" 
                    label="Show Explanations" 
                    valuePropName="checked"
                    tooltip="Show explanations for each answer in the results"
                  >
                    <Switch 
                      checkedChildren="Yes" 
                      unCheckedChildren="No" 
                    />
                  </Form.Item>
                </Col>
                
                <Col span={24} md={12}>
                  <Form.Item
                    name="attemptsAllowed"
                    label="Attempts Allowed"
                    tooltip="Maximum number of attempts allowed for this exam"
                  >
                    <InputNumber min={1} max={10} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                
                <Col span={24} md={12}>
                  <Form.Item
                    name="passScore"
                    label="Pass Score (%)"
                    tooltip="Percentage required to pass the exam"
                  >
                    <InputNumber min={1} max={100} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Panel>
          </Collapse>
            
          <Divider orientation="left">Exam Access Settings</Divider>
          
          <Row gutter={[16, 16]}>
            <Col span={24} md={12}>
              <Form.Item 
                name="status" 
                label="Status" 
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren="Active" 
                  unCheckedChildren="Inactive" 
                />
              </Form.Item>
            </Col>
            
            <Col span={24} md={12}>
              <Form.Item 
                name="isPaid" 
                label="Is Paid Exam" 
                valuePropName="checked"
                tooltip="Enable if this is a paid exam"
              >
                <Switch 
                  checkedChildren="Paid" 
                  unCheckedChildren="Free" 
                />
              </Form.Item>
            </Col>
            
            <Col span={24} md={12}>
              <Form.Item
                name="price"
                label="Price (if paid)"
                dependencies={['isPaid']}
              >
                <InputNumber 
                  min={0} 
                  style={{ width: '100%' }} 
                  prefix="₹" 
                  disabled={!form.getFieldValue('isPaid')}
                  placeholder="Enter price if this is a paid exam"
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="form-actions">
            <Space>
              <Button onClick={() => navigate("/admin/exams")}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {isEdit ? "Update Exam" : "Create Exam"}
              </Button>
            </Space>
          </div>
        </Form>
      </div>
      
      <style jsx="true">{`
        .add-edit-exam {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .divider {
          margin-bottom: 24px;
          border-top: 1px solid var(--border-color);
        }
        
        .form-container {
          background-color: var(--background-secondary);
          padding: 24px;
          border-radius: 8px;
          box-shadow: var(--shadow-sm);
        }
        
        .settings-collapse {
          margin-bottom: 24px;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 24px;
        }
        
        @media (max-width: 768px) {
          .header-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          
          .form-container {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default AddEditExam;
