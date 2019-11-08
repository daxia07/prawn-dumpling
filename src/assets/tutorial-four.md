## Intro
In this chapter, we will replace the mockPost data with source from contentful [contentful](contentful.com). If you don't have an account yet, you can try out their free tier of 5,000 free entries. It's a headless CMS provider with handy API access. Once you have the spaceId and accessToken ready, we are good to go!

## Initialize the contentful source
1. create a file of .contentful.json under root directory and paste in your spaceId and accessToken. Make sure you ignore this file in .gitignore so the secret won't get leaked out accidentally.

```json
{
  "spaceId": "{your_spaceId}",
  "accessToken": "{your_token}"
}
```

2. Put contentful config code on top of `gatsby-config` to read spaceId and accessToken for further config
```javascript
let contentfulConfig

try {
  // Load the Contentful config from the .contentful.json
  contentfulConfig = require("./.contentful")
} catch (_) {
}

// Overwrite the Contentful config with environment variables if they exist
contentfulConfig = {
  spaceId: process.env.CONTENTFUL_SPACE_ID || contentfulConfig.spaceId,
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN || contentfulConfig.accessToken,
}

const {
  spaceId,
  accessToken,
} = contentfulConfig

if (!spaceId || !accessToken) {
  throw new Error(
    "Contentful spaceId and the delivery token need to be provided.",
  )
}
```

3. Install plugin with command
```
yarn add gatsby-source-contentful
```

4. Create contentful model BlogPost and Person. 
For BlogPost model, fields are `title, hero image, description, body, author, publish date, tags, draft, featured, subFeature, category`. Hero image comes with media type, author is a reference for Person type, and body is just long text where we store our mark down blog body. For Person model, userName, FirstName, LastName, Email, avatar are requested.
Put in your own information, and publish your entry. Once finished restart your development server and visit url below in your browser.
```
http://localhost:8000/___graphql
```
You should be able to see allContentfulBlogPost, allContentfulPerson, ContentfulBlogPost and ContentfulPerson on the Explore column to the left.

5. Add slug to each each blog post. First, we transform the title to lower cases, and then replace the non-alphanumeric characters with white spaces, trim the leading and tailing white space and replace the remaining one or more spaces with dash. 
```js
const slugify = text => text.toLowerCase()
.replace(/\W/g, " ")
.trim()
.replace(/ +/g, '-')
``` 
When creating Node, add new Field `slug` with onCreateNode API. To make sure every page has a unique slug, we can use a set collection, and add every generated slug to the existing set. If no collision, use it, else append an auto-increment number to the end of the string. Include the function and code below in `gatsby-node.js`

```jsx
exports.onCreateNode = ({ node, actions }) => {
	const { createNodeField } = actions
	const slugSet = new Set([])
	if (node.internal.type === `ContentfulBlogPost`) {
		let newSlug = slugify(node.title)
		if (slugSet.has(newSlug)) {
			let pos = 1
			while (true) {
				if (!slugSet.has(`${newSlug}-${pos}`)) {
					newSlug = `${newSlug}-${pos}`
					break
				}
			}
		}
		createNodeField({
			name: "slug",
			node,
			value: newSlug,
		})
		slugSet.add(newSlug)
	}
};
```
Then we can checkout the newly imported field in browser at url `localhost:8000/___graphql`
6. Install markdown plugin.
```
yan add gatsby-transformer-remark
```
Then register the plugin in `gatsby-config.js`
```jsx
  plugins: [
    `your-other-plugins`,
    `gatsby-transformer-remark`,
  ]
```
If this procedure is successful, you can see `childMarkDownRemark` field under contentfulBlogPost -> body -> childMarddownRemark. We will use this plugin to count words, make excerpts and estimate reading time.
 

7. Make query fragments. First, create a new file query.js under asset folder, and put graphql fragments in. Then we can use these fragments in other queries.
```jsx
import { graphql } from "gatsby"

export const blogBasicFragment = graphql`
    fragment BlogBasic on ContentfulBlogPost {
        author {
            name
            lastName
            firstName
            avatar {
                file {
                    url
                }
            }
        }
        body {
            body
            internal {
                content
            }
            childMarkdownRemark {
                excerpt(format: PLAIN, pruneLength: 300, truncate: true)
            }
        }
        createdAt(fromNow: true)
        description {
            description
        }
        heroImage {
            file {
                url
            }
        }
        publishDate(fromNow: true)
        title
        tags
        category
        fields {
            slug
        }
    }
`

export const blogFeatureFragment = graphql`
    fragment BlogFeature on ContentfulBlogPost {
        author {
            name
        }
        description {
            description
        }
        heroImage {
            file {
                url
            }
        }
        title
        fields {
            slug
        }
    }
`


export const blogSubFeatureFragment = graphql`
    fragment BlogSubFeature on ContentfulBlogPost {
        author {
            name
        }
        description {
            description
        }
        heroImage {
            file {
                url
            }
        }
        title
        publishDate(formatString: "MMMM DD, YYYY")
        fields {
            slug
        }
    }
`
```

8. It's time to change our index page to load query data into components. Assuming you are using the default settings to create a new space in contentful, you should add `node_locale: {eq: "en-US"}` to filter the default entry, otherwise you may get duplicate edges for the same entry. Before index component, add code:
```jsx
export const query = graphql`
    query IndexQuery {
        featured: allContentfulBlogPost(filter: {draft: {eq: false}, featured: {eq: true}, node_locale: {eq: "en-US"}}, sort: {fields: updatedAt, order: DESC}, limit: 1) {
            edges {
                node {
                    ...BlogFeature
                }
            }
        }
        subFeatured: allContentfulBlogPost(filter: {subFeature: {eq: true}, draft: {eq: false}, node_locale: {eq: "en-US"}}, sort: {fields: updatedAt, order: DESC}, limit:2) {
            edges {
                node {
                    ...BlogSubFeature
                }
            }
        }
        otherPosts: allContentfulBlogPost(filter: {draft: {eq: false}, node_locale: {eq: "en-US"}}, sort: {fields: [updatedAt ], order: DESC}) {
            edges {
                node {
                    ...BlogBasic
                }
            }
        }
        topTrends:allContentfulBlogPost(filter: {draft: {eq: false}, node_locale: {eq: "en-US"}}, sort: {fields: [updatedAt], order: DESC}) {
            edges {
                node {
                    title
                    fields {
                        slug
                    }
                }
            }
        }
    }
`
```
Then you can access to data via prop.data in your index component.

9. Create a new file name extractor.js under src/util folder with code:
```jsx
export const extractFeaturedPost = node => ({
  author: node.author.name,
  description: node.description.description,
  imgUrl: node.heroImage.file.url,
  slug: node.fields.slug,
  title: node.title
});

export const extractSubFeaturedPost = (edges) => {
  let ret = [];
  edges.forEach(edge => {
    const {title, publishDate} = edge.node;
    const slug = edge.node.fields.slug;
    const imgUrl = edge.node.heroImage.file.url;
    const {description} = edge.node.description;
    ret.push({title, slug, publishDate, imgUrl, description});
  });
  return ret;
}

export const extractOtherPosts = (edges) => {
  let ret = [];
  edges.forEach(edge => {
    const {createdAt, category, tags, title, textType} = edge.node;
    const slug = edge.node.fields.slug;
    const imgUrl = edge.node.heroImage.file.url;
    const {name, firstName, lastName} = edge.node.author;
    const avatar = edge.node.author.avatar.file.url;
    const {body} = edge.node.body;
    const {excerpt} = edge.node.body.childMarkdownRemark;
    const {description} = edge.node.description;
    ret.push({createdAt, category, slug, tags, title, imgUrl, body, avatar,
      name, firstName, lastName, description, excerpt, textType});
  });
  return ret;
}

export const extractOnePost = node => {
    const { createdAt, category, tags, title,
      fields:{slug}, heroImage:{file:{url: imgUrl}},
      author:{name, firstName, lastName, avatar:{file:{url:avatar}},
        shortBio:{childMarkdownRemark:{excerpt:bio}}},
      body:{body, childMarkdownRemark:{excerpt, timeToRead, wordCount:{words}}},
      description:{description}} = node;
    return {createdAt, category, slug, tags, title, imgUrl, body, avatar,
      name, firstName, lastName, description, excerpt, bio, words, timeToRead};
}
```
So we get formatted data in our component with code 
```jsx
  const { featured, otherPosts, subFeatured, topTrends } = data
  const featuredPost = extractFeaturedPost(featured.edges[0].node)
  const subFeaturedPost = extractSubFeaturedPost(subFeatured.edges)
  const posts = extractOtherPosts(otherPosts.edges)
```
10. To use these data, we still need two more UI components. A PostsView component to render a list of post and a siderBar component to show trend.
```jsx
const PostsView = ({ posts, title }) => {
  let rTitle = title
  if (!title) {
    rTitle = "Latest Posts"
  }
  return (
    <Grid item xs={12} md={8}>
      <Typography variant="h6" gutterBottom>
        {rTitle}
      </Typography>
      <Divider/>
      {posts.map((post, index) => (
        <BlogBriefCard post={post} key={index}/>
      ))}
      {posts.title}
    </Grid>
  )
  ```

  ```jsx
  const Sidebar = ({ topTrends }) => {
  const classes = useStyles()
  return (
    <Grid item xs={12} md={4}>
      <Typography variant="h6" gutterBottom className={classes.sidebarSection}>
        Top Trends
      </Typography>
      <GridList component={"ul"} cols={1} spacing={2} cellHeight={"auto"}>
        {topTrends && topTrends.map((trend, index) => (
          <Button display="block" variant="text" key={index} style={{ textAlign: "left" }}>
            <Link to={`/blog/${trend.node.fields.slug}/`}
                  style={{ textDecoration: "none", textAlign: "left", color: "#333", marginRight: `auto` }}>
              {`${index + 1}. ${trend.node.title}`}
            </Link>
          </Button>
        ))}
      </GridList>
      <Typography variant="h6" gutterBottom className={classes.sidebarSection}>
        Social Connection
      </Typography>

      <TwitterIcon className={classes.icons}/>
      <FacebookIcon className={classes.icons}/>
      <EmailIcon className={classes.icons}/>
    </Grid>
  )
}
```
11. Our new index component will render FeaturedPost, two SubFeaturedPost, and all post in a listView wrapped up in Layout component.
```jsx
  return (
      <Layout title="Home" classPrefix="idx">
        <FeaturedPost post={featuredPost}/>
        <SubFeaturedPost posts={subFeaturedPost}/>
        <Grid container spacing={5} className={classes.mainGrid}>
          <PostsView posts={posts}/>
          <Sidebar topTrends={topTrends.edges}/>
        </Grid>  
      </Layout>
  )
```

12. If you click the links, you may be navigated to a 404 page. That's because we haven't created blog pages with the slugs yet. Let's do it now! Create a new folder named templates under src. We are going to deal with blog slug, `tags/{tag}/`, `cat/{cat}/`, and `user/{user}/` urls by mapping them to relevant template component. For each slug, we map node with corresponding data. We will use `lodash` to manipulate data in arrays and objects. Install it with one command line:
```
yarn add lodash
```

 In `gatsby-node.js`, use onCreatePages API:
```jsx
const _ = require("lodash")
const path = require("path");

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions
  const result = await graphql(`
  query {
    allContentfulBlogPost(filter: {draft:{eq: false}}) {
      edges {
        node {
          author {
            name
          }
          textType
          publishDate(fromNow: true)
          title
          tags
          category
          fields {
              slug
          }
        }
      }
    }
  }`)
  if (result.errors) {
    reporter.panicOnBuild("Error: loading create page query")
  }
  const posts = result.data.allContentfulBlogPost.edges
  const categories = _.chain(posts).map(e => e.node.category).uniq().value()
  const users = _.chain(posts).map(e => e.node.author.name).uniq().value()
  let tagList = []
  posts.forEach(ele => {
    tagList = [...ele.node.tags, ...tagList]
  })
  tagList = _.uniq(tagList)
  posts.forEach(({ node }, index) => {
    createPage({
      path: `blog/${node.fields.slug}/`,
      component: path.resolve(`./src/templates/blogDetail.js`),
      context: { slug: node.fields.slug },
    })
  })
  categories.forEach((cat, index) => {
    if (cat) {
      createPage({
        path: `${cat}/`,
        component: path.resolve("./src/templates/categoryPosts.js"),
        context: { category: cat },
      })
    }
  })
  users.forEach((user, index) => {
    if (user) {
      createPage({
        path: `user/${user}/`,
        component: path.resolve("./src/templates/userPosts.js"),
        context: { name: user },
      })
    }
  })
  tagList.forEach((tag, index) => {
    if (tag) {
      createPage({
        path: `tags/${tag}/`,
        component: path.resolve("./src/templates/tagPosts.js"),
        context: { tag: tag },
      })
    }
  })
}
```
Create blogDetail.js under src/templates/ folder. For smaller screen, Author info will be displayed after the article. Build a renderHelper:
```jsx
const renderHelper = (windowWidth, post) => {
  if (windowWidth > 960) {
    return (
      <React.Fragment>
        <AuthorCard post={post}/>
        <BlogHead post={post}/>
        <BlogBody post={post}/>
      </React.Fragment>
    )
  } else {
    return (
      <React.Fragment>
        <BlogHead post={post}/>
        <BlogBody post={post}/>
        <AuthorCard post={post}/>
      </React.Fragment>
    )
  }
}
```
Add query before or after component. Slug variable was passed down by context object from onCreatePage API. The component was injected with a prop named data.
```jsx
export const pageQuery = graphql`
    query BlogPostQuery($slug: String) {
        contentfulBlogPost(fields: {slug: {eq: $slug}}) {
            ...BlogBasic
            author {
                shortBio {
                    childMarkdownRemark {
                        excerpt(format: PLAIN, pruneLength: 140, truncate: true)
                    }
                }
            }
            body {
                childMarkdownRemark {
                    timeToRead
                    wordCount {
                        words
                    }
                }
            }
            textType
        }
    }
`
```
The component should render 
```jsx
<Layout classPrefix={"bdtl"} title="Blog">
  <Container className={classes.container}>
    {renderHelper(width, post)}
  </Container>
</Layout>
```
Create a new layout component named BlogListView.
```jsx
const BlogListView = ({ posts, classPrefix, sub }) =>
  <Layout classPrefix={classPrefix} title={`${sub.name}: 
  ${sub.title.toUpperCase()}`}>
    <Container container spacing={5} className={useStyles().container}>
      <Typography variant="h6" gutterBottom>
        {posts.length} {`Articles found from
            ${sub.name}:
            ${sub.title.toUpperCase()}`}
      </Typography>
      {posts.map((post, index) => (
        <div>
          <BlogBriefCard post={post} key={index}/>
          {index !== (posts.length - 1) ? <Divider/> : null}
        </div>))}
    </Container>
  </Layout>
```
The templates for tags, cat and user are quite similar, first query with given keyword:
```jsx
export const pageQuery = graphql`
    query CategoryPostQuery($category: String) {
        categoryPosts:allContentfulBlogPost(filter: {draft: {eq: false}, category: {eq: $category}, node_locale: {eq: "en-US"} } ) {
            edges {
                node {
                    ...BlogBasic
                    author {
                        shortBio {
                            childMarkdownRemark {
                                excerpt(format: PLAIN, pruneLength: 140, truncate: true)
                            }
                        }
                    }
                    body {
                        childMarkdownRemark {
                            timeToRead
                            wordCount {
                                words
                            }
                        }
                    }
                    textType
                }
            }
        }
    }
`
```

Then render posts in component:
```jsx
const CategoryPage = ({ data, pageContext: { category } }) => {
  const { categoryPosts } = data
  const posts = extractOtherPosts(categoryPosts.edges)
  const sub = { name: `Category`, title: category }
  return (
    <BlogListView posts={posts} classPrefix="catp" sub={sub}/>
  )
}
```

## Summary
In this chapter, we switched our content source from mock data to contentful entry. We used gatsby API to create unique slug for each post and used templates to create pages dynamically. Next chapter, we will add more feature to this system. See you~