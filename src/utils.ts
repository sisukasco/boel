import {Validator} from "./types";

export
function getValidatorName(validator:Validator):string
{
    if(validator.name)
    {
        return validator.name;
    }
    else
    {
        return validator.constructor.name;
    }
}