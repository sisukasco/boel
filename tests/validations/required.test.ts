import Required from "../../src/Validations/required";
import {DataMap} from "../../src/types";

function check_required(field_name:string, data:DataMap):Boolean
{
 let req = new Required()
 return req.validate(field_name,data );
}

describe("RequiredValidation",()=>
{
    test("required when not present", ()=>
    {
        expect( check_required("name", {}) ).toEqual(false);
        expect( check_required("name", {name:""}) ).toEqual(false);
        expect( check_required("name", {name:undefined}) ).toEqual(false);
        expect( check_required("name", {name:null}) ).toEqual(false);
    })

    test("required when available", ()=>
    {
        expect( check_required("name", {name:'sam'}) ).toEqual(true);
        expect( check_required("weight", {weight:10}) ).toEqual(true);
        //special cases: if value is set, it is validated (0 or false)
        expect( check_required("agree", {agree:false}) ).toEqual(true);
        expect( check_required("a_number", {a_number:0}) ).toEqual(true);
    })

    
});