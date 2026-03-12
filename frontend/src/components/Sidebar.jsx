// import { Box, Typography, Button } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";
// import logo from "../assets/chef.png"
// export default function Sidebar({ user }) {
//   const navigate = useNavigate();
//   // const { logout } = useAuth();

//   const isAdmin = user?.role === "admin";

//   // const handleLogout = () => {
//   //   logout();
//   //   navigate("/auth/login");
//   // };

//   const handleNavigation = (path) => {
//     navigate(path);
//   };

//   return (
//     <Box
//       sx={{
//         width: 250,
//         height: "100vh",
//         background: "linear-gradient(180deg,#1e3b2f,#244a3a)",
//         color: "#fff",
//         p: 3,
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <Box 
//         sx={{ 
//           display: "flex", 
//           alignItems: "center", 
//           gap: 1,
//           cursor: "pointer",
//           transition: "opacity 0.3s",
//           "&:hover": {
//             opacity: 0.8
//           }
//         }}
//         onClick={() => handleNavigation("/")}
//       >
//         <Box
//           component="img"
//           src={logo}
//           alt="Virtual Chef Logo"
//           sx={{
//             height: 32,
//             width: 32,
//             objectFit: "contain",
//             paddingBottom: 2
//           }}
//         />
//         <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: 18, paddingBottom: 2 }}>
//           Virtual Chef
//         </Typography>
//       </Box>

//       <Box sx={{ flex: 1 }}>
//         {/* ADMIN PANEL */}
//         {isAdmin && (
//           <>
//             <Typography sx={{ opacity: 0.6, mb: 1, fontSize: 12 }}>
//               OVERVIEW
//             </Typography>

//             <Button
//               fullWidth
//               sx={{ color: "#fff", justifyContent: "flex-start", mb: 2, textTransform: "none" }}
//               onClick={() => handleNavigation("/admin/dashboard")}
//             >
//               📊 Dashboard
//             </Button>

//             <Typography sx={{ opacity: 0.6, mt: 3, mb: 1, fontSize: 12 }}>
//               MANAGE
//             </Typography>

//             <Button
//               fullWidth
//               sx={{ color: "#fff", justifyContent: "flex-start", mb: 2, textTransform: "none" }}
//               onClick={() => handleNavigation("/admin/recipes")}
//             >
//               📖 All Recipes
//             </Button>

//             <Button
//               fullWidth
//               sx={{ color: "#fff", justifyContent: "flex-start", textTransform: "none" }}
//               onClick={() => handleNavigation("/admin/chefs")}
//             >
//               👨‍🍳 Chefs
//             </Button>

//             <Typography sx={{ opacity: 0.6, mt: 3, mb: 1, fontSize: 12 }}>
//               SETTINGS
//             </Typography>

//             <Button
//               fullWidth
//               sx={{ color: "#fff", justifyContent: "flex-start", textTransform: "none" }}
//               onClick={() => handleNavigation("/admin/profile")}
//             >
//               👤 My Profile
//             </Button>
//           </>
//         )}

//         {/* CHEF PANEL */}
//         {!isAdmin && (
//           <>
//             <Typography sx={{ opacity: 0.6, mb: 1, fontSize: 12 }}>
//               RECIPES
//             </Typography>

//             <Button
//               fullWidth
//               sx={{ color: "#fff", justifyContent: "flex-start", mb: 2, textTransform: "none" }}
//               onClick={() => handleNavigation("/chef/dashboard")}
//             >
//               📚 My Recipes
//             </Button>

//             <Button
//               fullWidth
//               sx={{ color: "#fff", justifyContent: "flex-start", mb: 3, textTransform: "none" }}
//               onClick={() => handleNavigation("/chef/recipes/new")}
//             >
//               ➕ Add Recipe
//             </Button>

//             <Typography sx={{ opacity: 0.6, mb: 1, fontSize: 12 }}>
//               SETTINGS
//             </Typography>

//             <Button
//               fullWidth
//               sx={{ color: "#fff", justifyContent: "flex-start", textTransform: "none" }}
//               onClick={() => handleNavigation("/profile")}
//             >
//               👤 My Profile
//             </Button>
//           </>
//         )}
//       </Box>

//       {/* <Button
//         fullWidth
//         sx={{
//           color: "#fff",
//           justifyContent: "flex-start",
//           textTransform: "none",
          
//           backgroundColor: "rgba(255,255,255,0.1)",
//             "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },    

//         }}
//         onClick={handleLogout}
//       >
//         🚪 Logout
//       </Button> */}
//     </Box>
//   );
// }

import { Layout, BarChart, Layers, Settings, User, BookOpen, Plus } from "lucide-react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/chef.png";

export default function Sidebar({ user }) {

  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isAdmin = user?.role === "admin";

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        width: isCollapsed ? 50 : 250,
        height: "100vh",
        background: "linear-gradient(180deg,#1e3b2f,#244a3a)",
        color: "#fff",
        p: isCollapsed ? 0.5 : 2,
        transition: "width 0.3s",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        alignItems: isCollapsed ? "center" : "stretch"
      }}
    >

      {/* Collapse Button */}
      <IconButton
        onClick={() => setIsCollapsed(!isCollapsed)}
        sx={{
          position: "absolute",
          right: -12,
          top: 40,
          background: "#fff",
          width: 20,
          height: 20,
          padding: 0,
          "&:hover": { background: "#eee" }
        }}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </IconButton>

      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "flex-start",
          gap: 1,
          mb: 4,
          cursor: "pointer"
        }}
        onClick={() => handleNavigation("/")}
      >
        <Box
          component="img"
          src={logo}
          alt="Virtual Chef Logo"
          sx={{ width: 32, height: 32 }}
        />

        {!isCollapsed && (
          <Typography sx={{ fontWeight: 600, fontSize: 18 }}>
            Virtual Chef
          </Typography>
        )}
      </Box>

      <Box sx={{ flex: 1 }}>

        {/* ADMIN PANEL */}
        {isAdmin && (
          <>
            {!isCollapsed && (
              <Typography sx={{ opacity: 0.6, mb: 1, fontSize: 12 }}>
                OVERVIEW
              </Typography>
            )}

            <Button
              fullWidth
              sx={{ color: "#fff", justifyContent: isCollapsed ? "center" : "flex-start", mb: 2, textTransform: "none", gap: 1, minWidth: 0, p: isCollapsed ? 1 : 2 }}
              onClick={() => handleNavigation("/admin/dashboard")}
            >
              <BarChart size={18} />
              {!isCollapsed && "Dashboard"}
            </Button>

            {!isCollapsed && (
              <Typography sx={{ opacity: 0.6, mt: 3, mb: 1, fontSize: 12 }}>
                MANAGE
              </Typography>
            )}

            <Button
              fullWidth
              sx={{ color: "#fff", justifyContent: isCollapsed ? "center" : "flex-start", mb: 2, textTransform: "none", gap: 1, minWidth: 0, p: isCollapsed ? 1 : 2 }}
              onClick={() => handleNavigation("/admin/recipes")}
            >
              <Layers size={18} />
              {!isCollapsed && "All Recipes"}
            </Button>

            <Button
              fullWidth
              sx={{ color: "#fff", justifyContent: isCollapsed ? "center" : "flex-start", textTransform: "none", gap: 1, minWidth: 0, p: isCollapsed ? 1 : 2 }}
              onClick={() => handleNavigation("/admin/chefs")}
            >
              <Layout size={18} />
              {!isCollapsed && "Chefs"}
            </Button>
            
          </>
        )}

        {/* CHEF PANEL */}
        {!isAdmin && (
          <>
            {!isCollapsed && (
              <Typography sx={{ opacity: 0.6, mb: 1, fontSize: 12 }}>
                RECIPES
              </Typography>
            )}

            <Button
              fullWidth
              sx={{ color: "#fff", justifyContent: isCollapsed ? "center" : "flex-start", mb: 2, textTransform: "none", gap: 1, minWidth: 0, p: isCollapsed ? 1 : 2 }}
              onClick={() => handleNavigation("/chef/dashboard")}
            >
              <BookOpen size={18} />
              {!isCollapsed && "My Recipes"}
            </Button>

            <Button
              fullWidth
              sx={{ color: "#fff", justifyContent: isCollapsed ? "center" : "flex-start", mb: 3, textTransform: "none", gap: 1, minWidth: 0, p: isCollapsed ? 1 : 2 }}
              onClick={() => handleNavigation("/chef/recipes/new")}
            >
              <Plus size={18} />
              {!isCollapsed && "Add Recipe"}
            </Button>

            {!isCollapsed && (
              <Typography sx={{ opacity: 0.6, mb: 1, fontSize: 12 }}>
                SETTINGS
              </Typography>
            )}

            <Button
              fullWidth
              sx={{ color: "#fff", justifyContent: isCollapsed ? "center" : "flex-start", textTransform: "none", gap: 1, minWidth: 0, p: isCollapsed ? 1 : 2 }}
              onClick={() => handleNavigation("/profile")}
            >
              <User size={18} />
              {!isCollapsed && "My Profile"}
            </Button>
          </>
        )}
      </Box>

    </Box>
  );
}