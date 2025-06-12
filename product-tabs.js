document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update active state
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding pane
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === tabId) {
                    pane.classList.add('active');
                }
            });
        });
    });
    
    // Size guide modal
    const sizeGuideLink = document.querySelector('.size-guide-link');
    const sizeGuideModal = document.getElementById('size-guide');
    const modalCloseBtns = document.querySelectorAll('.modal-close, .btn-modal-close');
    const overlay = document.querySelector('.overlay');
    
    if (sizeGuideLink) {
        sizeGuideLink.addEventListener('click', function(e) {
            e.preventDefault();
            sizeGuideModal.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('no-scroll');
        });
    }
    
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
            overlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
    
    // Add to cart functionality
    const addToCartBtn = document.querySelector('.btn-add-to-cart');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const sizeSelect = document.getElementById('size');
            
            if (!sizeSelect.value) {
                alert('Please select a size');
                sizeSelect.focus();
                return;
            }
            
            const product = {
                id: 'prod-navy-suit',
                title: document.querySelector('.product-title').textContent,
                price: parseFloat(document.querySelector('.product-price').textContent.replace('$', '')),
                image: document.getElementById('main-product-image').src,
                size: sizeSelect.value,
                quantity: parseInt(document.getElementById('quantity').value)
            };
            
            // Add to cart (using the Cart class from cart.js)
            for (let i = 0; i < product.quantity; i++) {
                cart.addToCart(product);
            }
            
            // Open cart drawer
            document.querySelector('.cart-drawer').classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('no-scroll');
            
            // Show success message
            alert(`${product.quantity} ${product.title} (Size: ${product.size}) added to cart`);
        });
    }
});