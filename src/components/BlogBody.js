import React from "react"
import { Link as GLink } from "gatsby"
import ArticleTags from "./ArticleTags"
import Markdown from '../utils/Markdown';
import PropTypes from 'prop-types';
import makeStyles from "@material-ui/core/styles/makeStyles"


const useStyles = makeStyles(theme => ({
  featuredImage: {
    position: `relative`,
    display: `block`,
    margin: `0 auto`,
    marginBottom: `1.5rem`,
    width: `100%`,
    height: `auto`,
    // objectFit: `contain`,
    maxHeight: `350px`,
  },
  articlePost: {
    fontFamily: `Merriweather`,
    fontSize: `1.125rem`,
    fontHeight: 1.8,
    color: `#222222`,
    "& img": {
      display: `block`,
      margin: `0 auto`,
      marginBottom: `1.5rem`,
      width: `100%`,
      height: `auto`,
      // objectFit: `contain`,
      maxHeight: `350px`,
    },
  },
  postCategory: {
    position: `absolute`,
    top: -75,
    left: -10,
    background: `#e74c3c`,
    padding: `10px 15px`,
    fontSize: 14,
    fontWeight: 600,
    textTransform: `uppercase`,
  }
}))



const BlogBody = ({ post }) => {
  const { body, imgUrl, tags, category } = post

  const classes = useStyles()

  return (
    <React.Fragment>
      <img src={imgUrl} className={classes.featuredImage} alt={"feature"}/>
      <div style={{ position: `relative` }}>
        <div className={classes.postCategory}>
          <GLink to={`/${category}/`} style={{ textDecoration: `none`, color: `#FFF` }}>{category}</GLink>
        </div>
        <article className={classes.articlePost}>
          <Markdown>
            {body}
          </Markdown>
        </article>
        <ArticleTags tags={tags}/>
      </div>
    </React.Fragment>
  )
}

BlogBody.propTypes = {
  post: PropTypes.object.isRequired
}

export default BlogBody
