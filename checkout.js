document.addEventListener('DOMContentLoaded', function() {
    // Payment method toggle
    const paymentMethods = document.querySelectorAll('.payment-method');
    const cardPaymentForm = document.getElementById('card-payment-form');
    const codMessage = document.getElementById('cod-message');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove('active'));
            // Add active class to clicked method
            this.classList.add('active');
            
            // Check which radio button should be checked
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
            }
            
            // Show/hide forms based on selection
            const selectedMethod = this.getAttribute('data-method');
            if (selectedMethod === 'card') {
                cardPaymentForm.classList.remove('hidden');
                codMessage.classList.add('hidden');
            } else if (selectedMethod === 'cod') {
                cardPaymentForm.classList.add('hidden');
                codMessage.classList.remove('hidden');
            }
        });
    });

    // Country-specific validation rules
    const validationRules = {
        US: {
            zip: /^\d{5}(-\d{4})?$/,
            state: /^[A-Z]{2}$/i
        },
        CA: {
            zip: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/i,
            state: /^[A-Z]{2}$/i
        },
        UK: {
            zip: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i,
            state: /^[A-Za-z]{2,}$/i
        },
        AU: {
            zip: /^\d{4}$/,
            state: /^[A-Z]{2,3}$/i
        }
    };

    // Luhn algorithm for credit card validation
    function validateCreditCardNumber(cardNumber) {
        // Remove all non-digit characters
        cardNumber = cardNumber.replace(/\D/g, '');
        
        // Check if the card number is empty or not all digits
        if (!/^\d+$/.test(cardNumber)) {
            return false;
        }
        
        // Check card type based on initial digits
        const cardTypes = {
            visa: /^4/,
            mastercard: /^5[1-5]/,
            amex: /^3[47]/,
            discover: /^6(?:011|5)/
        };
        
        let cardType = 'unknown';
        for (const [type, regex] of Object.entries(cardTypes)) {
            if (regex.test(cardNumber)) {
                cardType = type;
                break;
            }
        }
        
        // Validate length based on card type
        const validLengths = {
            visa: [13, 16],
            mastercard: [16],
            amex: [15],
            discover: [16]
        };
        
        if (cardType !== 'unknown' && !validLengths[cardType].includes(cardNumber.length)) {
            return false;
        }
        
        // Luhn algorithm validation
        let sum = 0;
        let shouldDouble = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i), 10);
            
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        
        return (sum % 10) === 0;
    }

    // Validate expiry date (MM/YY format)
    function validateExpiryDate(expiryDate) {
        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
            return false;
        }
        
        const [month, year] = expiryDate.split('/').map(Number);
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        
        // Validate month (1-12)
        if (month < 1 || month > 12) {
            return false;
        }
        
        // Validate year (not in past)
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return false;
        }
        
        return true;
    }

    // Validate CVV based on card type
    function validateCVV(cvv, cardNumber) {
        if (!/^\d{3,4}$/.test(cvv)) {
            return false;
        }
        
        cardNumber = cardNumber.replace(/\D/g, '');
        
        // AMEX cards have 4-digit CVV, others have 3
        if (/^3[47]/.test(cardNumber)) {
            return cvv.length === 4;
        }
        
        return cvv.length === 3;
    }

    // Validate phone number (basic international format)
    function validatePhoneNumber(phone) {
        // Basic international phone validation
        return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone);
    }

    // Validate postal code based on country
    function validatePostalCode(zip, country) {
        if (!country || !validationRules[country]) {
            return true; // No specific validation for this country
        }
        
        const regex = validationRules[country].zip;
        return regex.test(zip);
    }

    // Validate state based on country
    function validateState(state, country) {
        if (!country || !validationRules[country]) {
            return true; // No specific validation for this country
        }
        
        const regex = validationRules[country].state;
        return regex.test(state);
    }

    // Enhanced form validation
    function validateForm(formId) {
        const form = document.getElementById(formId);
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        const country = document.getElementById('country')?.value;
        
        inputs.forEach(input => {
            // Reset error state
            input.style.borderColor = '#ddd';
            const errorElement = document.getElementById(`${input.id}-error`);
            if (errorElement) {
                errorElement.remove();
            }
            
            // Check empty fields
            if (!input.value.trim()) {
                showError(input, 'This field is required');
                isValid = false;
                return;
            }
            
            // Field-specific validations
            let errorMessage = '';
            
            switch(input.id) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        errorMessage = 'Please enter a valid email address';
                    }
                    break;
                    
                case 'phone':
                    if (!validatePhoneNumber(input.value)) {
                        errorMessage = 'Please enter a valid phone number';
                    }
                    break;
                    
                case 'zip':
                    if (!validatePostalCode(input.value, country)) {
                        errorMessage = 'Please enter a valid postal code';
                    }
                    break;
                    
                case 'state':
                    if (!validateState(input.value, country)) {
                        errorMessage = 'Please enter a valid state/province';
                    }
                    break;
                    
                case 'card-number':
                    if (!validateCreditCardNumber(input.value)) {
                        errorMessage = 'Please enter a valid credit card number';
                    }
                    break;
                    
                case 'expiry-date':
                    if (!validateExpiryDate(input.value)) {
                        errorMessage = 'Please enter a valid expiry date (MM/YY)';
                    }
                    break;
                    
                case 'cvv':
                    const cardNumber = document.getElementById('card-number')?.value || '';
                    if (!validateCVV(input.value, cardNumber)) {
                        errorMessage = 'Please enter a valid CVV';
                    }
                    break;
            }
            
            if (errorMessage) {
                showError(input, errorMessage);
                isValid = false;
            }
        });
        
        return isValid;
    }

    // Show error message under input field
    function showError(input, message) {
        input.style.borderColor = 'var(--secondary-color)';
        
        const errorElement = document.createElement('div');
        errorElement.id = `${input.id}-error`;
        errorElement.className = 'error-message';
        errorElement.style.color = 'var(--secondary-color)';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.textContent = message;
        
        input.parentNode.appendChild(errorElement);
    }

    // Form submission handler
    const placeOrderBtn = document.getElementById('place-order-btn');
    placeOrderBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove any existing error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        
        // Validate forms before submission
        const customerFormValid = validateForm('customer-info-form');
        const shippingFormValid = validateForm('shipping-address-form');
        
        let paymentFormValid = true;
        if (document.getElementById('card-payment').checked) {
            paymentFormValid = validateForm('credit-card-form');
        }
        
        if (customerFormValid && shippingFormValid && paymentFormValid) {
            // Here you would typically submit the form to your server
            alert('Order placed successfully!');
            // window.location.href = '/order-confirmation';
        }
    });
    
    // Real-time validation for credit card number
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\s+/g, '');
            if (value.length > 0) {
                value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
            }
            this.value = value;
            
            // Validate in real-time
            if (this.value.length > 0) {
                validateForm('credit-card-form');
            }
        });
    }
    
    // Real-time validation for expiry date
    const expiryDateInput = document.getElementById('expiry-date');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.value = value;
            
            // Validate in real-time
            if (this.value.length >= 5) {
                validateForm('credit-card-form');
            }
        });
    }
    
    // Real-time validation for CVV
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function() {
            // Validate in real-time
            if (this.value.length > 0) {
                validateForm('credit-card-form');
            }
        });
    }
    
    // Real-time validation for postal code based on country
    const zipInput = document.getElementById('zip');
    const countrySelect = document.getElementById('country');
    if (zipInput && countrySelect) {
        countrySelect.addEventListener('change', function() {
            if (zipInput.value) {
                validateForm('shipping-address-form');
            }
        });
        
        zipInput.addEventListener('input', function() {
            if (this.value) {
                validateForm('shipping-address-form');
            }
        });
    }
    
    // Real-time validation for state based on country
    const stateInput = document.getElementById('state');
    if (stateInput && countrySelect) {
        countrySelect.addEventListener('change', function() {
            if (stateInput.value) {
                validateForm('shipping-address-form');
            }
        });
        
        stateInput.addEventListener('input', function() {
            if (this.value) {
                validateForm('shipping-address-form');
            }
        });
    }

    function showOrderConfirmation(orderData) {
    const overlay = document.getElementById('confirmationOverlay');
    const paymentMethodEl = document.getElementById('confirmationPaymentMethod');
    const emailEl = document.getElementById('confirmationEmail');
    const dateEl = document.getElementById('confirmationDate');
    const orderNumberEl = document.getElementById('orderNumber');
    const orderTotalEl = document.getElementById('orderTotal');
    
    // Set dynamic values
    paymentMethodEl.textContent = orderData.paymentMethod;
    emailEl.textContent = orderData.email;
    orderNumberEl.textContent = orderData.orderNumber;
    orderTotalEl.textContent = orderData.total;
    
    // Set current date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = new Date().toLocaleDateString(undefined, options);
    
    // Show overlay
    overlay.classList.add('active');
    
    // Disable scrolling
    document.body.style.overflow = 'hidden';
}

// Close confirmation
document.getElementById('confirmationCloseBtn').addEventListener('click', function() {
    const overlay = document.getElementById('confirmationOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Redirect to homepage or order history
    window.location.href = '/'; // Change this to your desired URL
});
});

