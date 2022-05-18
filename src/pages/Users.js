import React, { useState, useEffect } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { Link } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import CONFIG from "../config";
import { useSelector } from "react-redux";
import DateTimePicker from "react-datetime-picker";
import { useAlert } from "react-alert";
import Goback from "../components/Goback";

function Users() {
  const [show, setShow] = useState(false);
  const admin = useSelector((state) => state.login);
  const [list, setList] = useState([]);
  const alert = useAlert();

  const [allList, setAllList] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [selectedUser, setSelectedUser] = useState("");
  //   const [CancelToken, setcancelToken] = useState(null);
  const CancelToken = axios.CancelToken;
  const [source, setSource] = useState(null);
  useEffect(() => {
    var config = {
      method: "get",
      url: `${CONFIG.API_URL}/users`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        setList(response.data);
        setAllList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    return () => {};
  }, []);

  const deleteUser = () => {
    var config = {
      method: "delete",
      url: `${CONFIG.API_URL}/users/${selectedUser}`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        let k = [];
        list.forEach((ele, index) => {
          if (ele.id !== selectedUser) {
            k.push(ele);
          }
        });
        setList(k);
        alert("user deleted");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const searchByEmail = (e_data) => {
    if (source) {
      source.cancel("Operation canceled by the user.");
    }
    const C_source = CancelToken.source();
    setSource(C_source);

    var config = {
      method: "get",
      url: `${CONFIG.API_URL}/users?email_contains=${e_data}`,
      headers: {},
      cancelToken: C_source.token,
    };

    axios(config)
      .then(function (response) {
        setList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const sortByDate = (e_data) => {
    if (source) {
      source.cancel("Operation canceled by the user.");
    }
    const C_source = CancelToken.source();
    setSource(C_source);

    var config = {
      method: "get",
      url: `${CONFIG.API_URL}/users?_sort=created_at:${e_data}`,
      headers: {},
      cancelToken: C_source.token,
    };

    axios(config)
      .then(function (response) {
        setList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const sortByStatus = (sort) => {
    let active = [];
    let inActive = [];
    allList.forEach((ele, index) => {
      if (ele.blocked) {
        inActive.push(ele);
      } else {
        active.push(ele);
      }
    });
    if (sort === "active") {
      setList(active);
    }
    if (sort === "inactive") {
      setList(inActive);
    }
    if (sort === "clear") {
      setList(allList);
    }
  };

  return (
    <div>
      <main className="main-section">
        <div className="container-fluid">
          {/* Title, Breadcrumbs and Add Button Start */}
          <div className="row mb-3 mb-md-4">
            <div className="col-md-12">
              <Goback />
              <h1 className="h3 mb-2 mb-md-1">Benutzer</h1>
              <Breadcrumb className="cb-breadcrumb">
                <Breadcrumb.Item href="/admin">Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Benutzer</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          {/* Title, Breadcrumbs and Add Button End */}

          {/* Search and Filter Start */}
          <div className="row mb-md-4">
            <div className="col-md-4">
              <div className="form-group cb-form-group mb-3 mb-md-0">
                <div className="form-input-prepend">
                  <div className="input-prepend-icon">
                    <span className="material-icons">search</span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name or email..."
                    onChange={(e) => {
                      searchByEmail(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group cb-form-group mb-3 mb-md-0">
                <select
                  className="form-select"
                  placeholder="Select status"
                  onChange={(e) => {
                    sortByStatus(e.target.value);
                  }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="clear">Clear Sort</option>
                </select>
              </div>
            </div>
            <div className="col-md-4">
              {/* Calendar will display here */}
              <div className="form-group cb-form-group mb-3 mb-md-0">
                <select
                  className="form-select"
                  placeholder="Select duration"
                  onChange={(e) => {
                    sortByDate(e.target.value);
                  }}
                >
                  <option defaultChecked disabled selected>
                    Sort
                  </option>
                  <option value="DESC">Aufsteigend</option>
                  <option value="ASC">Absteigend</option>
                  <option value="">Sortierung löschen</option>
                </select>
              </div>
            </div>
          </div>
          {/* Search and Filter End  */}
          <p className="text-muted fs-14 mb-3">
            {list.length} Benutzer gefunden
          </p>

          {/* User List Table Start */}
          <div className="card cb-card overflow-hidden">
            <Table className="cb-table mb-0">
              <thead>
                <tr>
                  <th>
                    <div className="d-flex align-items-center">
                      Name{" "}
                      <span className="material-icons ms-1">unfold_more</span>
                    </div>
                  </th>
                  <th>
                    <div className="d-flex align-items-center">
                      EMail{" "}
                      <span className="material-icons ms-1">unfold_more</span>
                    </div>
                  </th>
                  <th>
                    <div className="d-flex align-items-center">
                      Rolle{" "}
                      <span className="material-icons ms-1">unfold_more</span>
                    </div>
                  </th>
                  <th>
                    <div className="d-flex align-items-center">
                      Zuletzt aktualisiert{" "}
                      <span className="material-icons ms-1">unfold_more</span>
                    </div>
                  </th>
                  <th>
                    <div className="d-flex align-items-center">
                      Status{" "}
                      <span className="material-icons ms-1">unfold_more</span>
                    </div>
                  </th>
                  <th>
                    <div className="d-flex align-items-center">Aktionen </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((ele, index) => {
                  return (
                    <tr>
                      <td data-title="Name" className="table-col-title">
                        <Link
                          to={`/admin/users-details/${ele.id}`}
                          state={{ userdetails: ele }}
                        >
                          <div className="d-flex align-items-center cb-list-item">
                            <div className="cb-icon-avatar cb-icon-secondary me-2 me-md-3">
                              {`${ele.firstname[0]}${ele.lastname[0]}`}
                            </div>
                            <h6 className="mb-0">
                              {`${ele.firstname} ${ele.lastname}`}
                            </h6>
                          </div>
                        </Link>
                      </td>
                      <td data-title="Email" className="table-col-xs-50">
                        <p className="mb-0">{ele.email}</p>
                      </td>
                      <td data-title="Role" className="table-col-xs-50">
                        <p className="mb-0">{ele.role.name}</p>
                      </td>
                      <td data-title="Last Login" className="table-col-xs-50">
                        <p className="mb-0">
                          {new Date(ele.updated_at).getUTCHours()} Stunden zuvor
                        </p>
                      </td>
                      <td data-title="Status" className="table-col-xs-50">
                        {ele.blocked ? (
                          <Badge bg="danger" className="cb-badge">
                            Inaktiv
                          </Badge>
                        ) : (
                          <Badge bg="primary" className="cb-badge">
                            Aktiv
                          </Badge>
                        )}
                        {/* <Badge bg="primary" className="cb-badge">
                          Active
                        </Badge> */}
                      </td>
                      <td data-title="Action" className="table-col-actions">
                        <button
                          className="btn-fab btn-danger btn-hover-effect"
                          onClick={() => {
                            handleShow();
                            setSelectedUser(ele.id);
                          }}
                          title="Delete"
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
          {/* User List Table End */}
        </div>

        {/* Delete User Popup Start */}
        <Modal show={show} onHide={handleClose} className="cb-modal" centered>
          <Modal.Header
            className="justify-content-center modal-header-border modal-title-separator"
            closeButton
          >
            <h4 className="mb-0">Benutzer löschen</h4>
          </Modal.Header>
          <Modal.Body className="">
            <div className="form-group cb-form-group">
              <label className="form-label">Grund</label>
              <textarea
                className="form-control form-textarea"
                placeholder="Grund verfassen"
              ></textarea>
              <p className="text-muted d-flex fs-14 mb-0 mt-1">
                <span className="material-icons me-1">info</span>
                Schreiben Sie den Grund, den Benutzer von der Website zu
                entfernen
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer className="modal-footer-border justify-content-between d-flex">
            <button
              onClick={handleClose}
              className="btn btn-gray btn-hover-effect"
            >
              Abbrechen
            </button>
            <button
              onClick={() => {
                deleteUser();
                handleClose();
              }}
              className="btn btn-danger btn-raised btn-hover-effect"
            >
              Benutzer löschen
            </button>
          </Modal.Footer>
        </Modal>
        {/* Delete User Popup End */}
      </main>
    </div>
  );
}

export default Users;
