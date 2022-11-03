import { useContext } from "react";
import { SideBarDrawerContext } from "../contexts/SideBarDrawerContext";

export const useSideBarDrawer = () => useContext(SideBarDrawerContext);
