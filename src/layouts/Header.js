import PropTypes from "prop-types"
import React from "react"
import Toolbar from "@material-ui/core/Toolbar"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core"
import Link from "../components/Link"
import { capitalize } from "../utils/stringUtils"
import navigate from "../utils/navigate"
import SearchBar from '../components/SearchBar'
import IconButton from "@material-ui/core/IconButton"


const useStyles = makeStyles(theme => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingLeft: `24px`,
    paddingRight: `24px`,
    display: `flex`,
    position: `relative`,
    alignItems: `center`,
    minHeight: `64px`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: "space-between",
    overflowX: "auto",
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
}))


const Header = ({ siteTitle }) => {
  const classes = useStyles()
  const title = siteTitle.replace("-", " ")
  const navToAccount = evt => {
    evt.preventDefault()
    navigate("/account/", {
      state: { from: "/" },
    })
  }
  return (
    <Toolbar className={classes.toolbar}>
      <Button size="small">Subscribe</Button>
      <Typography
        component="h2"
        variant="h5"
        color="inherit"
        align="center"
        noWrap
        className={classes.toolbarTitle}
      >
        <Link to={"/"} style={{ color: "black" }}>
          {capitalize(title)}</Link>
      </Typography>
      <IconButton>
        <SearchBar/>
      </IconButton>
    </Toolbar>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
