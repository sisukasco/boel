import {DataMap, Validator} from "../types";

export default 
class MinLength implements Validator
{
    public readonly message="{{field}} input length should be at least {{min_length}}";

    constructor(public min_length:number)
    {

    }
    validate(field_name:string, data:DataMap):boolean
    {
        if(typeof(data[field_name]) == 'undefined')
        {
            //won't validate if field is not present
            return true;
        }
        if (String(data[field_name]).length < this.min_length) 
        {
            return false;
        }
        return true;
    }
}