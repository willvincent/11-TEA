/**
 * Based on Alexandr Hannisyan's blog post:
 * https://www.aleksandrhovhannisyan.com/blog/eleventy-image-lazy-loading/
 */
const Image = require('@11ty/eleventy-img')
const path = require('path')
const outdent = require('outdent')

const ImageWidths = {
    ORIGINAL: null,
    PLACEHOLDER: 24,
}

module.exports.default = async (
    src,
    alt,
    className,
    widths = [640, 768, 1024, 1280],
    baseFormat = 'jpeg',
    optimizedFormats = ['webp'],
    sizes = '100vw'
) => {
    let imageDir = '/assets/images/external'
    let fullSrc = src

    // Override image directory for local images
    if (src.substr(0, 14) === '/assets/images') {
        const parsed = path.parse(src)
        imageDir = parsed.dir
        fullSrc = path.join('src', src)
    }

    const imageMetadata = await Image(fullSrc, {
        widths: [ImageWidths.ORIGINAL, ImageWidths.PLACEHOLDER, ...widths],
        formats: [...optimizedFormats, baseFormat],
        outputDir: path.join('dist', imageDir),
        urlPath: imageDir,
        filenameFormat: (hash, _src, width, format) => {
            const suffix = width === ImageWidths.PLACEHOLDER ? 'placeholder' : width;
            return `${hash}-${width}.${format}`
        }
    })

    const formatSizes = Object.entries(imageMetadata).reduce((formatSizes, [format, images]) => {
        if (!formatSizes[format]) {
            const placeholder = images.find((image) => image.width === ImageWidths.PLACEHOLDER)
            const largestVariant = images[images.length - 1]

            formatSizes[format] = {
                placeholder,
                largest: largestVariant,
            }
        }

        return formatSizes
    }, {})

    const picture = outdent`<picture class="lazy-picture">
        ${Object.values(imageMetadata).map((formatEntries) => {
            const { format: formatName, sourceType } = formatEntries[0]
            const placeholderSrcset = formatSizes[formatName].placeholder.url;
            const actualSrcset = formatEntries
                                    .filter((image) => image.width !== ImageWidths.PLACEHOLDER)
                                    .map((image) => image.srcset)
                                    .join(', ')
            
            return `<source type="${sourceType}" srcset="${placeholderSrcset}" data-srcset="${actualSrcset}" data-sizes="${sizes}">`
        }).join('\n')}
        <img
        src="${formatSizes[baseFormat].placeholder.url}"
        data-src="${formatSizes[baseFormat].largest.url}"
        alt="${alt}"
        width="${formatSizes[baseFormat].largest.width}"
        height="${formatSizes[baseFormat].largest.height}"
        class="lazy-img${className ? ' ' + className : ''}"
        loading="lazy"
        decoding="async">
        </picture>`

    return picture
}
