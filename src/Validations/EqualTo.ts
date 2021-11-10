import {DataMap, Validator} from "../types";

export default 
class EqualTo implements Validator
{
    public readonly message="{{field}} should be equal to {{test_value}}";
    constructor(public test_value:string|number)
    {

    }
    validate(field_name:string, data:DataMap):boolean
    {
        return(data[field_name] === this.test_value ? true:false);
    }
}
