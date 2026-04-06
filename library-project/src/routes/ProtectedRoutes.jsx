import React from 'react'

import { Outlet,Navigate } from 'react-router-dom'
const ProtectedRoutes=()=>{

const token=localStorage.getItem("token")
const role=localStorage.getItem("role")
if(!token){
   return <Navigate to='/login' replace />
}

if(role&&role!==role){
  return <Navigate to ='/login'replace/>
}
return <Outlet/>;
}
export default ProtectedRoutes