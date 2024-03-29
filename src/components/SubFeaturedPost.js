import React from "react"
import { makeStyles } from "@material-ui/core"
import PropTypes from "prop-types"
import { Typography, Card, CardActionArea, CardContent, Grid, Hidden, CardMedia } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  mainGrid: {
    marginTop: theme.spacing(2),
  },
  card: {
    display: "flex",
    height: `100%`
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
  readMore: {
    position: 'absolute',
    bottom: `20px`
  },
  pad: {
    padding: 10
  }
}))

const SubFeaturedPost = ({ posts }) => {
  const classes = useStyles()
  return (
    <Grid container spacing={4} className={classes.mainGrid}>
      {posts.map(post => (
        <Grid item key={post.slug} xs={12} md={6}>
          <CardActionArea component="a" href={`/blog/${post.slug}/`} style={{height: `100%`}}>
            <Card className={classes.card}>
              <div className={classes.cardDetails}>
                <CardContent>
                  <Typography component="h2" variant="h5">
                    {post.title}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {post.date}
                  </Typography>
                  <Typography variant="subtitle1" paragraph>
                    {post.description}
                  </Typography>
                  <Typography className={classes.pad} component="p"/>
                  <Typography variant="subtitle1" color="primary" className={classes.readMore} >
                    continue reading...
                  </Typography>
                </CardContent>
              </div>
              <Hidden xsDown>
                <CardMedia
                  className={classes.cardMedia}
                  image={post.imgUrl}
                  title={post.imgTitle}/>
              </Hidden>
            </Card>
          </CardActionArea>
        </Grid>
      ))}
    </Grid>
  )
}

SubFeaturedPost.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default SubFeaturedPost