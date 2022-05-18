import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/admin">
          <Route exact path="/admin" />
          <Route exact path="users" element={<Users />} />
          <Route exact path="users-details/:id" element={<UserDetails />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
