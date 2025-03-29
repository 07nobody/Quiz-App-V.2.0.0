import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Button, Avatar, Tabs, Tooltip, Form, Input, Modal } from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  EditOutlined, 
  SafetyOutlined, 
  LockOutlined,
  SaveOutlined, 
  CloseOutlined 
} from "@ant-design/icons";
import PageTitle from "../../../components/PageTitle";
import { getUserInfo, updateUserProfile, changePassword } from "../../../apicalls/users";
import { SetUser } from "../../../redux/usersSlice";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import ResponsiveCard from "../../../components/ResponsiveCard";
import InfoItem from "../../../components/InfoItem";
import ActionButtons from "../../../components/ActionButtons";

function Profile() {
  const { user } = useSelector((state) => state.users);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [editing, setEditing] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const dispatch = useDispatch();

  const refreshUserData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getUserInfo();
      dispatch(HideLoading());
      if (response.success) {
        dispatch(SetUser(response.data));
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      refreshUserData();
    } else if (editing) {
      // Only set form values when editing mode is on and user data is available
      form.setFieldsValue({
        name: user.name,
        email: user.email
      });
    }
  }, [user, form, editing]);

  // Reset password form when modal is opened
  useEffect(() => {
    if (passwordModalVisible) {
      passwordForm.resetFields();
    }
  }, [passwordModalVisible, passwordForm]);

  const handleUpdateProfile = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await updateUserProfile(values);
      dispatch(HideLoading());
      if (response.success) {
        message.success("Profile updated successfully");
        dispatch(SetUser(response.data));
        setEditing(false);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const handleChangePassword = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      dispatch(HideLoading());
      
      if (response.success) {
        message.success("Password changed successfully");
        setPasswordModalVisible(false);
        passwordForm.resetFields();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const tabItems = [
    {
      key: "1",
      label: "Profile Information",
      children: (
        <div className="profile-tab-content">
          {editing ? (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
              className="profile-form"
            >
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Enter your name" />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Enter your email" disabled />
              </Form.Item>
              
              <ActionButtons>
                <Button 
                  icon={<CloseOutlined />} 
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />}
                  htmlType="submit"
                >
                  Save Changes
                </Button>
              </ActionButtons>
            </Form>
          ) : (
            <div className="profile-info">
              <div className="info-group">
                <InfoItem 
                  icon={<UserOutlined />}
                  label="Name:" 
                  value={user?.name || "Not set"} 
                />
                
                <InfoItem 
                  icon={<MailOutlined />}
                  label="Email:" 
                  value={user?.email} 
                />
                
                <InfoItem 
                  icon={<SafetyOutlined />}
                  label="Role:" 
                  value={user?.isAdmin ? "Administrator" : "Student"} 
                />
              </div>
              
              <ActionButtons>
                <Button 
                  type="primary" 
                  icon={<EditOutlined />} 
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </Button>
                <Button 
                  icon={<LockOutlined />}
                  onClick={() => setPasswordModalVisible(true)}
                >
                  Change Password
                </Button>
              </ActionButtons>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: "Activity Summary",
      children: (
        <div className="activity-summary">
          <div className="stat-cards">
            <div className="stat-card total-exams">
              <div className="stat-value">0</div>
              <div className="stat-label">Exams Taken</div>
            </div>
            
            <div className="stat-card passed-exams">
              <div className="stat-value">0</div>
              <div className="stat-label">Exams Passed</div>
            </div>
            
            <div className="stat-card avg-score">
              <div className="stat-value">-</div>
              <div className="stat-label">Avg. Score</div>
            </div>
          </div>
          
          <div className="activity-note">
            <p>Start taking exams to see your activity summary here!</p>
          </div>
        </div>
      )
    }
  ];

  if (!user) {
    return null; // Don't render anything until we have user data
  }

  return (
    <div className="profile-container">
      <PageTitle title="My Profile" />
      
      <div className="profile-content">
        <div className="profile-header">
          <Avatar 
            size={100} 
            className="profile-avatar"
          >
            {getInitials(user?.name)}
          </Avatar>
          
          <div className="profile-title">
            <h2 className="profile-name">{user?.name}</h2>
            <p className="profile-role">{user?.isAdmin ? "Administrator" : "Student"}</p>
          </div>
        </div>
        
        <ResponsiveCard>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="profile-tabs"
          />
        </ResponsiveCard>
      </div>
      
      <Modal
        title="Change Password"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: "Please enter your current password" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Enter current password" />
          </Form.Item>
          
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter your new password" },
              { min: 6, message: "Password must be at least 6 characters" }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Enter new password" />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm new password" />
          </Form.Item>
          
          <ActionButtons>
            <Button onClick={() => setPasswordModalVisible(false)}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
            >
              Change Password
            </Button>
          </ActionButtons>
        </Form>
      </Modal>

      <style jsx="true">{`
        .profile-container {
          padding: 0.5rem;
        }
        
        .profile-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .profile-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1rem 0;
        }
        
        .profile-avatar {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          font-weight: bold;
          font-size: 2rem;
          box-shadow: 0 8px 25px rgba(67, 97, 238, 0.3);
        }
        
        .profile-title {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .profile-name {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }
        
        .profile-role {
          font-size: 1rem;
          color: var(--text-secondary);
          margin: 0;
        }
        
        .profile-tab-content {
          padding: 0.5rem;
        }
        
        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .info-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .profile-form {
          max-width: 600px;
        }
        
        .activity-summary {
          padding: 1rem 0;
        }
        
        .stat-cards {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          flex: 1;
          min-width: 140px;
          padding: 1.5rem;
          border-radius: var(--border-radius);
          text-align: center;
          box-shadow: var(--box-shadow);
          transition: var(--transition);
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--box-shadow-hover);
        }
        
        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        .total-exams {
          background-color: rgba(67, 97, 238, 0.1);
        }
        
        .total-exams .stat-value {
          color: var(--primary);
        }
        
        .passed-exams {
          background-color: rgba(46, 204, 113, 0.1);
        }
        
        .passed-exams .stat-value {
          color: var(--success);
        }
        
        .avg-score {
          background-color: rgba(255, 107, 107, 0.1);
        }
        
        .avg-score .stat-value {
          color: var(--secondary);
        }
        
        .activity-note {
          text-align: center;
          color: var(--text-secondary);
          margin-top: 2rem;
        }
        
        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            text-align: center;
          }
          
          .stat-cards {
            flex-direction: column;
          }
          
          .stat-card {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default Profile;
