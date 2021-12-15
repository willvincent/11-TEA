module.exports = () => {
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