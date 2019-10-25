exports.onCreateWebpackConfig = ({ stage, actions }) => {
	if (stage === 'develop') {
		actions.setWebpackConfig({
      // devtool: 'cheap-module-source-map',
      // devtool: 'cheap-module-eval-source-map',
      // devtool: 'source-map'
      devtool: "eval-source-map",
		});
  }
};