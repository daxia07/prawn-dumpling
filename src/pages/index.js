import React from 'react'
import FeaturedPost from '../components/FeaturePost';
import { post } from "../assets/mockPost";
import SubFeaturedPost from '../components/SubFeaturedPost';
import AuthorCard from '../components/AuthorCard';
import BlogBriefCard from '../components/BlogBriefCard';
import BlogHead from '../components/BlogHead';
import BlogBody from '../components/BlogBody';
import Layout from '../layouts/layout';



const index = () => {
  return (
      <Layout title="Home" classPrefix="idx">
        <FeaturedPost post={post} />
        <SubFeaturedPost posts={[post, post]} />
        <BlogBriefCard post={post}/>
        <AuthorCard post={post} />
        <BlogHead post={post} />
        <BlogBody post={post} />    
      </Layout>
  )
}

export default index
