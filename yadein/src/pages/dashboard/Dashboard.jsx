import React from 'react'
// import Header from '../../components/Header'
import SuperAdminDash from './SuperAdminDash';
import BatchAdminDash from './BatchAdminDash';
import ClassAdminDash from './ClassAdminDash';

function Dashboard() {
  const adminType = sessionStorage.getItem("adminType");

  return (
    <>
      {/* <Header/> */}
      {adminType === "superadmin" && <SuperAdminDash />}
      {adminType === "batchadmin" && <BatchAdminDash />}
      {adminType === "classadmin" && <ClassAdminDash />}
    </>
  )
}

export default Dashboard;
