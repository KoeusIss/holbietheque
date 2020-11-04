/**
 * Login views related to the route @/login where the user can login to a new
 * session by providing his credentials as email and password and pick up
 * between to be a student or a recruiter
 */

import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import AuthService from "../../services/auth_service";
import User from "../../models/User";
import UserService from "../../services/user_service";
import {Formik} from "formik";
import * as yup from "yup";

import {toaster} from "evergreen-ui";
import LoginFrm from "./loginFrm";

/**
 * Login component
 * @returns {JSX.Element}
 * @constructor
 */
const Login = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  
  /**
   * initialValue is and instance of User class with email and password
   * attributes
   * @type {User}
   */
  const initialValue = new User()
  
  /**
   * handle submit values given by formik and sends an API request
   * in order to get an access_token to persist user connectivity
   * @param {object} values contains email, password
   */
  const onSubmit = (values) => {
    setLoading(true);
    AuthService.login(values).then(
      (response) => {
        setLoading(false);
        history.push("/");
        toaster.success(response.data.message, {duration: 5});
      },
      (error) => {
        const returnError =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setLoading(false);
        toaster.danger(returnError, {duration: 5});
      }
    );
  }
  
  /**
   * validationSchema is a yup object provides rules for fields
   */
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .required("Email is required")
      .matches(
        /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/,
        "Please provide a valid email address"
      ),
    password: yup
      .string()
      .required("Password is required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
  })
  
  return (
    <>
      <Formik
        initialValues={initialValue}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        render={({
                   values,
                   errors,
                   touched,
                   handleChange,
                   handleBlur,
                   handleSubmit,
                 }) => {
          return (
            <LoginFrm
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              handleBlur={handleBlur}
              touched={touched}
              errors={errors}
              values={values}
              loading={loading}
            />
          );
        }}
      />
    </>
  );
}
export default Login;
