// Cart Functionality
class Cart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('bk-threads-cart')) || [];
        this.cartBtn = document.querySelector('.cart-btn');
        this.cartItemsContainer = document.querySelector('.cart-items');
        this.cartEmpty = document.querySelector('.cart-empty');
        this.cartSubtotal = document.querySelector('.cart-subtotal-amount');
        this.checkoutBtn = document.querySelector('.btn-checkout');
        
        this.init();
    }
    
    init() {
        this.updateCartCount();
        this.renderCartItems();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Event delegation for cart item removal
        this.cartItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('cart-item__remove')) {
                const productId = e.target.closest('.cart-item').dataset.id;
                this.removeFromCart(productId);
            }
            
            if (e.target.classList.contains('cart-item__quantity-update')) {
                const productId = e.target.closest('.cart-item').dataset.id;
                const isIncrease = e.target.classList.contains('increase');
                this.updateQuantity(productId, isIncrease);
            }
        });
    }
    
    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.renderCartItems();
    }
    
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.renderCartItems();
    }
    
    updateQuantity(productId, isIncrease) {
        const item = this.cart.find(item => item.id === productId);
        
        if (item) {
            if (isIncrease) {
                item.quantity += 1;
            } else {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    this.removeFromCart(productId);
                    return;
                }
            }
            
            this.saveCart();
            this.renderCartItems();
        }
    }
    
    saveCart() {
        localStorage.setItem('bk-threads-cart', JSON.stringify(this.cart));
    }
    
    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        this.cartBtn.setAttribute('data-cart-count', count);
    }
    
    calculateSubtotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    renderCartItems() {
        if (this.cart.length === 0) {
            this.cartEmpty.style.display = 'flex';
            this.cartItemsContainer.style.display = 'none';
            this.checkoutBtn.disabled = true;
            this.cartSubtotal.textContent = '$0.00';
            return;
        }
        
        this.cartEmpty.style.display = 'none';
        this.cartItemsContainer.style.display = 'block';
        this.checkoutBtn.disabled = false;
        
        this.cartItemsContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item__image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item__details">
                    <h4 class="cart-item__title">${item.title}</h4>
                    <p class="cart-item__price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item__actions">
                        <div class="cart-item__quantity">
                            <button class="btn-icon cart-item__quantity-update decrease" aria-label="Decrease quantity">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span>${item.quantity}</span>
                            <button class="btn-icon cart-item__quantity-update increase" aria-label="Increase quantity">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="cart-item__remove">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        const subtotal = this.calculateSubtotal();
        this.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    }
}

// Initialize Cart
const cart = new Cart();

// Product Click Handler (would be on product pages)
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const productCard = button.closest('.product-card');
        const product = {
            id: productCard.dataset.id,
            title: productCard.querySelector('.product-title').textContent,
            price: parseFloat(productCard.querySelector('.product-price').textContent.replace('$', '')),
            image: productCard.querySelector('.product-image img').src
        };
        
        cart.addToCart(product);
        
        // Optional: Open cart drawer when adding an item
        document.querySelector('.cart-drawer').classList.add('active');
        document.querySelector('.overlay').classList.add('active');
        document.body.classList.add('no-scroll');
    });
});