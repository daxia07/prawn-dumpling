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
const index = () => {
  return (
    <div>
      hello 
    </div>
  )
}
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
```
we used staticQuery from gatsby to fetch metadata we just defined in gatsby-config

3. Create a theme file under src/assets/siteTheme.js
```jsx
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
const useStyles = makeStyles(theme => ({
  // you can define your custom theme here
}))

export default useStyles
```

6. Create a mui styled Link component with React.forwardRef.
```jsx

const Link = React.forwardRef(function Link(props, ref) {
  return <MuiLink component={GatsbyLink} style={{ textDecoration: "none" }} ref={ref} {...props} />
})

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
```

&ensp;let's include this component in src/pages/index.js, and pass post prop with mockData

2. After we finish the feature post, let's work on the sub feature post component. Create a new component name SubFeaturedPost.js under src/components/

```jsx
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
```

5. AuthorBox component

```jsx
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
```

6. BlogHead component
```jsx
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

```

7. Before we move on to BlogBody component, we should convert our MarkDown file to HTML with good styling. First, we should install a new package named 'markdown-to-jsx'
```
yarn add markdown-to-jsx
```
Create a js file named Markdown.js under utils folder
```jsx
const styles = theme => ({
  listItem: {
    marginTop: theme.spacing(1),
  },
});

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h4',
      },
    },
    h2: { component: Typography, props: { gutterBottom: true, variant: 'h6' } },
    h3: { component: Typography, props: { gutterBottom: true, variant: 'subtitle1' } },
    h4: {
      component: Typography,
      props: { gutterBottom: true, variant: 'caption', paragraph: true },
    },
    p: { component: Typography, props: { paragraph: true } },
    a: { component: Link },
    li: {
      component: withStyles(styles)(({ classes, ...props }) => (
        <li className={classes.listItem}>
          <Typography component="span" {...props} />
        </li>
      )),
    },
  },
};

export default function Markdown(props) {
  return <ReactMarkdown options={options} {...props} />;
}
```

8. Blog body component
we add a new key `body` to the post object of mockdata, with the value of a markdown formatted blog post
```jsx
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
```

**That's all the components we are going to use by now, let's create the layout in the next chapter**



## Layouts
1. Let's work on Header and NavBar first.<br/>
For different screen size, we will have different layout. For large screens, nav items can be shown under header, while smaller screens have to fold them in a drawer.<br/>
For bigger screen, header will hold them site name, subscribe button and a searchBar.<br/>
Let's create a search bar component first.
```jsx
import React, { useState } from "react"
import SearchIcon from "@material-ui/icons/Search"
import InputBase from "@material-ui/core/InputBase"
import { makeStyles } from "@material-ui/core"
import { fade } from "@material-ui/core/styles"
import { useStaticQuery, graphql } from "gatsby"
import Link from "./Link"
import MenuItem from "@material-ui/core/MenuItem"
import Downshift from "downshift"
import Paper from "@material-ui/core/Paper"


const useStyles = makeStyles(theme => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 10,
    width: "auto",
    [theme.breakpoints.up("sm")]: {
      marginLeft: "auto",
      width: "auto",
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 120,
      "&:focus": {
        width: 200,
      },
    },
  },
  root: {
    flexGrow: 1,
    height: `auto`,
  },
  container: {
    flexGrow: 1,
    position: "relative",
  },
  paper: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  divider: {
    height: theme.spacing(2),
  },
  resultPanel: {
    marginTop: 38,
  },
}))

const SearchBar = () => {
  const classes = useStyles()

  const renderInput = inputProps => {
    const { InputProps, classes, value } = inputProps
    return (
      <InputBase
        placeholder="Search…"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ "aria-label": "search", ...InputProps }}
        value={value}
        margin="dense"
        style={{ float: `right` }}
      />
    )
  }


  return (
    <div className={classes.search} style={{ fontSize: `1rem` }}>
      <div className={classes.searchIcon}>
        <SearchIcon/>
      </div>

      <div className={classes.root}>
        <Downshift id="downshift-simple">
          {({
              getInputProps,
              getItemProps,
              getLabelProps,
              getMenuProps,
              highlightedIndex,
              isOpen,
              selectedItem,
            }) => {
            const { onBlur, onFocus, ...inputProps } = getInputProps({
              placeholder: "Search...",
            })

            return (
              <div className={classes.container}>
                {renderInput({
                  classes,
                  label: "Search",
                  InputLabelProps: getLabelProps({ shrink: true }),
                  InputProps: { onBlur, onFocus },
                  inputProps,
                })}

                <div {...getMenuProps()}>
                  {!isOpen ? (
                    <Paper className={classes.paper} square style={{ marginTop: 38 }}>
                    </Paper>
                  ) : null}
                </div>
              </div>
            )
          }}
        </Downshift>
        <div className={classes.divider}/>
      </div>
    </div>
  )
}

export default SearchBar
```

```jsx
import PropTypes from "prop-types"
import React from "react"
import Toolbar from "@material-ui/core/Toolbar"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import { makeStyles } from "@material-ui/core"
import Link from "../components/Link"
import { capitalize } from "../utils/stringUtils"
import navigate from "../utils/navigate"

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
```

2. We will need a layout component to begin with. To prevent class names collisions, we need to provide a unique prefix for each page. Besides, we will query site title with staticQuery method from gatsby to set up title for each page. This component will change according to the width of screen be responsive. Additionally, we need to record if the drawer in layout is open, so we can push the main component aside a little. For smaller screen, nav bar items were hidden in a drawer. Once clicked, contents will be pushed away to the right. We pass useState hook to the child component to let Nav component to decide when to open or close the drawer.  Add another dependency named clsx to help add className to component when state changes.


```jsx
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

```

3. Footer component is pretty easy, it has a minimal height of 80vh to stay at bottom.
```jsx
import React from "react"
import Typography from "@material-ui/core/Typography"
import Container from "@material-ui/core/Container"
import useStyles from "../styles/style"
import Copyright from "./Copyright"


const Footer = () => (
    <footer className={useStyles().footer}>
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom>
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
        </Typography>
        <Copyright />
      </Container>
    </footer>
  )

export default Footer
```

4. Let's write our navBar component. First, we should figure out which items will be displayed and respective click handlers for each item. 
Create a custom hook file withDimensions.js in src/util 
```jsx
import {useState, useEffect} from 'react'

const getWindowDimensions = () => {
  const windowGlobal = typeof window !== 'undefined' && window;
  const {innerWidth: width, innerHeight: height} = windowGlobal;
  return {
    width, height
  }
};

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  useEffect(() => {
    const handleResize = () => setWindowDimensions(getWindowDimensions());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowDimensions;
}

export default useWindowDimensions
```

For a bigger screen, we build a header component and render nav bar items below. 

```jsx
export const ListRenderer = (items, icon = true) => (
  <List>
    {items.map((item, index) =>
      <ListItem button key={index}>
        {icon &&
        <ListItemIcon>
          {item.icon}
        </ListItemIcon>
        }
        {item.comp}
      </ListItem>)
    }
  </List>
)
```

defaultNavItems include category items and page items
```jsx
const defaultItems = { ...CAT_BTNS, ...PAGES_BTNS }

Object.keys(defaultItems).forEach((key, index) => {
  defaultItems[key].name = key
  defaultItems[key].comp = makeLinkItem(key)
})

export const defaultNavItems = Object.values(defaultItems)
```


Header component include subscribe button, site title and a search button

```jsx

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
```
For smaller screen, we just use the example of drawer from material UI.

```jsx
const AppTopBar = ({ siteTitle, items, drawerHandler, drawerOpen }) => {
  const navItems = items ? items : defaultNavItems
  const title = siteTitle.replace("-", " ")
  const classes = useStyles()
  const theme = useTheme()

  const handleDrawerOpen = () => {
    drawerHandler(true)
  }

  const handleDrawerClose = () => {
    drawerHandler(false)
  }

  console.log(drawerOpen)

  return (
    <div className={classes.root}>
      <CssBaseline/>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, drawerOpen && classes.hide)}
          >
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" noWrap>
            {capitalize(title)}
          </Typography>
          <SearchBar/>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
          </IconButton>
        </div>
        {ListRenderer(navItems, true)}
        <Divider/>
        <List>
          <ListItem button key="account">
            <ListItemIcon>
              <AccountBoxRoundedIcon/>
            </ListItemIcon>
          </ListItem>
        </List>
      </Drawer>
    </div>
  )
}
```


Then we have our navBar component.

```jsx
const NavBar = ({ siteTitle, items, drawerHandler, drawerOpen }) => {
  const navItems = items ? items : defaultNavItems
  const classes = useStyles()
  const { width } = useWindowDimensions()
  const theme = useTheme()
  const renderHelper = (windowWidth) => {
    if (windowWidth > theme.breakpoints.values["md"]) {
      return (
        <React.Fragment>
          <Header siteTitle={siteTitle} />
          <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
            {ListRenderer(navItems, true)}
          </Toolbar>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <AppTopBar siteTitle={siteTitle} items={items} drawerHandler={drawerHandler} drawerOpen={drawerOpen}/>
        </React.Fragment>
      )
    }
  }

  return (
    <React.Fragment>
      {renderHelper(width)}
    </React.Fragment>
  )
}
```








## Markdown blogs
## Styling