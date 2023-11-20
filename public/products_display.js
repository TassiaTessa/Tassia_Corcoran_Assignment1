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

    // Event listener for input changes
    rowContainer.addEventListener('input', function (event) {
        if (event.target.name === 'quantity_textbox') {
            validateQuantity(event.target);
        }
    });
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

// Function to generate HTML for a product
function getProductHtml(product, index, orderValue) {
    return `
        <div class="col-md-6 product_name mb-4">
            <div class="name">
                <div class="text-center">
                    <img src="${product.image}" class="name-img" alt="Product Image" data-tooltip="${product.description}">
                </div>
                <div class="name-body">
                    <h5 class="name-title">${product.name}</h5>
                    <p class="name-text">
                        Price: $${product.price.toFixed(2)}<br>
                        Available: ${product.quantity_available}<br>
                        Total Sold: ${product.total_sold}
                    </p>
                    
                    <input type="text" placeholder="0" name="quantity_textbox" id="${index}" class="form-control" value="${orderValue !== 0 && orderValue !== undefined ? orderValue : ''}">
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
