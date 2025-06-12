document.addEventListener('DOMContentLoaded', function() {
    // Filter products by category
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.dataset.filter;
            
            // Filter products
            productCards.forEach(card => {
                if (filterValue === 'all' || card.dataset.category === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Sort products
    const sortSelect = document.getElementById('sort');
    
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const productsContainer = document.querySelector('.products-grid');
        const products = Array.from(productCards);
        
        products.sort((a, b) => {
            switch(sortValue) {
                case 'price-asc':
                    return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                case 'price-desc':
                    return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                case 'newest':
                    return new Date(b.dataset.date) - new Date(a.dataset.date);
                default:
                    return 0;
            }
        });
        
        // Re-append sorted products
        products.forEach(product => {
            productsContainer.appendChild(product);
        });
    });
    
    // Pagination (simplified example)
    const paginationButtons = document.querySelectorAll('.pagination button');
    
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent === 'Previous' || this.textContent === 'Next') return;
            
            paginationButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // In a real implementation, you would fetch new products here
            console.log('Page', this.textContent, 'would be loaded');
        });
    });
});