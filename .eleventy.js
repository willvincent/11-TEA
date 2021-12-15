const yaml = require("js-yaml")
const htmlmin = require("html-minifier")
const { format } = require('date-fns')
const readingTime = require('eleventy-plugin-reading-time')
const { image: imageShortcode } = require('./eleventy_src/shortcodes')

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

    // Shortcodes
    // -----------------------------------------------------
    eleventyConfig.addNunjucksAsyncShortcode('image', imageShortcode)

    // Filters
    // -----------------------------------------------------
    eleventyConfig.addFilter('datefmt', (contentDate) => {
        return format(contentDate, 'LLL do, yyyy')
    })

    // Plugins
    // -----------------------------------------------------
    eleventyConfig.addPlugin(readingTime)


    // Passthroughs
    // -----------------------------------------------------
    eleventyConfig.addPassthroughCopy('src/assets/js')

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