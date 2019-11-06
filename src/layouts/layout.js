import React, { useState } from "react"
import PropTypes from "prop-types"
import Footer from "./Footer"
import { createGenerateClassName, CssBaseline } from "@material-ui/core"
import Container from "@material-ui/core/Container"
import NavBar from "./NavBar"
import { JssProvider } from "react-jss"
import { makeStyles } from "@material-ui/core"
import SEO from '../components/seo'
import { useStaticQuery } from 'gatsby'
import { graphql } from 'gatsby'
import clsx from 'clsx'


const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  container: {
    width: `85%`,
    maxWidth: `100%`,
    position: `relative`,
    marginLeft: `auto`,
    marginRight: `auto`,
    paddingRight: 15,
    paddingLeft: 15,
    marginTop: 5,
    minHeight: `85vh`,
    [theme.breakpoints.down("sm")]: {
      width: `70%`,
      paddingLeft: 0,
      paddingRight: 0,
      marginTop: 0,
    },
    [theme.breakpoints.down("xs")]: {
      width: `95%`,
      paddingLeft: 0,
      paddingRight: 0,
      marginTop: 0,
    },
  },
  drawerHeader: {
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    },
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      justifyContent: "flex-end",
    }
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    width: `100%`,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: -drawerWidth,
  },
}))


const Layout = ({ children, classPrefix, title }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
        site {
            siteMetadata {
                title
            }
        }
    }
  `)

  const [drawerOpen, setDrawerOpen] = useState(false)

  const generateClassName = createGenerateClassName({
    productionPrefix: classPrefix,
  })

  const { site: { siteMetadata: { title: siteTitle } } } = data

  const classes = useStyles()
  return (
    <JssProvider generateClassName={generateClassName}>
      <React.Fragment>
        <SEO title={`${title}`}/>
        <CssBaseline/>
        <Container className={classes.container}>
          <NavBar siteTitle={siteTitle} drawerHandler={setDrawerOpen} drawerOpen={drawerOpen} />
          <main className={clsx(classes.content, { [classes.contentShift]: drawerOpen,})}>
            <div className={classes.drawerHeader}/>
            {children}
          </main>
        </Container>
        <Footer/>
      </React.Fragment>
    </JssProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
