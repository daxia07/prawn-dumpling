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
