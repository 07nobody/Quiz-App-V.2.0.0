import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table, Form, Modal, Input, Button, message, Popconfirm, Tag, Tooltip } from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusCircleOutlined, 
  ArrowLeftOutlined,
  FileImageOutlined,
  CheckCircleOutlined 
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { 
  addQuestionToExam, 
  getExamById, 
  deleteQuestionById,
  editQuestionById
} from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import EnhancedQuestionEditor from "../../../components/EnhancedQuestionEditor";

function AddEditQuestion() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [examData, setExamData] = useState(null);
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [form] = Form.useForm();
  const [isAdvancedEditor, setIsAdvancedEditor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIsSubmitting(true);
      dispatch(ShowLoading());
      
      // Handle different question types
      let finalPayload = {};
      
      if (isAdvancedEditor) {
        // Process data from the enhanced editor
        const { questionType, mediaType, mediaUrl, ...rest } = values;
        
        // Process based on question type
        let options = {};
        let correctOption = '';
        
        switch (questionType) {
          case 'true-false':
            options = { A: 'True', B: 'False', C: '', D: '' };
            correctOption = values.correctOption;
            break;
            
          case 'multiple-choice':
            options = values.options;
            correctOption = values.correctOption;
            break;
            
          case 'matching':
            // Convert matching pairs to MCQ format
            if (values.matchingPairs && values.matchingPairs.length > 0) {
              const selectedPair = values.matchingPairs[0];
              options = {
                A: selectedPair.right,
                B: values.matchingPairs.length > 1 ? values.matchingPairs[1].right : 'No match',
                C: values.matchingPairs.length > 2 ? values.matchingPairs[2].right : 'No match',
                D: values.matchingPairs.length > 3 ? values.matchingPairs[3].right : 'No match'
              };
              correctOption = 'A'; // The correct match is always A
            }
            break;
            
          case 'short-answer':
            // Convert short answer to MCQ
            options = {
              A: values.shortAnswerCorrect,
              B: values.alternativeAnswers && values.alternativeAnswers.length > 0 ? 
                values.alternativeAnswers[0] : 'Incorrect answer 1',
              C: values.alternativeAnswers && values.alternativeAnswers.length > 1 ? 
                values.alternativeAnswers[1] : 'Incorrect answer 2',
              D: 'None of the above'
            };
            correctOption = 'A';
            break;
            
          default:
            options = values.options;
            correctOption = values.correctOption;
        }
        
        finalPayload = {
          name: values.name,
          correctOption,
          options,
          questionType,
          mediaType: mediaType || 'none',
          mediaUrl: mediaUrl || '',
          explanation: values.explanation || '',
          difficulty: values.difficulty || 'medium',
          points: values.points || 1,
          tags: values.tags || [],
          exam: params.id
        };
      } else {
        // Process data from the classic editor
        const tempOptions = {
          A: values.A,
          B: values.B,
          C: values.C,
          D: values.D,
        };
        
        finalPayload = {
          name: values.name,
          correctOption: values.correctOption,
          options: tempOptions,
          exam: params.id,
        };
      }
      
      let response;
      if (selectedQuestion) {
        response = await editQuestionById({
          ...finalPayload,
          questionId: selectedQuestion._id,
        });
      } else {
        response = await addQuestionToExam(finalPayload);
      }
      
      if (response.success) {
        message.success(response.message);
        getExamData();
        setShowAddEditQuestionModal(false);
        form.resetFields();
        setSelectedQuestion(null);
        setIsAdvancedEditor(false);
      } else {
        message.error(response.message);
      }
      
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    } finally {
      setIsSubmitting(false);
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
    
    // Check if this is an enhanced question type
    if (question.questionType && question.questionType !== 'multiple-choice') {
      setIsAdvancedEditor(true);
      // The EnhancedQuestionEditor will handle the form values
    } else {
      setIsAdvancedEditor(false);
      // Set form values for classic editor
      form.setFieldsValue({
        name: question.name,
        correctOption: question.correctOption,
        A: question.options.A,
        B: question.options.B,
        C: question.options.C,
        D: question.options.D,
      });
    }
    
    setShowAddEditQuestionModal(true);
  };

  useEffect(() => {
    getExamData();
  }, []);

  const questionsColumns = [
    {
      title: "Question",
      dataIndex: "name",
      ellipsis: true,
      width: '30%'
    },
    {
      title: "Type",
      dataIndex: "questionType",
      render: (type) => {
        const types = {
          'multiple-choice': { color: 'blue', label: 'Multiple Choice' },
          'true-false': { color: 'green', label: 'True/False' },
          'matching': { color: 'purple', label: 'Matching' },
          'short-answer': { color: 'orange', label: 'Short Answer' }
        };
        
        return (
          <Tag color={types[type]?.color || 'blue'}>
            {types[type]?.label || 'Multiple Choice'}
          </Tag>
        );
      }
    },
    {
      title: "Media",
      dataIndex: "mediaType",
      render: (mediaType, record) => {
        if (mediaType && mediaType !== 'none') {
          return (
            <Tooltip title="View Media">
              <Button 
                size="small" 
                icon={<FileImageOutlined />} 
                onClick={() => window.open(record.mediaUrl, '_blank')}
                disabled={!record.mediaUrl}
              />
            </Tooltip>
          );
        }
        return 'None';
      }
    },
    {
      title: "Correct Answer",
      dataIndex: "correctOption",
      render: (correctOption, record) => {
        const options = record.options || {};
        return (
          <Tag color="success">
            {correctOption}: {options[correctOption] || 'N/A'}
          </Tag>
        );
      }
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
              setIsAdvancedEditor(false);
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
          <div className="flex gap-3 w-full items-center flex-wrap">
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
        title={
          <div className="modal-title">
            {selectedQuestion ? "Edit Question" : "Add Question"}
            <div className="editor-toggle">
              <Button 
                type={isAdvancedEditor ? "primary" : "default"}
                onClick={() => setIsAdvancedEditor(!isAdvancedEditor)}
                size="small"
              >
                {isAdvancedEditor ? "Using Advanced Editor" : "Switch to Advanced Editor"}
              </Button>
            </div>
          </div>
        }
        open={showAddEditQuestionModal}
        onCancel={() => {
          setShowAddEditQuestionModal(false);
          setIsAdvancedEditor(false);
        }}
        footer={null}
        width={isAdvancedEditor ? 900 : 800}
      >
        {isAdvancedEditor ? (
          <EnhancedQuestionEditor 
            initialValues={selectedQuestion || {}}
            onFinish={handleAddQuestion}
            onCancel={() => setShowAddEditQuestionModal(false)}
            loading={isSubmitting}
          />
        ) : (
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
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                {selectedQuestion ? "Update Question" : "Add Question"}
              </Button>
            </div>
          </Form>
        )}
      </Modal>
      
      <style jsx="true">{`
        .divider {
          height: 1px;
          background-color: var(--border-color);
          margin: 16px 0;
        }
        
        .modal-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        
        .editor-toggle {
          margin-left: 16px;
        }
        
        .ant-table-cell {
          vertical-align: top;
        }
      `}</style>
    </div>
  );
}

export default AddEditQuestion;
