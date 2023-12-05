// products_display.js

document.addEventListener('DOMContentLoaded', function () {
    // Get parameters
    let params = new URL(document.location).searchParams;
    let error = params.get('error');
    let order = getOrderArray(params);

    // Populate error message
    if (error === 'true') {
        document.getElementById('errorDiv').innerHTML += `<h2 class="text-danger"></h2><br>`;
    }

    // Populate products
    const rowContainer = document.querySelector('.row');
    for (let i = 0; i < products.length; i++) {
        rowContainer.innerHTML += getProductHtml(products[i], i, order[i]);
        validateQuantity(document.getElementById(`${i}`));
    }

    // Event listener for image clicks
    rowContainer.addEventListener('click', function (event) {
        const clickedImage = event.target.closest('.name-img');
        if (clickedImage) {
            const index = parseInt(clickedImage.dataset.index);
            incrementQuantity(index);
        }
    });

    // Event listener for input changes
    rowContainer.addEventListener('input', function (event) {
        if (event.target.name === 'quantity_textbox') {
            validateQuantity(event.target);
        }
    });
    function handleSubmit(event) {
        event.preventDefault();
    
        // Collect selected quantities
        const selectedQuantities = [];
        for (let i = 0; i < products.length; i++) {
            const quantity = document.getElementById(`${i}`).value;
            selectedQuantities.push(quantity);
        }
    
        // Append selected quantities to the form data
        const formData = new FormData(document.forms['qty_form']);
        selectedQuantities.forEach((quantity, index) => {
            formData.append(`qty${index}`, quantity);
        });
    
        // Redirect to the login page with the updated form data
        window.location.href = `/login.html?${new URLSearchParams(formData).toString()}`;
    }
    
    
    // Event listener for form submission
    document.querySelector('form[name="qty_form"]').addEventListener('submit', handleSubmit);
    
});

// Function to get the order array from URL parameters
function getOrderArray(params) {
    let order = [];
    params.forEach((value, key) => {
        if (key.startsWith('prod')) {
            order.push(parseInt(value));
        }
    });
    console.log('Order Array:', order);
    return order;
}

// ... (remaining code) ...

// Function to generate HTML for a product
function getProductHtml(product, index, orderValue) {
    return `
        <div class="col-md-6 product_name mb-4">
            <div class="name">
                <div class="text-center">
                    <img src="${product.image}" class="name-img" alt="Product Image" data-tooltip="${product.description}" id="image-${index}">
                </div>
                <div class="name-body">
                    <h5 class="name-title">${product.name}</h5>
                    <p class="name-text">
                        Price: $${product.price.toFixed(2)}<br>
                        Available: ${product.quantity_available}<br>
                        Total Sold: ${product.qty_sold}
                    </p>
                    
                    <div class="quantity-controls">
                        <button type="button" class="quantity-button minus" onclick="decrementQuantity(${index})">-</button>
                        <input type="text" placeholder="0" name="quantity_textbox" id="${index}" class="form-control" value="${orderValue !== 0 && orderValue !== undefined ? orderValue : '0'}" readonly>
                        <button type="button" class="quantity-button plus" onclick="incrementQuantity(${index})">+</button>
                    </div>
                    <p id="invalidQuantity${index}" class="text-danger"></p>
                </div>
            </div>
        </div>`;
}



// Function to validate the quantity
function validateQuantity(quantity) {
    let errorMessage = '';
    let quantityNumber = Number(quantity.value);
    let productId = quantity.id;

    // Validation logic
    if (isNaN(quantityNumber)) {
        errorMessage = "Please Enter a Number";
    } else if (quantityNumber < 0 && !Number.isInteger(quantityNumber)) {
        errorMessage = "Please Enter a Positive Integer";
    } else if (quantityNumber < 0) {
        errorMessage = "Please Enter a Positive Value";
    } else if (!Number.isInteger(quantityNumber)) {
        errorMessage = "Please Enter an Integer";
    } else if (quantityNumber > products[productId].quantity_available) {
        errorMessage = "We do not have enough pets in stock!";
    }

    // Display an alert if there's an error
    if (errorMessage !== '') {
        alert(errorMessage);
    }

    // Update the validation message in the DOM
    document.getElementById(`invalidQuantity${productId}`).innerHTML = errorMessage;
}

// Function to decrement the quantity
function decrementQuantity(index) {
    const quantityTextbox = document.getElementById(`${index}`);
    let currentQuantity = parseInt(quantityTextbox.value) || 0;

    // Decrement the quantity
    if (currentQuantity > 0) {
        currentQuantity--;
    }

    // Update the textbox value
    quantityTextbox.value = currentQuantity;

    // Validate the updated quantity
    validateQuantity(quantityTextbox);
}

// Function to increment the quantity
function incrementQuantity(index) {
    const quantityTextbox = document.getElementById(`${index}`);
    let currentQuantity = parseInt(quantityTextbox.value) || 0;

    // Increment the quantity
    currentQuantity++;

    // Update the textbox value
    quantityTextbox.value = currentQuantity;

    // Validate the updated quantity
    validateQuantity(quantityTextbox);
}
