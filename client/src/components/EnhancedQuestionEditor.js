import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  Upload, 
  Radio, 
  Space, 
  Divider,
  Alert,
  Tooltip,
  Typography
} from 'antd';
import { 
  PlusOutlined, 
  MinusCircleOutlined, 
  UploadOutlined, 
  InfoCircleOutlined, 
  PictureOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

/**
 * Enhanced Question Editor Component
 * Allows creation of multiple question types that convert to MCQ format for the quiz engine
 */
function EnhancedQuestionEditor({ 
  initialValues = {}, 
  onFinish, 
  onCancel,
  loading = false
}) {
  const [form] = Form.useForm();
  const [questionType, setQuestionType] = useState(initialValues.questionType || 'multiple-choice');
  const [mediaType, setMediaType] = useState(initialValues.mediaType || 'none');
  const [fileList, setFileList] = useState([]);

  // Set initial form values when editing an existing question
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      form.setFieldsValue({
        ...initialValues,
        // Handle special fields that need formatting
        mediaFile: initialValues.mediaUrl ? [{ url: initialValues.mediaUrl }] : []
      });
      setQuestionType(initialValues.questionType || 'multiple-choice');
      setMediaType(initialValues.mediaType || 'none');
      
      if (initialValues.mediaUrl) {
        setFileList([{ 
          uid: '-1', 
          name: 'Current Media', 
          status: 'done',
          url: initialValues.mediaUrl
        }]);
      }
    }
  }, [initialValues, form]);

  // Handle question type change
  const handleQuestionTypeChange = (value) => {
    setQuestionType(value);
    
    // Reset related fields when changing question type
    if (value === 'true-false') {
      form.setFieldsValue({
        options: { A: 'True', B: 'False' },
        correctOption: initialValues.correctOption || 'A'
      });
    }
  };
  
  // Handle media type change
  const handleMediaTypeChange = (value) => {
    setMediaType(value);
    if (value === 'none') {
      form.setFieldsValue({ mediaUrl: '' });
      setFileList([]);
    }
  };

  // Handle file upload for media questions
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
    
    // Set the media URL if file is uploaded
    if (fileList.length > 0 && fileList[0].response) {
      form.setFieldsValue({ mediaUrl: fileList[0].response.url });
    } else if (fileList.length > 0 && fileList[0].url) {
      form.setFieldsValue({ mediaUrl: fileList[0].url });
    } else {
      form.setFieldsValue({ mediaUrl: '' });
    }
  };
  
  // Handle form submission
  const handleSubmit = (values) => {
    // Format the form values
    const formattedValues = {
      ...values,
      // Additional formatting as needed
    };
    
    onFinish(formattedValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        name: '',
        questionType: 'multiple-choice',
        correctOption: 'A',
        options: { A: '', B: '', C: '', D: '' },
        mediaType: 'none',
        mediaUrl: '',
        explanation: '',
        difficulty: 'medium',
        points: 1,
        tags: []
      }}
    >
      <Form.Item
        name="questionType"
        label="Question Type"
        rules={[{ required: true, message: 'Please select the question type' }]}
      >
        <Select onChange={handleQuestionTypeChange}>
          <Option value="multiple-choice">Multiple Choice</Option>
          <Option value="true-false">True/False</Option>
          <Option value="matching">Matching</Option>
          <Option value="short-answer">Short Answer (auto-converted to MCQ)</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="name"
        label="Question Text"
        rules={[{ required: true, message: 'Please enter the question' }]}
      >
        <TextArea rows={3} placeholder="Enter your question here" />
      </Form.Item>

      <Form.Item
        name="mediaType"
        label="Add Media"
      >
        <Select onChange={handleMediaTypeChange}>
          <Option value="none">None</Option>
          <Option value="image">Image</Option>
          <Option value="audio">Audio</Option>
          <Option value="video">Video</Option>
        </Select>
      </Form.Item>

      {mediaType !== 'none' && (
        <Form.Item
          name="mediaUrl"
          label={`${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} URL`}
          extra={`Enter the URL for your ${mediaType} or upload a file`}
        >
          <Input placeholder={`Enter ${mediaType} URL`} />
        </Form.Item>
      )}

      {mediaType !== 'none' && (
        <Form.Item label="Upload File">
          <Upload
            listType={mediaType === 'image' ? 'picture' : 'text'}
            maxCount={1}
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false} // Prevent auto-upload
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
      )}

      <Divider orientation="left">Answer Options</Divider>

      {questionType === 'multiple-choice' && (
        <>
          <div className="option-grid">
            {['A', 'B', 'C', 'D'].map((option) => (
              <Form.Item
                key={option}
                label={`Option ${option}`}
                name={['options', option]}
                className="option-item"
                rules={[{ required: true, message: `Please enter Option ${option}` }]}
              >
                <Input placeholder={`Enter Option ${option}`} />
              </Form.Item>
            ))}
          </div>

          <Form.Item
            name="correctOption"
            label="Correct Answer"
            rules={[{ required: true, message: 'Please select the correct answer' }]}
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="A">A</Radio.Button>
              <Radio.Button value="B">B</Radio.Button>
              <Radio.Button value="C">C</Radio.Button>
              <Radio.Button value="D">D</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </>
      )}

      {questionType === 'true-false' && (
        <>
          <Alert 
            message="True/False Question"
            description="Option A represents 'True' and Option B represents 'False'"
            type="info" 
            showIcon 
            style={{ marginBottom: '16px' }} 
          />
          
          <Form.Item
            name="correctOption"
            label="Correct Answer"
            rules={[{ required: true, message: 'Please select the correct answer' }]}
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="A"><CheckOutlined /> True</Radio.Button>
              <Radio.Button value="B"><CloseOutlined /> False</Radio.Button>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item noStyle>
            <Input type="hidden" name={['options', 'A']} value="True" />
            <Input type="hidden" name={['options', 'B']} value="False" />
            <Input type="hidden" name={['options', 'C']} value="" />
            <Input type="hidden" name={['options', 'D']} value="" />
          </Form.Item>
        </>
      )}
      
      {questionType === 'matching' && (
        <>
          <Alert
            message="Matching Question"
            description="Enter pairs to match. These will be converted to multiple choice format."
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          
          <Form.List name="matchingPairs">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'left']}
                      rules={[{ required: true, message: 'Missing left item' }]}
                    >
                      <Input placeholder="Left item" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'right']}
                      rules={[{ required: true, message: 'Missing right item' }]}
                    >
                      <Input placeholder="Right item" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Matching Pair
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          
          <div className="matching-note">
            <Text type="secondary">
              <InfoCircleOutlined /> Matching pairs will be converted to multiple choice questions
              where students need to select the correct match.
            </Text>
          </div>
        </>
      )}
      
      {questionType === 'short-answer' && (
        <>
          <Alert
            message="Short Answer Question"
            description="Enter the correct answer and alternative accepted answers."
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          
          <Form.Item
            name="shortAnswerCorrect"
            label="Correct Answer"
            rules={[{ required: true, message: 'Please enter the correct answer' }]}
          >
            <Input placeholder="Enter the correct answer" />
          </Form.Item>
          
          <Form.List name="alternativeAnswers">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name]}
                      rules={[{ required: true, message: 'Missing alternative answer' }]}
                    >
                      <Input placeholder="Alternative accepted answer" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Alternative Answer
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          
          <div className="short-answer-note">
            <Text type="secondary">
              <InfoCircleOutlined /> Short answer questions will be converted to multiple choice
              format for the quiz. The system will generate plausible distractors.
            </Text>
          </div>
        </>
      )}

      <Divider orientation="left">Additional Information</Divider>
      
      <Form.Item name="explanation" label="Explanation">
        <TextArea 
          rows={3} 
          placeholder="Explanation for the correct answer (shown after answering)"
        />
      </Form.Item>

      <Form.Item name="difficulty" label="Difficulty Level">
        <Select>
          <Option value="easy">Easy</Option>
          <Option value="medium">Medium</Option>
          <Option value="hard">Hard</Option>
        </Select>
      </Form.Item>

      <Form.Item name="points" label="Points">
        <Input type="number" min={1} />
      </Form.Item>

      <Form.Item name="tags" label="Tags">
        <Select mode="tags" placeholder="Add tags">
          <Option value="math">Math</Option>
          <Option value="science">Science</Option>
          <Option value="history">History</Option>
          <Option value="language">Language</Option>
        </Select>
      </Form.Item>

      <Form.Item className="form-actions">
        <Space>
          <Button onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {Object.keys(initialValues).length > 0 ? 'Update Question' : 'Add Question'}
          </Button>
        </Space>
      </Form.Item>
      
      <style jsx="true">{`
        .option-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        
        .form-actions {
          margin-top: 24px;
          display: flex;
          justify-content: flex-end;
        }
        
        .matching-note,
        .short-answer-note {
          margin: 16px 0;
          padding: 12px;
          background-color: var(--background-tertiary);
          border-radius: 8px;
        }
        
        @media (max-width: 768px) {
          .option-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Form>
  );
}

export default EnhancedQuestionEditor;