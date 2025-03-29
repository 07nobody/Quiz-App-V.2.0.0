import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table, Form, Modal, Input, Button, message, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { 
  addQuestionToExam, 
  getExamById, 
  deleteQuestionById,
  editQuestionById
} from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";

function AddEditQuestion() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [examData, setExamData] = useState(null);
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [form] = Form.useForm();

  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setExamData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleAddQuestion = async (values) => {
    try {
      dispatch(ShowLoading());
      // Convert options from the form into the correct format
      const tempOptions = {
        A: values.A,
        B: values.B,
        C: values.C,
        D: values.D,
      };
      
      const reqPayload = {
        name: values.name,
        correctOption: values.correctOption,
        options: tempOptions,
        exam: params.id,
      };
      
      let response;
      if (selectedQuestion) {
        response = await editQuestionById({
          ...reqPayload,
          questionId: selectedQuestion._id,
        });
      } else {
        response = await addQuestionToExam(reqPayload);
      }
      
      if (response.success) {
        message.success(response.message);
        getExamData();
        setShowAddEditQuestionModal(false);
        form.resetFields();
        setSelectedQuestion(null);
      } else {
        message.error(response.message);
      }
      
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteQuestionById({
        questionId,
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleEditQuestion = (question) => {
    setSelectedQuestion(question);
    form.setFieldsValue({
      name: question.name,
      correctOption: question.correctOption,
      A: question.options.A,
      B: question.options.B,
      C: question.options.C,
      D: question.options.D,
    });
    setShowAddEditQuestionModal(true);
  };

  useEffect(() => {
    getExamData();
  }, []);

  const questionsColumns = [
    {
      title: "Question",
      dataIndex: "name",
    },
    {
      title: "Option A",
      dataIndex: "options",
      render: (options) => options?.A || "N/A",
    },
    {
      title: "Option B",
      dataIndex: "options",
      render: (options) => options?.B || "N/A",
    },
    {
      title: "Option C",
      dataIndex: "options",
      render: (options) => options?.C || "N/A",
    },
    {
      title: "Option D",
      dataIndex: "options",
      render: (options) => options?.D || "N/A",
    },
    {
      title: "Correct Answer",
      dataIndex: "correctOption",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => handleEditQuestion(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this question?"
            onConfirm={() => handleDeleteQuestion(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger shape="circle" icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageTitle title={`${examData?.name} - Questions`} />
        <div className="flex gap-2">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate("/admin/exams")}
          >
            Back to Exams
          </Button>
          <Button 
            type="primary" 
            icon={<PlusCircleOutlined />} 
            onClick={() => {
              setSelectedQuestion(null);
              form.resetFields();
              setShowAddEditQuestionModal(true);
            }}
          >
            Add Question
          </Button>
        </div>
      </div>

      <div className="divider"></div>

      {examData && (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex gap-3 w-full items-center">
            <h1 className="text-md">Total Marks: {examData?.totalMarks || 0}</h1>
            <h1 className="text-md">Passing Marks: {examData?.passingMarks || 0}</h1>
            <h1 className="text-md">Questions: {examData?.questions?.length || 0}</h1>
            <h1 className="text-md">Category: {examData?.category}</h1>
          </div>

          <Table 
            columns={questionsColumns} 
            dataSource={examData?.questions || []} 
            rowKey="_id" 
            pagination={{ pageSize: 10 }} 
          />
        </div>
      )}

      <Modal
        title={selectedQuestion ? "Edit Question" : "Add Question"}
        visible={showAddEditQuestionModal}
        onCancel={() => setShowAddEditQuestionModal(false)}
        footer={null}
        width={800}
      >
        <Form 
          form={form}
          layout="vertical" 
          onFinish={handleAddQuestion}
        >
          <Form.Item
            name="name"
            label="Question"
            rules={[{ required: true, message: "Please enter question" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Form.Item
              name="A"
              label="Option A"
              rules={[{ required: true, message: "Please enter Option A" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="B"
              label="Option B"
              rules={[{ required: true, message: "Please enter Option B" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="C"
              label="Option C"
              rules={[{ required: true, message: "Please enter Option C" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="D"
              label="Option D"
              rules={[{ required: true, message: "Please enter Option D" }]}
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            name="correctOption"
            label="Correct Option"
            rules={[{ required: true, message: "Please select the correct option" }]}
          >
            <Input.Group compact>
              <Form.Item
                name="correctOption"
                noStyle
              >
                <Input.Group compact>
                  <Button.Group>
                    <Button 
                      type={form.getFieldValue('correctOption') === 'A' ? 'primary' : 'default'}
                      onClick={() => form.setFieldsValue({ correctOption: 'A' })}
                    >
                      A
                    </Button>
                    <Button 
                      type={form.getFieldValue('correctOption') === 'B' ? 'primary' : 'default'} 
                      onClick={() => form.setFieldsValue({ correctOption: 'B' })}
                    >
                      B
                    </Button>
                    <Button 
                      type={form.getFieldValue('correctOption') === 'C' ? 'primary' : 'default'} 
                      onClick={() => form.setFieldsValue({ correctOption: 'C' })}
                    >
                      C
                    </Button>
                    <Button 
                      type={form.getFieldValue('correctOption') === 'D' ? 'primary' : 'default'} 
                      onClick={() => form.setFieldsValue({ correctOption: 'D' })}
                    >
                      D
                    </Button>
                  </Button.Group>
                </Input.Group>
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <div className="flex justify-end mt-2 gap-2">
            <Button onClick={() => setShowAddEditQuestionModal(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {selectedQuestion ? "Update Question" : "Add Question"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default AddEditQuestion;
