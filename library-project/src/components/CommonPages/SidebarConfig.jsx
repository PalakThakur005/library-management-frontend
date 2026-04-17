import {
  FaThLarge,
  FaUsers,
  FaBookOpen,
  FaCog,
  FaUserGraduate,
  FaUser,
  FaBook,
  FaIdBadge,
  FaBuilding,
  FaIdCard,
} from "react-icons/fa";

export const sidebarConfig = {
  admin: [
    { label: "Dashboard", icon: FaThLarge, path: "/admin/dashboard" },
    { label: "Department", icon: FaBuilding, path: "/admin/department" },
    { label: "User Management", icon: FaUsers, path: "/admin/ManageRoles" },
    { label: "Books", icon: FaBookOpen, path: "/admin/Books" },
    {label : "Card Issue", icon :FaIdBadge , path : "/admin/cardIssue"},
     {label : " Issue Book", icon :FaBook , path : "/admin/issuebook"},

  ],

  teacher: [
    { label: "Dashboard", icon: FaThLarge, path: "/teacher/dashboard" },
     { label: "Library Card", icon: FaIdCard, path: "/teacher/card" },
    { label: "Issued Book", icon: FaBookOpen, path: "/teacher/books" },
    { label: "Teacher Profile", icon: FaUser, path: "/teacher/profile" },
  ],

  student: [
    { label: "Dashboard", icon: FaThLarge, path: "/student/dashboard" },
    { label: "Library Card", icon: FaIdCard, path: "/student/card" },
    { label: "Issued Books", icon: FaBookOpen, path: "/student/issued" },
    { label: "Student Profile", icon: FaUser, path: "/student/profile" },
    
  ],
};