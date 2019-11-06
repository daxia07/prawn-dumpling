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

## Summary
In this tutorial, we set up develop environment, root component and configurations like vscode launch.json file. It's an important procedure, if not treated seriously, may lead to a lot of painful debugging work. Trust me, you won't want to experience that, and don't ask me why!

Next Chapter, we will get started to create components!