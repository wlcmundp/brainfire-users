import React, { useState, useEffect } from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import GraphImage from "../assets/images/graph-image.png";
import axios from "axios";
import CONFIG from "../config";
import { useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { useLocation, useParams } from "react-router-dom";
import Goback from "../components/Goback";
import Dropdown from "react-bootstrap/Dropdown";
import ListGroup from "react-bootstrap/ListGroup";

function UserDetails(props) {
  let params = useParams();
  const state = useSelector((state) => state.login);
  const alert = useAlert();
  let location = useLocation();
  const [firstName, setfirstName] = useState("");
  const [lastname, setlastnae] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [disbaled, setDisbaled] = useState(true);

  // const [company_name, setCompany_name] = useState("");
  const [designation, setDesignation] = useState("");
  const [company_address, setCompany_address] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setcity] = useState("");
  const [country, setCountry] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [blocked, setBlocked] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [userId, setUserId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [userDesignation, setUserDesignation] = useState("");
  useEffect(() => {
    if (location.state) {
      if (location.state.userdetails) {
        let response = location.state.userdetails;
        setfirstName(response.firstname);
        setlastnae(response.lastname);
        setUserId(response.id);
        setEmail(response.email);
        setUserDesignation(response.designation);
        if (!response.company) {
          if (response.company_details) {
            setCompany(response.company_details.name);
            setDesignation(response.company_details.Designation);
            setCompany_address(response.company_details.company_address);
            setPostalCode(response.company_details.PostalCode);
            setcity(response.company_details.City);
            setCountry(response.company_details.Country);
          }
        } else {
          setSelectedCompany(response.company.id - 1);
          setCompany(response.company.name);
          setDesignation(response.company.Designation);
          setCompany_address(response.company.company_address);
          setPostalCode(response.company.PostalCode);
          setcity(response.company.City);
          setCountry(response.company.Country);
        }
      }
    } else {
      let id = params.id;
      fetchProfile(id);
    }
    let id = params.id;
    fetchProfile(id);
    // fetchCompanies();
    // setfirstName(state.firstname);
    // setlastnae(state.lastname);
    // setEmail(state.email);

    return () => {};
  }, []);
  const fetchProfile = (id) => {
    var config = {
      method: "get",
      url: `${CONFIG.API_URL}/users/${id}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        // setCompany(response.data.company);
        setUserId(response.data.id);
        setfirstName(response.data.firstname);
        setlastnae(response.data.lastname);
        setEmail(response.data.email);
        setUserDesignation(response.data.designation);
        if (!response.data.company) {
          setCompany(response.data.company_details.name);
          setDesignation(response.data.company_details.Designation);
          setCompany_address(response.data.company_details.company_address);
          setPostalCode(response.data.company_details.PostalCode);
          setcity(response.data.company_details.City);
          setCountry(response.data.company_details.Country);
        } else {
          // setSelectedCompany(response.data.company.id - 1);
          setCompany(response.data.company.name);
          setDesignation(response.data.company.Designation);
          setCompany_address(response.data.company.company_address);
          setPostalCode(response.data.company.PostalCode);
          setcity(response.data.company.City);
          setCountry(response.data.company.Country);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const fetchCompanies = (text) => {
    var config = {
      method: "get",
      url: `${CONFIG.API_URL}/companies?name_contains=${text}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        if (text) {
          setCompanyList(response.data);
        } else {
          setCompanyList([]);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const updateProfile = () => {
    let com = null;
    let comDetails = null;
    if (selectedCompany) {
      com = selectedCompany;
      comDetails = {
        name: company,
        designation: designation,
        company_address: company_address,
        PostalCode: postalCode,
        City: city,
        Country: country,
      };
    } else {
      comDetails = {
        name: company,
        designation: designation,
        company_address: company_address,
        PostalCode: postalCode,
        City: city,
        Country: country,
      };
    }

    if (selectedCompany) {
      updateCompany(comDetails);
    }

    var data = JSON.stringify({
      email: email,
      blocked: blocked,
      firstname: firstName,
      lastname: lastname,
      designation: userDesignation,
      company_details: comDetails,
      company: com,
    });

    var config = {
      method: "put",
      url: `${CONFIG.API_URL}/users/${userId}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        alert.success("Profile updated successfully");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const updateCompany = (data) => {
    var config = {
      method: "put",
      url: `${CONFIG.API_URL}/companies/${selectedCompany.id}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    };
    axios(config)
      .then(function (response) {
        alert.success("Company updated successfully");
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error.response.data.data.errors);
      });
  };

  return (
    <div>
      <main className="main-section">
        <div className="container-fluid">
          {/* Title, Breadcrumbs and Back Button Start */}
          <div className="mb-3 mb-md-4">
            <Goback />
            <h1 className="h3 mb-0 mb-md-1">Mein Profil</h1>
            <Breadcrumb className="cb-breadcrumb">
              <Breadcrumb.Item href="/admin">Dashboard</Breadcrumb.Item>
              <Breadcrumb.Item active>Mein Profil</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          {/* Title, Breadcrumbs and Back Button End */}

          {/* Personal Details Start */}
          <div className="card cb-card mb-3 mb-md-4 single-col-form">
            <div className="card-header card-title-separator card-header-border d-flex justify-content-between align-item-center">
              <div>
                <h2 className="h5">Persönliche Daten</h2>
                <p className="card-subtitle">
                  Persönliche Daten unten bearbeiten
                </p>
              </div>
              <div>
                <button
                  className="btn btn-flat-link btn-link btn-icon-text btn-link-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    setDisbaled(!disbaled);
                  }}
                >
                  <span className="material-icons me-1">edit</span>
                  <span className="link-text">
                    Edit {disbaled ? "Enable" : "Disable"}
                  </span>
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group cb-form-group mb-4">
                    <label className="form-label">Foto hochladen</label>
                    <div className="custom-file-upload">
                      <input
                        type="file"
                        className="form-control"
                        id="upload-profile-photo"
                        disabled
                      />
                      {/* "placeholder-text" class apply when image path is not there */}
                      <label
                        className="custom-file-label"
                        for="upload-profile-photo"
                      >
                        my_profile_image.jpg
                        <span className="custom-input-btn ">
                          <i className="material-icons me-2">backup</i>
                          Browse
                        </span>
                      </label>
                    </div>
                    <p className="d-flex mb-0 fs-14 text-muted">
                      <span className="material-icons me-1">info</span>
                      Dateiformat Dateiformat JPG oder PNG wird unterstützt. Die
                      maximale Dateigröße beträgt 5 MB.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group cb-form-group mb-4">
                    <label className="form-label">Vorname</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Vorname eingeben"
                      value={firstName}
                      onChange={(e) => {
                        setfirstName(e.target.value);
                      }}
                      disabled={disbaled}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group cb-form-group mb-4">
                    <label className="form-label">Nachname</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nachname eingeben"
                      value={lastname}
                      onChange={(e) => {
                        setlastnae(e.target.value);
                      }}
                      disabled={disbaled}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group cb-form-group mb-4">
                    <label className="form-label">E-Mail Adresse</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="E-Mail Adresse eingeben"
                      value={email}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group cb-form-group mb-4">
                    <label className="form-label">Designation</label>
                    <input
                      type="Designation"
                      className="form-control"
                      placeholder="E-Mail Adresse eingeben"
                      value={userDesignation}
                      onChange={(e) => {
                        setUserDesignation(e.target.value);
                      }}
                      disabled={disbaled}
                    />
                  </div>
                </div>
              </div>
              {/* <div className="row align-items-center">
                                <div className="col-5">
                                    <button className="btn btn-gray btn-hover-effect">Cancel</button>
                                </div>
                                <div className="col-7 d-flex justify-content-end">
                                    <button className="btn btn-primary btn-raised btn-hover-effect">Update</button>
                                </div>
                            </div> */}
            </div>
          </div>
          {/* Personal Details End */}

          {/* Company Details Start */}
          <div className="card cb-card mb-3 mb-md-4 single-col-form">
            <div className="card-header card-title-separator card-header-border d-flex justify-content-between align-item-center">
              <div>
                <h2 className="h5">Unternehmensdaten</h2>
                <p className="card-subtitle">
                  Unternehmensdaten unten verwalten
                </p>
              </div>
              {/* <div>
                                <button className="btn btn-flat-link btn-link btn-icon-text btn-link-primary">
                                    <span className="material-icons me-1">edit</span>
                                    <span className="link-text">Edit</span>
                                </button>
                            </div> */}
            </div>

            <div className="px-5">
              <div className="form-group cb-form-group ">
                <label className="form-label">Firmen</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Firmenname eingeben"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    fetchCompanies(e.target.value);
                  }}
                  // disabled
                />
              </div>
              {companyList.length > 0 ? (
                <ListGroup
                  style={{
                    position: "absolute",
                    height: 335,
                    display: "flex",
                    zIndex: 1,
                    maxHeight: 200,
                    width: "87%",
                    overflow: "scroll",
                    background: "#fff",
                  }}
                >
                  {companyList.map((ele, index) => {
                    return (
                      <ListGroup.Item
                        action
                        variant="light"
                        onClick={(e) => {
                          setSearchText("");
                          setCompanyList([]);
                          setSelectedCompany(ele);
                          let data = ele;
                          // console.log(data);
                          setCompany(data.name ? data.name : "");
                          setDesignation(
                            data.Designation ? data.Designation : ""
                          );
                          setCompany_address(
                            data.company_address ? data.company_address : ""
                          );
                          setPostalCode(data.PostalCode ? data.PostalCode : "");
                          setcity(data.City ? data.City : "");
                          setCountry(data.Country ? data.Country : "");
                        }}
                      >
                        {ele.name}
                      </ListGroup.Item>
                    );
                  })}{" "}
                </ListGroup>
              ) : null}
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group cb-form-group mb-4">
                    <label className="form-label">Firmenname</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Firmenname eingeben"
                      value={company}
                      onChange={(e) => {
                        setCompany(e.target.value);
                      }}
                      // disabled
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group cb-form-group mb-4">
                    <label className="form-label">Bezeichnung</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Bezeichnung eingeben"
                      value={designation}
                      onChange={(e) => {
                        setDesignation(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group cb-form-group mb-4">
                    <label className="form-label">Firmenadresse</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Firmenadresse eingeben"
                      value={company_address}
                      onChange={(e) => {
                        setCompany_address(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group cb-form-group mb-4">
                    <label className="form-label">PLZ</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="PLZ eingeben"
                      value={postalCode}
                      onChange={(e) => {
                        setPostalCode(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group cb-form-group mb-4">
                    <label className="form-label">Stadt</label>
                    {/* <select className="form-select" placeholder="select city">
                      <option>City name 1</option>
                      <option>City name 2</option>
                      <option>City name 3</option>
                      <option>City name 4</option>
                    </select> */}
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Stadt eingeben"
                      value={city}
                      onChange={(e) => {
                        setcity(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group cb-form-group mb-4">
                    <label className="form-label">Land</label>
                    {/* <select
                      className="form-select"
                      placeholder="select country"
                    >
                      <option>City name 1</option>
                      <option>City name 2</option>
                      <option>City name 3</option>
                      <option>City name 4</option>
                    </select> */}
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Land eingeben"
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="row align-items-center">
                <div className="col-5">
                  <button className="btn btn-gray btn-hover-effect">
                    Cancel
                  </button>
                </div>
                <div
                  className="col-7 d-flex justify-content-end"
                  onClick={(e) => {
                    e.preventDefault();
                    updateProfile();
                  }}
                >
                  <button className="btn btn-primary btn-raised btn-hover-effect">
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Company Details End */}
        </div>
      </main>
    </div>
  );
}

export default UserDetails;
