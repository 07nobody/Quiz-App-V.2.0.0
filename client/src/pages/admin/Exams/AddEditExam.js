import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, InputNumber, Row, Col, Select, Switch, Button, message, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { addExam, getExamById, editExamById } from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";

function AddEditExam() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [form] = Form.useForm();
  const [examData, setExamData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      
      // Convert the boolean status value to string format expected by the server
      const formattedValues = {
        ...values,
        status: values.status ? "active" : "inactive"
      };
      
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
        form.setFieldsValue({
          name: response.data.name,
          duration: response.data.duration,
          category: response.data.category,
          totalMarks: response.data.totalMarks,
          passingMarks: response.data.passingMarks,
          status: response.data.status === "active",
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
    <div>
      <div className="flex justify-between items-center">
        <PageTitle title={isEdit ? "Edit Exam" : "Add Exam"} />
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate("/admin/exams")}
        >
          Back
        </Button>
      </div>
      <div className="divider"></div>
      <div className="mt-4">
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onFinish}
          initialValues={{ 
            status: true, 
            duration: 60, 
            totalMarks: 10, 
            passingMarks: 7,
            category: "General Knowledge" 
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
            <Col span={24} md={8}>
              <Form.Item
                name="duration"
                label="Duration (in seconds)"
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
            
            <Col span={24}>
              <Divider orientation="left">Exam Access Settings</Divider>
            </Col>
            
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

          <div className="flex justify-end mt-4">
            <Button type="primary" htmlType="submit">
              {isEdit ? "Update Exam" : "Create Exam"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default AddEditExam;
