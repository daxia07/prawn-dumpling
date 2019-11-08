const _ = require("lodash");
const path = require("path");

const slugify = text => text.toLowerCase().replace(/\W/g, " ").trim().replace(/ +/g, '-')

exports.onCreateWebpackConfig = ({ stage, actions }) => {
	if (stage === 'develop') {
		actions.setWebpackConfig({
         devtool: "eval-source-map",
		});
  }
};

exports.onCreateNode = ({ node, actions }) => {
	const { createNodeField } = actions
	const slugSet = new Set([])
	if (node.internal.type === `ContentfulBlogPost`) {
		let newSlug = slugify(node.title)
		console.log(newSlug)
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
};