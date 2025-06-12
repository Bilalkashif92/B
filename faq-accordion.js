document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Toggle active state
            this.classList.toggle('active');
            
            // Toggle answer visibility
            const answer = this.nextElementSibling;
            answer.classList.toggle('active');
            
            // Close other answers
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.classList.remove('active');
                    q.nextElementSibling.classList.remove('active');
                }
            });
        });
    });
});