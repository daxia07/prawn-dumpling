import React from "react"
import PropTypes from "prop-types"
import { graphql, useStaticQuery } from "gatsby"
import Footer from "./Footer"
import { createGenerateClassName, CssBaseline } from "@material-ui/core"
import Container from "@material-ui/core/Container"
import NavBar from "./NavBar"
import { JssProvider } from "react-jss"
import makeStyles from '@material-ui/core/makeStyles'

const useStyles = makeStyles(theme => ({
  container: {
    width: `70%`,
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
}))


const Layout = ({ children, classPrefix, items }) => {
  const generateClassName = createGenerateClassName({
    productionPrefix: classPrefix,
  })
  const data = useStaticQuery(graphql`
      query SiteTitleQuery {
          site {
              siteMetadata {
                  title
              }
          }
      }
  `)

  const classes = useStyles()
  return (
    <JssProvider generateClassName={generateClassName}>
      <React.Fragment>
        <CssBaseline/>
        <Container className={classes.container}>
          <NavBar siteTitle={data.site.siteMetadata.title} main={children} items={items}/>
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
