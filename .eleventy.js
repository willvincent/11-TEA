const yaml = require("js-yaml")
const htmlmin = require("html-minifier")
const { format } = require('date-fns')
const readingTime = require('eleventy-plugin-reading-time')

module.exports = (eleventyConfig) => {
    // Disable automatic use of your .gitignore
    eleventyConfig.setUseGitIgnore(false)
    // Merge data instead of overriding
    eleventyConfig.setDataDeepMerge(true)

    // Support .yaml Extension in _data
    eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents))

    // Minify HTML
    eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
        if (!outputPath.endsWith(".html")) return content
        
        return htmlmin.minify(content, {
            useShortDoctype: true,
            removeComments: true,
            collapseWhitespace: true
        })
    })

    eleventyConfig.addFilter('datefmt', (contentDate) => format(contentDate, 'LLL do, yyyy'))
    eleventyConfig.addPlugin(readingTime)

    return {
        htmlTemplateEngine: 'njk',
        dir: {
            input: 'src',
            output: 'dist',
            includes: '_includes',
            layouts: '_layouts',
        }
    }
}