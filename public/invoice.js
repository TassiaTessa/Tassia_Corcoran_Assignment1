//Invoice JS


//global variables
let extendedPrices = [];
let extendedPrice = 0;
let subtotal = 0;
let taxAmount = 0;
let shipping = 0;

//gets the order from the url
let params = (new URL(document.location)).searchParams;
        //initializes empty order array
        let order = [];
        //for each prod, push the value to the array
        params.forEach((value,key) => {
            if (key.startsWith('prod')) {
                    order.push(parseInt(value));
                }
        });

        
//generate all the item rows
generateItemRows();

//calculate tax
 let tax = (subtotal*0.04);

//calculate shipping
if(subtotal <= 300)
{
    shipping = 20;
}else if(subtotal <=600)
{
    shipping = 40;
}
else{
    shipping = subtotal*.04;
}

//calculates total
let total = tax+subtotal+shipping;


//set the values
document.getElementById("subtotal_cell").innerHTML = "$" + subtotal.toFixed(2);
document.getElementById("tax_cell").innerHTML = "$" + tax.toFixed(2);
document.getElementById("shipping_cell").innerHTML = "$"+shipping.toFixed(2);
document.getElementById("total_cell").innerHTML = "$"+total.toFixed(2);


//function to validate the quantity, returns a string if not a number, negative, not an integer, or a combination of both
function validateQuantity(quantity){
    if(isNaN(quantity)){
        return "Please Enter a Number";
    }else if (quantity<0 && !Number.isInteger(quantity)){
        return "Please Enter a Positive Integer";
    }else if (quantity <0){
        return "Please Enter a Positive Number";
    }else if(!Number.isInteger(quantity)){
        return "Please Enter an Integer";
    }else{
        return"";
    }

}
//function to generate the item rows
function generateItemRows(){

    //get the table
    let table = document.getElementById("invoiceTable");

    //clear the table
    let hasErrors = false; 

    //loop through the products
    for(let i=0;i<products.length;i++){
        
        //set the variables
        let item = products[i];
        let itemQuantity = order[i];
        
        //validate the quantity
        let validationMessage = validateQuantity(itemQuantity);
        
        
        //if there is an error, add the error to the table
        if(validationMessage !== ""){
            hasErrors = true;
            let row =table.insertRow();
            row.insertCell(0).insertHTML = item.name;
            row.insertCell(1).innerHTML = validationMessage;
        } 
        //else if there is no error, add the item to the table
        else if(itemQuantity >0){
            //update the variables
            extendedPrice = item.price * itemQuantity;
            subtotal += extendedPrice;

            //add the item to the table
            let row = table.insertRow();
            row.insertCell(0).innerHTML = `<img src="${item.image}" class="img-small" name = "img" data-tooltip="${item.description}">`;
            row.insertCell(1).innerHTML = item.name;
            row.insertCell(2).innerHTML = itemQuantity;
            row.insertCell(3).innerHTML = "$" + item.price.toFixed(2);
            row.insertCell(4).innerHTML = "$"+extendedPrice.toFixed(2);

        }

    }

}