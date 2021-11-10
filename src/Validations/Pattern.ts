import {DataMap, Validator} from "../types";

export default
class Pattern implements Validator
{
    public readonly message="{{field}} does not match the pattern";

    constructor(public regex:string)
    {

    }
    validate(field_name:string, data:DataMap):boolean
    {
        if(typeof(data[field_name]) == 'undefined')
        {
            //won't validate if field is not present
            return true;
        }
        const v = data[field_name];
        const rx = new RegExp(this.regex);
        return rx.test(v)
    }
}