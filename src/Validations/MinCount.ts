import {DataMap, Validator} from "../types";

export default
class MinCount implements Validator
{
    public readonly message="For {{field}}, select at least {{min_count}} options";
    constructor(public min_count:number)
    {

    }
    validate(field_name:string, data:DataMap):boolean
    {
        if(typeof(data[field_name]) == 'undefined')
        {
            //won't validate if field is not present
            return true;
        }
        if(! Array.isArray(data[field_name]) )
        {
            return true;
        }
        const arr = data[field_name] as string[]
        if(arr.length < this.min_count)
        {
            return false;
        }
        return true;
    }
}