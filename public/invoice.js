// Invoice JS

// Global variables
let extendedPrices = [];
let extendedPrice = 0;
let subtotal = 0;
let taxAmount = 0;
let shipping = 0;

// Function to validate the quantity, returns a string if not a number, negative, not an integer, or a combination of both
function validateQuantity(quantity, availableQuantity) {
    let errors = [];
    quantity = Number(quantity);

    switch (true) {
        case isNaN(quantity) || quantity === '':
            errors.push("Not a number. Please enter non-negative quantity");
            break;
        case quantity < 0 && !Number.isInteger(quantity):
            errors.push("Not an integer. Please enter non-negative quantity");
            break;
        case quantity < 0:
            errors.push("Negative quantity. Please enter non-negative quantity");
            break;
        case quantity > availableQuantity:
            errors.push("Not enough items in stock");
            break;
    }
    return errors;
}

// Function to generate the item rows
function generateItemRows() {
    // Get the table
    let table = document.getElementById("invoiceTable");

    // Clear the table
    let hasErrors = false;

    // Loop through the products
    for (let i = 0; i < products.length; i++) {
        // Set the variables
        let item = products[i];
        let itemQuantity = order[i];

        // Validate the quantity
        let validationMessage = validateQuantity(itemQuantity);

        // If there is an error, add the error to the table
        if (validationMessage !== "") {
            hasErrors = true;
            let row = table.insertRow();
            row.insertCell(0).innerHTML = item.name;
            row.insertCell(1).innerHTML = validationMessage;
        }
        // Else if there is no error, add the item to the table
        else if (itemQuantity > 0) {
            // Update the variables
            extendedPrice = item.price * itemQuantity;
            subtotal += extendedPrice;

            // Add the item to the table
            let row = table.insertRow();
            row.insertCell(0).innerHTML = `<img src="${item.image}" class="img-small" name="img" data-tooltip="${item.description}">`;
            row.insertCell(1).innerHTML = item.name;
            row.insertCell(2).innerHTML = itemQuantity;
            row.insertCell(3).innerHTML = "$" + item.price.toFixed(2);
            row.insertCell(4).innerHTML = "$" + extendedPrice.toFixed(2);
        }
    }
}

// Get the URL parameters
let params = (new URL(document.location)).searchParams;

// On load, if there is no 'valid' key, redirect the user back to the Home page
window.onload = function () {
    if (!params.has('valid')) {
        document.write(`
            <head>
                <link rel="stylesheet" href="syle.css">
            </head>
            <body style="text-align: center; margin-top: 10%;">
                <h2>ERROR: No form submission detected.</h2>
                <h4>Return to <a href="homepage.html">Home</a></h4> 
            </body>
        `);
    } else {
        document.getElementById('helloMsg').innerHTML = `Thank you for your purchase ${params.get('name')}! Come back for more!`;
    }

    // Initialize variables
    let extendedPrice = 0;
    let subtotal = 0;
    let shipping = 0;
    let extendedPrices = [];
    let shippingDisplay = '';
    let total = 0;

            let qty = [];
        for (let i = 0; i < products.length; i++) {
            qty.push(Number(params.get(`qty${i}`)) || 0);
        }


        // Add these console.log statements for debugging
        console.log('Qty:', qty);

        for (let i = 0; i < qty.length; i++) {
            console.log('Processing item:', products[i].name);

            if (qty[i] === 0) continue;

            extendedPrice = (qty[i] * products[i].price).toFixed(2);

            document.querySelector('#invoiceTableBody').innerHTML += `
            <tr style="border: none;">
                <td width="10%"><img src="${products[i].image}" alt="${products[i].alt}" style="border-radius: 5px;" class="invoice-table-image"></td>
                <td class="invoice-table-item-name">${products[i].name}</td>
                <td>${qty[i]}</td>
                <td>${products[i].qty_available}</td>
                <td>$${products[i].price.toFixed(2)}</td>
                <td>$${extendedPrice}</td>
            </tr>
        `;
        
    }
    
console.log('Extended Prices:', extendedPrices);

    // Sales tax
    let taxRate = 0.047; // 4.7%
    let taxAmount = subtotal * taxRate;

    // Shipping
    if (subtotal < 300) {
        shipping = 20;
        shippingDisplay = `$${shipping.toFixed(2)}`;
        total = Number(taxAmount + subtotal + shipping);
    } else if (subtotal >= 300 && subtotal < 600) {
        shipping = 40;
        shippingDisplay = `$${shipping.toFixed(2)}`;
        total = Number(taxAmount + subtotal + shipping);
    } else {
        shipping = 0;
        shippingDisplay = 'FREE';
        total = Number(taxAmount + subtotal + shipping);
    }

    // Display the total in the HTML
    document.querySelector('#total_cell').innerHTML += `
        <tr style="border-top: 2px solid black;">
            <td colspan="5" style="text-align:center;">Sub-total</td>
            <td>$${subtotal.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="5" style="text-align:center;">Hawaii Sales Tax @ ${taxRate * 100}%</td>
            <td>$${taxAmount.toFixed(2)}</td>
        </tr>
        <tr>
            <td colspan="5" style="text-align:center;">Shipping</td>
            <td>${shippingDisplay}</td>
        </tr>
        <tr>
            <td colspan="5" style="text-align:center;"><b>Total</td>
            <td><b>$${total.toFixed(2)}</td>
        </tr>
    `;
};
