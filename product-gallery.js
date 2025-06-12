// product-gallery.js
class ProductGallery {
    constructor() {
        this.gallery = document.querySelector('.product-gallery');
        if (!this.gallery) return;
        
        this.mainImage = this.gallery.querySelector('#main-product-image');
        this.thumbnails = this.gallery.querySelectorAll('.thumbnail');
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        this.thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => this.changeImage(index));
            thumb.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.changeImage(index);
                }
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                this.changeImage((this.currentIndex + 1) % this.thumbnails.length);
            } else if (e.key === 'ArrowLeft') {
                this.changeImage((this.currentIndex - 1 + this.thumbnails.length) % this.thumbnails.length);
            }
        });
    }
    
    changeImage(index) {
        this.thumbnails[this.currentIndex].classList.remove('active');
        this.thumbnails[this.currentIndex].setAttribute('aria-selected', 'false');
        
        this.currentIndex = index;
        const newImage = this.thumbnails[index].dataset.image;
        
        this.mainImage.style.opacity = 0;
        setTimeout(() => {
            this.mainImage.src = newImage;
            this.mainImage.style.opacity = 1;
        }, 150);
        
        this.thumbnails[index].classList.add('active');
        this.thumbnails[index].setAttribute('aria-selected', 'true');
        this.thumbnails[index].focus();
    }
}

new ProductGallery();