import { Form, message } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Register() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      dispatch(ShowLoading());
      const response = await registerUser(values);
      dispatch(HideLoading());
      setLoading(false);

      if (response.success) {
        message.success(response.message);
        window.location.href = "/login";
      } else {
        message.error(response.message);
      }
    } catch (error) {
      setLoading(false);
      dispatch(HideLoading());
      message.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-primary">
      <div className="card w-400 p-3 bg-white">
        <div className="flex flex-col">
          <div className="flex justify-center">
            <h1 className="text-2xl font-bold text-center">
              Create Your Account
            </h1>
          </div>
          <div className="divider"></div>
          <Form
            form={form}
            layout="vertical"
            className="mt-2"
            onFinish={onFinish}
            initialValues={{ name: "", email: "", password: "" }}
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <input
                type="text"
                placeholder="Name"
                autoComplete="name"
                disabled={loading}
                className="input"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <input
                type="email"
                placeholder="Email address"
                autoComplete="email"
                disabled={loading}
                className="input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <input
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                disabled={loading}
                className="input"
              />
            </Form.Item>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="button button-primary mt-2 w-100"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
              <Link to="/login" className="text-center underline">
                Already a member? Login
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
