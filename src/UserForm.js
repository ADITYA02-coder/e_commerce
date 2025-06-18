import React from "react";
// import Form from "react-bootstrap/Form";
import { Formik, Form, Field } from "formik";
import { InputMask } from "@react-input/mask";
import * as Yup from "yup";
import { Facebook, Github, Google, TwitterX } from "react-bootstrap-icons";
const DisplayingErrorMessagesSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  mobile: Yup.string().length(10, "Too Long!").required("Required"),
  aadhar: Yup.string().length(12, "Too long!").required("Required"),
  pincode: Yup.string().length(6, "Too Long!").required("Required"),
});
const UserForm = () => {
  function validateEmail(value) {
    let error;
    if (!value) {
      error = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Invalid email address";
    }
    return error;
  }
  return (
    <div>
      <h1>Signup</h1>
      <Formik
        initialValues={{
          username: "",
          email: "",
          mobile: "",
          aadhar: "",
          pincode: "",
        }}
        validationSchema={DisplayingErrorMessagesSchema}
        onSubmit={(values) => {
          // same shape as initial values
          console.log(values);
        }}
      >
        {({ errors, touched }) => (
          <div>
            <ul
              class="nav nav-pills nav-justified mb-3"
              id="ex1"
              role="tablist"
            >
              <li class="nav-item" role="presentation">
                <a
                  class="nav-link active"
                  id="tab-login"
                  data-mdb-pill-init
                  href="#pills-login"
                  role="tab"
                  aria-controls="pills-login"
                  aria-selected="true"
                >
                  Login
                </a>
              </li>
              <li class="nav-item" role="presentation">
                <a
                  class="nav-link"
                  id="tab-register"
                  data-mdb-pill-init
                  href="#pills-register"
                  role="tab"
                  aria-controls="pills-register"
                  aria-selected="false"
                >
                  Register
                </a>
              </li>
            </ul>

            <div class="tab-content">
              <div
                class="tab-pane fade show active"
                id="pills-login"
                role="tabpanel"
                aria-labelledby="tab-login"
              >
                <form>
                  <div class="text-center mb-3">
                    <p>Sign in with:</p>
                    <button
                      type="button"
                      data-mdb-button-init
                      data-mdb-ripple-init
                      class="btn btn-link btn-floating mx-1"
                    >
                      <Facebook/>
                    </button>

                    <button
                      type="button"
                      data-mdb-button-init
                      data-mdb-ripple-init
                      class="btn btn-link btn-floating mx-1"
                    >
                      <Google/>
                    </button>

                    <button
                      type="button"
                      data-mdb-button-init
                      data-mdb-ripple-init
                      class="btn btn-link btn-floating mx-1"
                    >
                      <TwitterX/>
                    </button>

                    <button
                      type="button"
                      data-mdb-button-init
                      data-mdb-ripple-init
                      class="btn btn-link btn-floating mx-1"
                    >
                      <Github/>
                    </button>
                  </div>

                  <p class="text-center">or:</p>

                  <div data-mdb-input-init class="form-outline mb-4">
                    <input type="email" id="loginName" class="form-control" />
                    <label class="form-label" for="loginName">
                      Email or username
                    </label>
                  </div>

                  <div data-mdb-input-init class="form-outline mb-4">
                    <input
                      type="password"
                      id="loginPassword"
                      class="form-control"
                    />
                    <label class="form-label" for="loginPassword">
                      Password
                    </label>
                  </div>

                  <div class="row mb-4">
                    <div class="col-md-6 d-flex justify-content-center">
                      <div class="form-check mb-3 mb-md-0">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value=""
                          id="loginCheck"
                          checked
                        />
                        <label class="form-check-label" for="loginCheck">
                          {" "}
                          Remember me{" "}
                        </label>
                      </div>
                    </div>

                    <div class="col-md-6 d-flex justify-content-center">
                      <a href="#!">Forgot password?</a>
                    </div>
                  </div>

                  <button
                    type="submit"
                    data-mdb-button-init
                    data-mdb-ripple-init
                    class="btn btn-primary btn-block mb-4"
                  >
                    Sign in
                  </button>

                  <div class="text-center">
                    <p>
                      Not a member? <a href="#!">Register</a>
                    </p>
                  </div>
                </form>
              </div>
              <div
                class="tab-pane fade"
                id="pills-register"
                role="tabpanel"
                aria-labelledby="tab-register"
              >
                <form>
                  <div class="text-center mb-3">
                    <p>Sign up with:</p>
                    <button
                      type="button"
                      data-mdb-button-init
                      data-mdb-ripple-init
                      class="btn btn-link btn-floating mx-1"
                    >
                      <i class="fab fa-facebook-f"></i>
                    </button>

                    <button
                      type="button"
                      data-mdb-button-init
                      data-mdb-ripple-init
                      class="btn btn-link btn-floating mx-1"
                    >
                      <i class="fab fa-google"></i>
                    </button>

                    <button
                      type="button"
                      data-mdb-button-init
                      data-mdb-ripple-init
                      class="btn btn-link btn-floating mx-1"
                    >
                      <i class="fab fa-twitter"></i>
                    </button>

                    <button
                      type="button"
                      data-mdb-button-init
                      data-mdb-ripple-init
                      class="btn btn-link btn-floating mx-1"
                    >
                      <i class="fab fa-github"></i>
                    </button>
                  </div>

                  <p class="text-center">or:</p>

                  <div data-mdb-input-init class="form-outline mb-4">
                    <input type="text" id="registerName" class="form-control" />
                    <label class="form-label" for="registerName">
                      Name
                    </label>
                  </div>

                  <div data-mdb-input-init class="form-outline mb-4">
                    <input
                      type="text"
                      id="registerUsername"
                      class="form-control"
                    />
                    <label class="form-label" for="registerUsername">
                      Username
                    </label>
                  </div>

                  <div data-mdb-input-init class="form-outline mb-4">
                    <input
                      type="email"
                      id="registerEmail"
                      class="form-control"
                    />
                    <label class="form-label" for="registerEmail">
                      Email
                    </label>
                  </div>

                  <div data-mdb-input-init class="form-outline mb-4">
                    <input
                      type="password"
                      id="registerPassword"
                      class="form-control"
                    />
                    <label class="form-label" for="registerPassword">
                      Password
                    </label>
                  </div>

                  <div data-mdb-input-init class="form-outline mb-4">
                    <input
                      type="password"
                      id="registerRepeatPassword"
                      class="form-control"
                    />
                    <label class="form-label" for="registerRepeatPassword">
                      Repeat password
                    </label>
                  </div>

                  <div class="form-check d-flex justify-content-center mb-4">
                    <input
                      class="form-check-input me-2"
                      type="checkbox"
                      value=""
                      id="registerCheck"
                      checked
                      aria-describedby="registerCheckHelpText"
                    />
                    <label class="form-check-label" for="registerCheck">
                      I have read and agree to the terms
                    </label>
                  </div>

                  <button
                    type="submit"
                    data-mdb-button-init
                    data-mdb-ripple-init
                    class="btn btn-primary btn-block mb-3"
                  >
                    Sign in
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default UserForm;
