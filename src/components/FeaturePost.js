import React from "react";
import PropTypes from "prop-types";
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Card from "@material-ui/core/Card";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import navigate from "../utils/navigate"

const useStyles = makeStyles(theme => ({
  card: {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: 0,
    margin: `auto`,
    borderRadius: `5px!important`
  },
  cardButton: {
    display: "block",
    textAlign: "initial",
    width: `100%`
  },
  media: {
    minHeight: 200,
    width: `100%`,
    backgroundSize: `cover!important`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center"
  },
  pos: {
    paddingTop: 30,
  },
  content: {
    paddingLeft: theme.spacing(4),
    [theme.breakpoints.down("xs")]: {
      paddingLeft: theme.spacing(1)
    }
  },
  btn: {
    paddingLeft: 0,
    paddingTop: 20
  }
}));

const handleClick = (url) => {
  navigate(to=url)
}

const FeaturedPost = ({ post }) =>  {
  const classes = useStyles();
  console.log(post)
  return (
    <div>
      <Card className={classes.card}>
        <ButtonBase
          className={classes.cardButton}
          onClick={() => handleClick(post.url)}>
          <CardMedia
            className={classes.media}
            image={post.imgUrl}
            title="Contemplative Reptile"
          >
            <Grid container style={{ height: `100%` }}>
              <Grid item md={6}>
                <CardContent className={classes.content}>
                <Typography className={classes.pos} gutterBottom>
                </Typography>
                  <Typography variant="h5" component="h2">
                    {post.title}
                  </Typography>
                  <Typography className={classes.pos}>

                  </Typography>
                  <Typography variant="body2" component="p">
                    {post.description}
                    <br />
                  </Typography>
                  <CardActions className={classes.btn}>
                    <Typography variant='button' size="small" color="primary" gutterBottom>
                      Learn More
                    </Typography>
                  </CardActions>
                </CardContent>
              </Grid>
            </Grid>

          </CardMedia>
        </ButtonBase>
      </Card>
    </div>
  );
}

FeaturedPost.propTypes = {
  post: PropTypes.object.isRequired
};

export default FeaturedPost;
