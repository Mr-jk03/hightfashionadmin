import React, { useState } from "react";
import "../../css/style.css";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import * as auth from "../../features/redux/reduxGrid/reducer";
import { useNavigate } from "react-router-dom";
import { Login } from "../../config/apiFunction";

const Authentication = () => {
  const dataForm = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userName, setUserName] = useState<string>("");
  const [passWord, setPassword] = useState<string>("");

  const handleLogin = async () => {
    if (!userName || !passWord) {
      toast.warn("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    try {
      const res: any = await Login(userName, passWord);
      if (res) {
        toast.success("Đăng nhập thành công!");
        const data = {
          userName: res.data.email,
          role: res.data.role,
        };
        localStorage.setItem("viewUser", JSON.stringify(data));
        navigate("/dashboard");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Đã có lỗi xảy ra!";
      toast.error(errorMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="content">
      <div className="container">
        <div className="row">
          <div className="col-6">
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="mb-4">
                  <h3>
                    Sign In to <strong></strong>
                  </h3>
                  <p className="mb-4">Hight Fashion Website for Admin.</p>
                </div>

                <div className="form-group first">
                  <label htmlFor="username">Username</label>
                  <input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    type="text"
                    className="form-control"
                    id="username"
                  />
                </div>
                <div className="form-group last mb-4">
                  <label htmlFor="password">Password</label>
                  <input
                    value={passWord}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    type="password"
                    className="form-control"
                    id="password"
                  />
                </div>
                <div className="d-flex mb-5 align-items-center">
                  <label className="control control--checkbox mb-0">
                    <span className="caption">Remember me</span>
                    <input type="checkbox" />
                    <div className="control__indicator"></div>
                  </label>
                  <span className="ml-auto">
                    <a href="#" className="forgot-pass">
                      Forgot Password
                    </a>
                  </span>
                </div>
                <input
                  onClick={handleLogin}
                  type="submit"
                  value="Log In"
                  className="btn text-white btn-block btn-primary"
                />
              </div>
            </div>
          </div>
          <div className="col-6">
            <img
              src="https://www.jarvis-legal.com/wp-content/uploads/2020/05/undraw_file_sync_ot38.svg"
              alt="Image"
              className="img-fluid"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
