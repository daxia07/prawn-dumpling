import React from 'react'
import SEO from '../components/seo';
import FeaturedPost from '../components/FeaturePost';

import { post } from "../assets/mockPost";
import SubFeaturedPost from '../components/SubFeaturedPost';
import AuthorCard from '../components/AuthorCard';

import BlogBriefCard from '../components/BlogBriefCard';


const index = () => {
  return (
    <div>
      <SEO title="home" />
      <FeaturedPost post={post} />
      <SubFeaturedPost posts={[post, post]} />
      <AuthorCard post={post}/>

      <BlogBriefCard post={post}/>
    </div>
  )
}

export default index
