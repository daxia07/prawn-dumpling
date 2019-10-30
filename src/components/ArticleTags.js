import React from "react"
import { Link } from "gatsby"
import useStyles from "../styles/style"
import PropTypes from 'prop-types'

const ArticleTags = ({ tags }) => {
  const classes = useStyles()
  return (
    <div>
      <div className={classes.blogTags}>
        <ul>
          {tags.map(ele => (
            <li key={ele}><Link to={`/tags/${ele}/`}>{ele}</Link></li>
          ))}
        </ul>
      </div>
    </div>
  )
}

ArticleTags.PropTypes = {
  tags: PropTypes.array
}

export default ArticleTags
