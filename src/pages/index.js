import React from 'react'
import FeaturedPost from '../components/FeaturePost';
import SubFeaturedPost from '../components/SubFeaturedPost';
import Layout from '../layouts/layout';
import { graphql } from 'gatsby';
import { extractFeaturedPost, extractSubFeaturedPost, extractOtherPosts } from "../utils/extractor"
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import PostsView from '../components/PostsView';
import Sidebar from '../layouts/Sidebar';


const useStyles = makeStyles(theme => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  }
}))


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


const index = ({ data }) => {
  const classes = useStyles()
  const { featured, otherPosts, subFeatured, topTrends } = data
  const featuredPost = extractFeaturedPost(featured.edges[0].node)
  const subFeaturedPost = extractSubFeaturedPost(subFeatured.edges)
  const posts = extractOtherPosts(otherPosts.edges)
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
}

export default index
