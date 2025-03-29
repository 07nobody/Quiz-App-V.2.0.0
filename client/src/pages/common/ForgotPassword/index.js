import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { forgotPassword } from "../../../apicalls/users";

function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      dispatch(ShowLoading());

      const response = await forgotPassword(values.email);
      
      dispatch(HideLoading());
      setLoading(false);

      if (response.success) {
        message.success(response.message);
        form.resetFields();
        // Navigate to OTP verification page or show OTP input
        navigate(`/reset-password/${encodeURIComponent(values.email)}`);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      setLoading(false);
      message.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-primary">
      <div className="card w-400 p-3 bg-white">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-center">Reset Password</h1>
          <div className="divider"></div>
          
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                placeholder="Enter your registered email"
                className="input"
                disabled={loading}
              />
            </Form.Item>

            <div className="flex flex-col gap-2">
              <Button
                type="primary"
                htmlType="submit"
                className="primary-contained-btn mt-3"
                loading={loading}
                block
              >
                Send Reset Link
              </Button>
              
              <Link to="/login" className="text-center underline">
                Back to Login
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;