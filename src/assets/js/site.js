const lazyLoad = (targets, onIntersection) => {
    const observer = new IntersectionObserver((entries, self) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                onIntersection(entry.target)
                self.unobserve(entry.target)
            }
        })
    })
    targets.forEach((target) => observer.observe(target))
}
  
const lazyPictures = document.querySelectorAll('.lazy-picture')

lazyLoad(lazyPictures, (pictureElement) => {
    const img = pictureElement.querySelector('img')
    const sources = pictureElement.querySelectorAll('source')

    img.onload = () => {
        pictureElement.dataset.loaded = true
        img.removeAttribute('data-src')
    }
    img.onerror = () => {
        pictureElement.dataset.loaded = false
    }

    sources.forEach((source) => {
        source.sizes = source.dataset.sizes
        source.srcset = source.dataset.srcset
        source.removeAttribute('data-srcset')
        source.removeAttribute('data-sizes')
    })

    img.src = img.dataset.src
})