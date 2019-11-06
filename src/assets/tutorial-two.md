## Intro
In this chapter, we will create basic UI components and put them in index page for test. I am not going into the details of the styling, so code below does not contain css or jss, please feel free to find it in the [repos](https://github.com/daxia07 "repos") under name 'prawn-dumpling'. 


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

## Summary
This chapter is relatively easy, as very little logic in these UI components. The best reference is the docs from official website. If you are a fun of [material design](https://material-ui.com/ "material design") , go check it out.

Next chapter, we will go deep into the layout components. See you in next chapter!