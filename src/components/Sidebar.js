import axios from "axios";
import { useState, useEffect } from "react";

import config from "../config";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        config.apiPath + "/user/info",
        config.headers()
      );
      if (res.data.result !== undefined) {
        setUser(res.data.result);
      }
    } catch (error) {
      Swal.fire({
        title: "error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const handleSignOut = async () => {
    try {
      const button = await Swal.fire({
        title: "ออกจากระบบ",
        text: "ยืนยันการออกจากระบบ",
        icon: "question",
        showCancelButton: true,   
        showConfirmButton: true,
      });
      if (button.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      Swal.fire({
        title: "error",
        text: error.message,
        icon: "error",
      });
    }
  };
  return (
    <>
      <aside class="main-sidebar sidebar-dark-primary elevation-4">
        <a href="index3.html" class="brand-link">
          <img
            src="dist/img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            class="brand-image img-circle elevation-3"
            style={{ opacity: ".8" }}
          />
          <span class="brand-text font-weight-light">AdminLTE 3</span>
        </a>

        <div class="sidebar">
          <div class="user-panel mt-3 pb-3 mb-3 d-flex">
            <div class="image">
              <img
                src="dist/img/user2-160x160.jpg"
                class="img-circle elevation-2"
                alt="User Image"
              />
            </div>
            <div class="info">
              <a href="#" class="d-block">
                {user.name}
              </a>
              <button onClick={handleSignOut} className="btn btn-danger">
                {/* add sign out button  */}
                <i className="fa fa-times mr-2"></i>Sign Out
              </button>
            </div>
          </div>

          <div class="form-inline">
            <div class="input-group" data-widget="sidebar-search">
              <input
                class="form-control form-control-sidebar"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <div class="input-group-append">
                <button class="btn btn-sidebar">
                  <i class="fas fa-search fa-fw"></i>
                </button>
              </div>
            </div>
          </div>

          <nav class="mt-2">
            <ul
              class="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
 
              <li class="nav-header">Menu</li>
              <li class="nav-item">
                <Link to="/product" class="nav-link">
                  <i class="nav-icon fa fa-box"></i>
                  <p>
                    Product
                    <span class="badge badge-info right">2</span>
                  </p>
                </Link>
              </li>
              <li class="nav-item">
                <Link to ="/billSale" class="nav-link">
                <i class="nav-icon fa fa-coins"></i>
                  <p>รายงานยอดขาย</p>
                </Link>
              </li>
              <li class="nav-item">
                <a href="pages/kanban.html" class="nav-link">
                  <i class="nav-icon fas fa-columns"></i>
                  <p>Kanban Board</p>
                </a>
              </li>

             
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
export default Sidebar;
