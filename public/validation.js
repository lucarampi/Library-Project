var get_ID = (x) => document.getElementById(x);
var get_TAG = (x) => document.getElementsByTagName(x);
var set_ID = (x) => document.getElementById(x);
var flag_name = false;
var flag_author = false;
var flag_qtd = false;
var flag_code = false;

$(document).ready(function () {
    console.log("ready")
    // OK
    var inputName = get_ID("name");
    var inputAuthor = get_ID("author");
    var inputQtd = get_ID("qtd");
    var inputCode = get_ID("code");
    var inputSynopsis = get_ID("synopsis");
    var form = get_TAG("form")
    console.log(inputName)
    inputName.addEventListener('blur', () => { 
        console.log("name BLUR")
        if (nameValidation(inputName)) {
            flag_name = true;
            return flag_name;
        }
        flag_name = false;
        return flag_name;
    });
    inputAuthor.addEventListener('blur', () => { 
        console.log("author BLUR")
        if (nameValidation(inputAuthor)) {
            flag_author = true;
            return flag_author;
        }
        flag_author = false;
        return flag_author;
    });

    inputQtd.addEventListener('blur', () => {
        console.log("qtd BLUR")
        if (numberValidation(inputQtd)) {
            flag_qtd = true;
            return flag_qtd;
        }
        flag_qtd = false;
        return flag_qtd;
    });
    inputCode.addEventListener('blur', () => {
        if (codeValidation(inputCode)) {
            flag_code = true;
            return flag_code;
        }
        flag_code = false;
        return flag_code;
    });
    function checkValidations(event){
        if (flag_author && flag_code && flag_name && flag_qtd) {
            return true
        }
        event.preventDefault();
        alert("Verifique os campos em vermelho!")
        return false;
    }
});

function nameValidation(element) {
    let temp = element
    temp.value = temp.value.replace(/[^a-zA-Z0-9 ]/g, '');
    if (temp.value == "" || !isNaN(temp.value)) {
        temp.style.backgroundColor = 'rgb(246, 195, 195)';
        temp.style.borderColor = 'red';
        return false;
    }
    temp.style.backgroundColor = 'white';
    temp.style.borderColor = 'green';
    return true;
}

const codeValidation = function (element) {
    let temp = element.value.replace(/[^a-zA-Z0-9 ]/g, '');
    if (Number(temp) <= 0) {
        element.style.backgroundColor = "rgb(246, 195, 195)";
        element.style.borderColor = 'red';
        return false;
    } else {
        element.value = temp;
        element.style.backgroundColor = "white"
        element.style.borderColor = 'green';
        return true;
    }
}

const numberValidation = function (element) {
    let temp = element.value.replace(/[^a-zA-Z0-9 ]/g, '');
    if (isNaN(Number(temp)) || Number(temp) <= 0 || temp.length > 10) {
        element.style.backgroundColor = "rgb(246, 195, 195)";
        element.style.borderColor = 'red';
        return false;
    } else {
        element.value = temp;
        element.style.backgroundColor = "white"
        element.style.borderColor = 'green';
        return true;
    }
}