# prawn-dumpling
personal website 

## Tutorial
## Intro
In this `tutorial` we are going to build a personal blog website. I have tried several approaches, including `Django with django packages`, `Django with react as an App`, `Nodejs`. Feel free to check my [repos](https://github.com/daxia07 "repos") for the source code. At last, I decide to try it with Gatsby, the **static site generator**, Contentful, the headless **CMS**, and Netlify, the **easy to deploy platform**. Before you start, I assume you have a basic knowledge of 

* React 
* Gatsby
* Graphql
* Git
* JSS
* Markdown 


If you don't, you can always refer to youtube, and search for `{keyword} + crash course` to start up.  

Besides, there are plenty of open source blog website on Github, including Dan Abramov's [overreacted.io](https://github.com/gaearon/overreacted.io "dan's blog"). I learn a lot from his articles, and hope you will enjoy them as well.
So, let's start!


## Roadmap

In this part, we are going to write our own material ui themed components, compose webpages, build content models, use plugin to query markdown entries when delpoying on netlify. 
![Roadmap of this tutorial](https://images.ctfassets.net/f53ma7mq4czu/4cjNnhup0XkA1JJRXc4dnn/3c7fa88dda88e70207c50d255a26c4b7/blog-part-one.png)


## Init
1. Create a new repo with Node type .gitignore, a MIT LICENSE and brief README.md on Github, and clone it to your disk. 
2. cd into root, and run 
```
npm init -y
```
4. install gatsby command line globally with
```
npm i -g gatsby-cli
```
install packages: *gatsby, gatsby-plugin-react-helmet, gatsby-plugin-sharp, react-dom react-helmet* with command
```
yarn add gatsby gatsby-plugin-react-helmet gatsby-plugin-sharp react-dom
```
A brief intro, react-helmet plugin generates html head where meta data and stylesheets resides, sharp plugin helps improve image performance.

5. mkdir under root folder src/pages, add a file named index.js with code
```jsx
import React from 'react'

const index = () => {
  return (
    <div>
      hello 
    </div>
  )
}

export default index
```
run command 
```
gatsby develop
```
Then visit url `localhost:8000`, you should be able to see your greetings you just wrote, then we are ready to go

6. Install VSCode if it was not already in your computer, and configure your launch.json as instructed in official [webpage](https://www.gatsbyjs.org/docs/debugging-the-build-process/ "webpage"). 

7. Install devDeps eslint, eslint-plugin-react and prettier
```
yarn add --dev prettier eslint eslint-plugin-react
```
add command scripts to package.json
```json
  "scripts": {
    "start": "npm run develop",
    "format": "prettier --write '{gatsby-*.js,src/**/*.{js,jsx,json,css}}'",
    "lint": "./node_modules/.bin/eslint --ext .js,.jsx --ignore-pattern public .",
    "bns": "rm -rf public && rm -rf .cache && gatsby build && gatsby serve"
  },
```
add .eslintrc.js, .prettierrc and .prettierignore files to root folder
```jsx
module.exports = {
  "env": {
    "browser": true,
    "es6": true,
  },
  "plugins": [
    "react",
  ],
  "globals": {
    "graphql": false,
  },
  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true,
      "modules": true,
    },
  }
}
```

**Now that the development environments are all set up, let's head for the next chapter**

## Configure head
Create file gatsby-config.js under root folder, and add siteMetaData and gatsby plugins
```jsx
module.exports = {
  siteMetadata: {
    title: 'prawn-dumpling',
    author: 'Mingxia Li',
    description: 'Personal blog by Mingxia Li. A place to share tutorials, recipes and thinking minds.',
    siteUrl: 'https://prawn-dumpling.com',
  },
  pathPrefix: '/',
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sharp`,
  ]
}
```



## UI Components
We are going to use [material ui](https://material-ui.com/ "material ui"), as it saves a lot of efforts with handy components already designed and adjusted for production. 
1. install material ui and related packages with command
```
yarn add @material-ui/core @material-ui/icons @material-ui/styles clsx jss react-jss
```
2. Create a folder under src named `components`, and create a seo.js file to add metadata and stylesheets for googlefonts and icons
```jsx
import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

function SEO({ description, lang, meta, title }) {
  const { site } = useStaticQuery(
    graphql`
        query {
            site {
                siteMetadata {
                    title
                    description
                    author
                }
            }
        }
    `,
  )

  const metaDescription = description || site.siteMetadata.description

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          name: `viewport`,
          content: `minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no`,
        },
        {
          name: "theme-color",
          content: "#3f51b5",
        },

      ].concat(meta)}
    >
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>

    </Helmet>
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}

export default SEO
```
we used staticQuery from gatsby to fetch metadata we just defined in gatsby-config

3. Create a theme file under src/assets/siteTheme.js
```jsx
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core"

let siteTheme = createMuiTheme({
  palette: {
    secondary: {
      main: "#009688",
    },
    text: {
      primary: "#000",
    },
  },
})

siteTheme = responsiveFontSizes(siteTheme)

export default siteTheme
```
Mostly, we put our custom colors in this siteTheme, and we allow material ui to adjust font size automatically for us.


4. Wrap root components with StyleProvider and ThemeProvider. This part is a little tricky for gatsby, unlike CRA, there isn't a root component to wrap up with. Official work around is to use wrapRootElement available in gatsby-browser.js, so create this file and add code below
```jsx
import React from "react"
import { StylesProvider } from "@material-ui/styles"
import { jssPreset } from "@material-ui/styles"
import { create } from "jss"
import { ThemeProvider } from "@material-ui/styles"
import siteTheme from "./src/assets/siteTheme"


export const wrapRootElement = ({ element }) => {
  return (
    <StylesProvider jss={create({
      ...jssPreset(),
    })}>
      <ThemeProvider theme={siteTheme}>
        {element}
      </ThemeProvider>
    </StylesProvider>
  )
}
```
5. Create folder src/styles and create style.js for our global style
```jsx
import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  
}))

export default useStyles
```

6. Create a mui styled Link component with React.forwardRef.
```jsx
import React from "react"
import MuiLink from "@material-ui/core/Link"
import { Link as GatsbyLink } from "gatsby"

const Link = React.forwardRef(function Link(props, ref) {
  return <MuiLink component={GatsbyLink} style={{ textDecoration: "none" }} ref={ref} {...props} />
})

export default Link

```
Then let's create a navigate component under src/utils with window type check to ignore gatsby build error 

```jsx
import { navigate as gNav } from "gatsby"

const navigate = typeof window !== "undefined" ? gNav : () => {
}

export default navigate
```

6. We will adjust ui components first, and then create layouts for faster loading speed. It is recommended to test components on [codesandbox.io](codesandbox.io). First create a mock data file under src/assets/mockPost.js
```jsx
export const post = {
  imgUrl: `https://images.ctfassets.net/f53ma7mq4czu/6rBV0A1p0o9jBXhx65aPQk/2742ceb…/photo-1451187580459-43490279c0fa`,
  title: `My Fresh New Website`,
  description: `Welcome to prawn-dumpling website! I hope you will find something interesting here!`,
  slug: `/`
}
```
  Let's create our UI components!

## Components
1. Feature Post
  for feature post, we are going to use a Card component from @material/core, and write title, description and read more instruction on CardContent. Grid is used to divide the canvas into half to prevent the line to get too long. Two empty paragraphs to hold the space. We can adjust them for better responsive performance with theme.breakpoints
  ```jsx
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
      marginBottom: theme.spacing(4),
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
```
let's include this component in src/pages/index.js, and pass post prop with mockData

2. After we finish the feature post, let's work on the sub feature post component. Create a new component name SubFeaturedPost.js under src/components/

```jsx
import React from "react"
import { makeStyles } from "@material-ui/core"
import { Typography, Card, CardActionArea, CardContent, Grid, Hidden, CardMedia } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  mainGrid: {
    marginTop: theme.spacing(2),
  },
  card: {
    display: "flex",
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
}))

const SubFeaturedPost = ({ posts }) => {
  const classes = useStyles()
  return (
    <Grid container spacing={4} className={classes.mainGrid}>
      {posts.map(post => (
        <Grid item key={post.slug} xs={12} md={6}>
          <CardActionArea component="a" href={`/blog/${post.slug}/`}>
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
                  <Typography variant="subtitle1" color="primary">
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
```

3. Create a blog brief card component under src/components, add more values to mockPost
```javascript
{
  avatar: `https://images.ctfassets.net/f53ma7mq4czu/5lD0VUJDjZ698De4AGJaDf/6b150f94c8343560eea9c9e107e1b00c/Screen_Shot_2019-08-25_at_21.22.19.png?h=250`,
  name: `alienz`,
  firstName: `Mingxia`,
  lastName: `Li`,
  excerpt: `Great place to learn new things`,
  tags: ['dev', 'life'],
  createdAt: new Date()
}
```
Add code
```jsx
import React from "react"
import clsx from "clsx"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardMedia from "@material-ui/core/CardMedia"
import CardContent from "@material-ui/core/CardContent"
import CardActions from "@material-ui/core/CardActions"
import Collapse from "@material-ui/core/Collapse"
import Avatar from "@material-ui/core/Avatar"
import IconButton from "@material-ui/core/IconButton"
import Typography from "@material-ui/core/Typography"
import FavoriteIcon from "@material-ui/icons/Favorite"
import ShareIcon from "@material-ui/icons/Share"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder"
import Link from "./Link"
import ArticleTags from "./ArticleTags"
import ChatBubbleOutlineRoundedIcon from "@material-ui/icons/ChatBubbleOutlineRounded"
import StarBorderRoundedIcon from "@material-ui/icons/StarBorderRounded"
import makeStyles from "@material-ui/core/styles/makeStyles"

const useStyles = makeStyles(theme => ({
  card: {
    // maxWidth: 550,
    width: `100%`,
    boxShadow: `none`,
    borderRadius: `5px 5px 0 0`,
    marginTop: 15,
  },
  bbMedia: {
    height: 0,
    paddingTop: "56.25%", // 16:9
    // margin: "-70px auto 0",
    [theme.breakpoints.down("md")]: {
      paddingTop: "40%",
    },
    [theme.breakpoints.down("sm")]: {
      paddingTop: "30%",
    },
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    marginLeft: 20,
    width: 72,
    height: 72,
    [theme.breakpoints.down("sm")]: {
      width: 50,
      height: 50,
    },
  },
  link: {
    textDecoration: "none",
    color: theme.palette.primary.light,
  },
  comments: {
    marginRight: `1rem`,
  },
  numero: {
    position: `relative`,
    top: `-0.5rem`,
    textDecoration: `none`,
  },
  blogFooter: {
    borderTop: `1px solid lighten(#333, 70%)`,
    margin: `0 auto`,
    paddingBottom: `.125rem`,
    width: `80%`,
    "& ul": {
      listStyle: `none`,
      display: `flex`,
      flex: `row wrap`,
      justifyContent: `flex-end`,
      paddingLeft: 0,
    },
    "& li:first-child": {
      marginRight: `auto`,
    },
    "& li + li": {
      marginLeft: `.5rem`,
    },
    "& li": {
      color: `#999999`,
      fontSize: `.75rem`,
      height: `1.5rem`,
      letterSpacing: `1px`,
      lineHeight: `1.5rem`,
      textAlign: `center`,
      textTransform: `uppercase`,
      position: `relative`,
      whiteSpace: `nowrap`,
      "& a": {
        color: `#999999`,
      },
    },
  },
  icons: {
    fill: `lighten(#333, 40%)`,
    height: `24px`,
    marginRight: `.5rem`,
    transition: `.25s ease`,
    width: `24px`,
    "&:hover": {
      fill: `#ff4d4d`,
    },
  },
}))

export default function BlogBriefCard({ post }) {
  const {
    imgUrl, avatar, name, firstName, lastName, title, slug, description,
    excerpt, tags, createdAt,
  } = post
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Link to={`/user/${name}/`}>
            <Avatar aria-label="author" alt={name} src={avatar} className={classes.avatar}/>
          </Link>
        }
        action={
          <IconButton aria-label="follow">
            <BookmarkBorderIcon/>
          </IconButton>
        }
        title={
          <Typography variant="h6" gutterBottom className={classes.blogAuthorName}>
            <Link to={`/blog/${slug}`}>{title}</Link>
          </Typography>
        }
        subheader={`created by ${firstName} ${lastName} @ ${createdAt}`}
      />
      <CardMedia
        className={classes.bbMedia}
        image={imgUrl}
        title="hero image"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon/>
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon/>
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon/>
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>
            {excerpt}
          </Typography>
          <Link to={`blog/${slug}/`} className={classes.link}>
            <Typography variant="subtitle1" paragraph className={classes.readMore} color="primary">
              Continue reading...
            </Typography>
          </Link>
          <ArticleTags tags={tags}/>
          <div className={classes.blogFooter}>
            <ul>
              <li className={classes.publishedDate} style={{ display: `none` }}>{createdAt}</li>
              <li className={classes.comments}><Link to="#">
                <ChatBubbleOutlineRoundedIcon className={classes.icons}/>
                <span className={classes.numero}>4</span></Link></li>
              <li className="shares"><Link to="#">
                <StarBorderRoundedIcon className={classes.icons}/>
                <span className={classes.numero}>1</span></Link></li>
            </ul>
          </div>
        </CardContent>
      </Collapse>
    </Card>
  )
}
```
4. Article Tags

```jsx
import React from "react"
import { Link } from "gatsby"
import useStyles from "../styles/style"

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
export default ArticleTags
```

5. AuthorBox component

```jsx
import React from "react"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import Avatar from "@material-ui/core/Avatar"
import Typography from "@material-ui/core/Typography"
import Link from "./Link"
import makeStyles from "@material-ui/core/styles/makeStyles"

const useStyles = makeStyles(theme => ({
  card: {
    // maxWidth: 345,
    width: `100%`,
    boxShadow: `none`,
    borderRadius: `5px 5px 0 0`,
    marginTop: 15,
    backgroundColor: `rgba(0, 0, 0, 0)`,
  },
  avatar: {
    marginLeft: 20,
    width: 72,
    height: 72,
    [theme.breakpoints.down("sm")]: {
      width: 50,
      height: 50,
    },
  },
  link: {
    textDecoration: "none",
    color: theme.palette.primary.light,
  },
  btn: {
    borderColor: `#754abc`,
    color: `#754abc`,
    marginLeft: 12,
    marginTop: -4,
    padding: `3px 10px`,
    textAlign: `center`,
    borderRadius: `999em`,
    fontSize: `0.85rem`,
    display: `inline-block`,
    fontWeight: 400,
    lineHeight: 1.25,
    whiteSpace: `nowrap`,
    verticalAlign: `middle`,
    userSelect: `none`,
    border: `1px solid transparent`,
  },
}))

const AuthorCard = ({ post }) => {
  const {
    avatar, bio, firstName, lastName, name,
  } = post
  const classes = useStyles()
  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Link to={`/user/${name}/`}>
            <Avatar aria-label="author" src={avatar}
                    className={classes.avatar}/>
          </Link>
        }
        title={
          <Typography variant="h6" gutterBottom className={classes.blogAuthorName}>
            <Link to={`/user/${name}/`}>
              {`${firstName} ${lastName}`} <span className={classes.btn}>Follow</span>
            </Link>
          </Typography>
        }
        subheader={bio}
      />
    </Card>
  )
}


AuthorBox.propTypes = {
  post: PropTypes.object.isRequired
};


export default AuthorCard
```





## Layouts
1. Create folder src/layout
## Markdown blogs
## Styling