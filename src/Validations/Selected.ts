import {DataMap, Validator} from "../types";

export default
class Selected implements Validator
{
    public readonly message="{{field}} should be selected";

    validate(field_name:string, data:DataMap):boolean
    {
        if (data[field_name]) 
        {
           return true;
        } 
        else
        {
            return false;
        }
        
    }
}