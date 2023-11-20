//importing Express.js framework
const express = require('express');
const app = express();
//figuring out where in the code universe we are
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));


let products = require(path.join(__dirname, '/products.json'));
products.forEach((product) => {
    product.total_sold = 0;
});

// Defining a route to share the products.js file
app.get("/products.js", function (request, response) {
    response.type('.js');
    // Stringifying the products data to make it travel-friendly
    let productsStr = `var products = ${JSON.stringify(products)};`;
    response.send(productsStr);
});

// Handling the secret messages (form submissions), 
app.post("/process_form", function (request, response) {
    // Extracting quantities
    let qtys = request.body['quantity_textbox'];

    // Validating and processing quantities, gotta make sure everything's actually working (please god work)
    let valid = true;
    let url = '';
    let soldArray = [];

    for (let i in qtys) {
        let q = Number(qtys[i]);

        // Calling in the quantity validation
        if (validateQuantity(q) === '') {
            // Checking if we have enough
            if (products[i]['qty_available'] - q < 0) {
                valid = false;
                url += `&prod${i}=${q}`;
            } else {
                // If all good, adding to the sold array
                soldArray[i] = q;
                url += `&prod${i}=${q}`;
            }
        } else {
            // If something's fishy with the quantity, setting the alarm bells ringing
            valid = false;
            url += `&prod${i}=${q}`;
        }

        // If there's no quantity at all, raising the red flag
        if (url === `&prod0=0&prod1=0&prod2=0&prod3=0&prod4=0&prod5=0`) {
            valid = false;
        }
    }

    // Redirecting based on whether the mission was successful or not
    if (!valid) {
        // Sending out the distress signal, something went wrong
        response.redirect(`products_display.html?error=true${url}`);
    } else {
        // If all good, updating the product data and sending out the victory signal
        for (let i in qtys) {
            products[i]['total_sold'] += soldArray[i];
            products[i]['qty_available'] -= soldArray[i];
        }
        response.redirect('invoice.html?' + url);
    }
});

// Serving static files, it's like giving out party invitations to everyone on the block
app.use(express.static(path.join(__dirname, '/public')));

// Handling all other mysterious GET requests, like the app bouncer
app.all('*', function (request, response, next) {
    // Keeping an eye on the requests, just in case something interesting comes up
    // console.log(request.method + ' to ' + request.path);
    next();
});

// Starting the server and tuning into port 8080 (808 cheeee)
app.listen(8080, () => console.log('Listening on port 8080'));

// The function to validate the quantity, making sure everything is in order
function validateQuantity(quantity) {
    if (isNaN(quantity)) {
        return "Not a Number";
    } else if (quantity < 0 && !Number.isInteger(quantity)) {
        return "Negative Inventory & Not an Integer";
    } else if (quantity < 0) {
        return "Negative Inventory";
    } else if (!Number.isInteger(quantity)) {
        return "Not an Integer";
    } else {
        return "";
    }
}
