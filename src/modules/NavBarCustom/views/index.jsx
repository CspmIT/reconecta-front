import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { ListItemText, ListItemIcon, ListItemButton, ListItem, IconButton, Divider, Typography, List, Toolbar } from "@mui/material";
import DropdownImage from "../../core/components/DropdownImage";
import { Fragment, useEffect, useRef, useState } from "react";
import ButtonModeDark from "../../core/components/ButtonModeDark";
import { Link, useLocation } from "react-router-dom";
import { FaMapMarkedAlt, FaCogs } from "react-icons/fa";
import { RiAlertFill, RiDashboardFill, RiRemoteControl2Fill } from "react-icons/ri";
import AppBarCustom from "../components/AppBarCustom";
import DrawerCustom from "../components/DrawerCustom";
import DrawerHeaderCustom from "../components/DrawerHeaderCustom";
import SubMenuCustom from "../components/SubMenuCustom";
function NavBarCustom() {
  const [open, setOpen] = useState(false);
  const NavBarRef = useRef(null);
  const location = useLocation().pathname.split("/")[1] || "/DashBoard";
  const [buttonActive, setButtonActive] = useState(location);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (NavBarRef.current && !NavBarRef.current.contains(event.target)) {
        handleDrawerClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const menuSideBar = [
    { name: "Dashboard", link: "DashBoard", icon: <RiDashboardFill className="dark:text-white text-3xl" /> },
    { name: "Alertas", link: "Alert", icon: <RiAlertFill className="dark:text-white text-3xl" /> },
    {
      name: "Tablero",
      link: "Board",
      icon: <RiRemoteControl2Fill className="dark:text-white text-3xl" />,
      submenus: [
        {
          name: "Perfil2",
          link: "config/profile",
          icon: <RiRemoteControl2Fill className="dark:text-white text-3xl" />,
        },
        {
          name: "Cuenta2",
          link: "config/account",
          icon: <RiRemoteControl2Fill className="dark:text-white text-3xl" />,
        },
      ],
    },
    {
      name: "Mapa",
      link: "map",
      icon: <FaMapMarkedAlt className="dark:text-white text-3xl" />,
    },
    {
      name: "Configuración",
      link: "config",
      icon: <FaCogs className="dark:text-white text-3xl" />,
      submenus: [
        {
          name: "Perfil",
          link: "config/profile2",
          icon: <RiRemoteControl2Fill className="dark:text-white text-3xl" />,
        },
        {
          name: "Cuenta",
          link: "config/account2",
          icon: <RiRemoteControl2Fill className="dark:text-white text-3xl" />,
        },
      ],
    },
    // {
    //     name: 'Paginas',
    //     link: 'tabs',
    //     icon: (
    //         <Badge badgeContent={tabActive} color='primary'>
    //             <PiTabsFill className='dark:text-white text-3xl' />
    //         </Badge>
    //     )
    // }
  ];
  const activeButton = (id) => {
    setButtonActive(id);
  };
  return (
    <>
      <AppBarCustom position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              boxShadow: "none",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Reconecta
          </Typography>
          <div className="absolute right-5 flex flex-row items-center gap-2">
            <ButtonModeDark />
            <DropdownImage />
          </div>
        </Toolbar>
      </AppBarCustom>
      <DrawerCustom variant="permanent" open={open} ref={NavBarRef}>
        <div className="bg-white dark:bg-gray-800 h-full">
          <DrawerHeaderCustom>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon className="dark:text-white" />
            </IconButton>
          </DrawerHeaderCustom>
          <Divider />
          <List>
            {menuSideBar.map((item, index) => {
              return (
                <Fragment key={index}>
                  <ListItem className={`dark:text-white`} disablePadding sx={{ display: "block" }} onSelect={() => console.log("hola")}>
                    {item.submenus ? (
                      <SubMenuCustom item={item} openSideBar={open} buttonActive={buttonActive} activeButton={activeButton} />
                    ) : (
                      <Link to={item.link} className={`text-black dark:text-white`}>
                        <ListItemButton
                          sx={{
                            minHeight: 48,
                            justifyContent: open ? "initial" : "center",
                            px: 2.5,
                            py: 1.8,
                          }}
                          onClick={() => activeButton(item.link)}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 3 : "auto",
                              justifyContent: "center",
                              color: buttonActive == item.link ? "blue" : "",
                            }}
                            className="dark:text-white"
                          >
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            className="dark:text-white"
                            primary={item.name}
                            sx={{
                              opacity: open ? 1 : 0,
                              color: buttonActive == item.link ? "blue" : "",
                            }}
                          />
                        </ListItemButton>
                      </Link>
                    )}
                  </ListItem>
                </Fragment>
              );
            })}
          </List>
        </div>
      </DrawerCustom>
    </>
  );
}

export default NavBarCustom;
