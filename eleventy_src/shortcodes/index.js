const fs = require('fs');

const shortcodes = {};

fs.readdirSync(__dirname).map((file) => {
    if (file === 'index.js' || file.substr(file.lastIndexOf('.') + 1) !== 'js') {
        return
    }
    const shortcode = file.substr(0, file.indexOf('.'))
    shortcodes[`${shortcode}`] = require('./' + shortcode).default
})

exports = module.exports = shortcodes