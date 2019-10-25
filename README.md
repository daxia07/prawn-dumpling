# prawn-dumpling
personal website including both frontend and backend

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
2. make two directories named by frontend and backend.
3. cd into frontend, and run 
```
npm init -y
```
4. install gatsby command line globally with
```
npm i -g gatsby-cli
```
install packages: *gatsby, gatsby-plugin-react-helmet, gatsby-plugin-sharp, react-dom* with command
```
yarn add gatsby gatsby-plugin-react-helmet gatsby-plugin-sharp react-dom
```
A brief intro, react-helmet plugin generates html head where meta data and stylesheets resides, sharp plugin helps improve image performance.

5. mkdir under frontend folder src/pages, add a file named index.js with code
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
6. Install VSCode if it was not already in your computer, and configure your launch.json as instructed in official [webpage](https://www.gatsbyjs.org/docs/debugging-the-build-process/ "webpage"). **Don't Forget To Add `frontend` to your launch configuration path!**


