/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Register = () => {
  const navigate = useNavigate();

  const initialRegisterValues = {
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    picturePath: null,
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required("Firstname is required"),
    lastname: Yup.string().required("Lastname is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email address is required"),
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be 20 characters or less")
      .required("Username is required"),
    password: Yup.string()
      .min(8, "Password must be at least 3 characters")
      .max(20, "Password must be 20 characters or less")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const onRegister = async (values, { setErrors, setSubmitting }) => {
    if (values.password !== values.confirmPassword) {
      setErrors({
        confirmPassword: "Password and Confirm Password do not match",
      });
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    for (let key in values) {
      formData.append(key, values[key]);
    }

    try {
      const response = await axios.post(
        "http://localhost:5501/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data) {
        const errorMessage = err.response.data.error;
        if (errorMessage.includes("Email already in use")) {
          setErrors({
            email: "User already exists. Please use a different email address.",
          });
        } else if (
          errorMessage.includes("Password and confirm password do not match")
        ) {
          setErrors({
            confirmPassword: "Password and Confirm Password do not match",
          });
        } else {
          setErrors({
            email: "Registration failed. Please try again later.",
          });
        }
      } else {
        setErrors({
          email: "Registration failed. Please try again later.",
        });
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <Formik
          initialValues={initialRegisterValues}
          validationSchema={validationSchema}
          onSubmit={onRegister}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="firstname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Firstname
                </label>
                <Field
                  type="text"
                  name="firstname"
                  placeholder="First name"
                  className="w-full p-2 mt-1 border rounded"
                />
                <ErrorMessage
                  name="firstname"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
              <div>
                <label
                  htmlFor="lastname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Lastname
                </label>
                <Field
                  type="text"
                  name="lastname"
                  placeholder="Last name"
                  className="w-full p-2 mt-1 border rounded"
                />
                <ErrorMessage
                  name="lastname"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-2 mt-1 border rounded"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <Field
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="w-full p-2 mt-1 border rounded"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
              <div>
                <label
                  htmlFor="picturePath"
                  className="block text-sm font-medium text-gray-700"
                >
                  Profile Picture
                </label>
                <input
                  type="file"
                  name="picturePath"
                  onChange={(event) => {
                    setFieldValue("picturePath", event.currentTarget.files[0]);
                  }}
                  className="w-full p-2 mt-1 border rounded"
                />
                <ErrorMessage
                  name="picturePath"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-2 mt-1 border rounded"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full p-2 mt-1 border rounded"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 mt-4 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>
        <div className="mt-4 text-center">
          <span>Do you have an account?</span>
          <Link to="/login" className="text-blue-600 hover:underline">
            Click here to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
