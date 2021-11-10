import {DataMap, Validator} from "../types";

export default
class Required implements Validator
{
    public readonly message="{{field}} is required";

    validate(field_name:string, data:DataMap):boolean
    {
        if (data[field_name]) 
        {
            if (String(data[field_name]).length > 0) 
            {
                return true;
            }
        } 
        else if (data[field_name] === 0 || data[field_name] === false) 
        {
            return true;
        }
        return false;
    }
}