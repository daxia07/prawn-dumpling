exports.onCreateWebpackConfig = ({ stage, actions }) => {
	if (stage === 'develop') {
		actions.setWebpackConfig({
         devtool: "eval-source-map",
		});
  }
};