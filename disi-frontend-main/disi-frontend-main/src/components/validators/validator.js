const minLengthValidator = (value, minLength) => {
    return value.length >= minLength;
};

const requiredValidator = value => {
    return value.trim() !== '';
};

const emailValidator = value => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(value).toLowerCase());
};

const dateValidator = value => {
    const re = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    return re.test(String(value));
}
const phoneValidator = value =>{
    const re = /^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/;
    return re.test(String(value).toLowerCase());
}
const digitValidator = value =>{
    const re = /[0-9]/;
    return re.test(String(value).toLowerCase());
}

const validate = (value, rules) => {
    let isValid = true;

    for (let rule in rules) {

        switch (rule) {
            case 'minLength': isValid = isValid && minLengthValidator(value, rules[rule]);
                break;

            case 'isRequired': isValid = isValid && requiredValidator(value);
                break;

            case 'emailValidator': isValid = isValid && emailValidator(value);
                break;

            case 'dateValidator': isValid = isValid && dateValidator(value);
                break;

            case 'phoneValidator': isValid = isValid && phoneValidator(value);
                break;

            case 'digitValidator': isValid = isValid && digitValidator(value);
                break;

            default: isValid = true;
        }

    }

    return isValid;
};

export default validate;