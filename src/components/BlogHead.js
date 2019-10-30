import React from "react"
import PropTypes from 'prop-types'
import { Typography } from "@material-ui/core"
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  mainHeading: {
    padding: `1rem 0`,
  },
  postTitle: {
    fontWeight: 700,
    marginBottom: `1rem`,
    color: `#111111`,
    fontSize: `2.5rem`,
    lineHeight: 1.1,
  },
  postDate: {
    color: `rgba(0, 0, 0, .54)`,
    display: `inline-block`,
    fontFamily: `PT Sans`,
    fontSize: 15,
    fontWeight: 400,
    lineHeight: 1.5,
  },
  dot: {
    marginLeft: 3,
    marginRight: 3,
  },

}))


const BlogHead = ({ post }) => {
  const {title, createdAt, timeToRead, words} = post;
  const classes = useStyles();

  return (
    <div className={`${classes.mainHeading}`}>
      <Typography variant={"h3"} className={classes.postTitle}>
        {title}
      </Typography>
      <p><span className={classes.postDate}><time className={classes.postDate}>{createdAt}</time></span>
        <span className={classes.dot}>&middot;</span>
        <span className={classes.postDate}>{timeToRead} min read</span>
        <span className={classes.dot}>&middot;</span>
        <span className={classes.postDate}>{` ${words} words`}</span>
      </p>
    </div>
  )
}

BlogHead.PropTypes = {
  post: PropTypes.object.isRequired
}

export default BlogHead