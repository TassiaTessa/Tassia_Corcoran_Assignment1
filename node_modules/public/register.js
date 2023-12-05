//register.js
let params = (new URL(document.location)).searchParams;

window.onload = function() {
    let register_form = document.forms ['register_form'];

    //Get values previously inputted and place back into input fields
    register_form.elements['name'].value = params.get('name');
    register_form.elements['email'].value = params.get('email').toLowerCase();

    //Get error messages and display them
    for (let i = 0; i <= document.getElementsByClassName('form-group').length; i++) {
        let inputName = register_form.elements[i].name;

        if (params.has(`${inputName}_length`)) {
            document.getElementById(`${inputName}_error`).innerHTML = params.get(`${inputName}_length`);

            if (params.has(`${inputName}_type`)) {
                document.getElementById(`${inputName}_error`).innerHTML += ` ${params.get(`${inputName}_length`)}`;
            }
        }
        else if (params.has(`${inputName}_type`)) {
            document.getElementById(`${inputName}_error`).innerHTML = params.get(`${inputName}_type`);
        }
    }
}



