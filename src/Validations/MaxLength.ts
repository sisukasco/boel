import {DataMap, Validator} from "../types";

export default 
class MaxLength implements Validator
{
    public readonly message="{{field}} exceeded max length {{max_length}}";
    constructor(public max_length:number)
    {

    }
    validate(field_name:string, data:DataMap):boolean
    {
        if(typeof(data[field_name]) == 'undefined')
        {
            //won't validate if field is not present
            return true;
        }

        if(String(data[field_name]).length > this.max_length)
        {
            return false;
        }
        return true;
    }
}