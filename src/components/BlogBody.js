import React from "react"
import { Link as GLink } from "gatsby"
import useStyles from "../styles/style"
import ArticleTags from "./ArticleTags"
import Markdown from '../utils/Markdown';
import PropTypes from 'prop-types';



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
