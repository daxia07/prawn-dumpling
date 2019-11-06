import React from "react"
import { Toolbar, useTheme } from "@material-ui/core"
import useStyles from "../styles/style"
import useWindowDimensions from "../utils/windowDimensions"
import Header from "./Header"
import AppTopBar from "./AppTopBar"
import { ListRenderer, defaultNavItems } from "../assets/constants"


const NavBar = ({ siteTitle, items, drawerHandler, drawerOpen }) => {
  const navItems = items ? items : defaultNavItems
  const classes = useStyles()
  const { width } = useWindowDimensions()
  const theme = useTheme()
  const renderHelper = (windowWidth) => {
    if (windowWidth > theme.breakpoints.values["md"]) {
      return (
        <React.Fragment>
          <Header siteTitle={siteTitle} />
          <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
            {ListRenderer(navItems, true)}
          </Toolbar>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <AppTopBar siteTitle={siteTitle} items={items} drawerHandler={drawerHandler} drawerOpen={drawerOpen}/>
        </React.Fragment>
      )
    }
  }

  return (
    <React.Fragment>
      {renderHelper(width)}
    </React.Fragment>
  )
}

export default NavBar