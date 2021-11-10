import Comparison from "../../src/Validations/Comparison";
import {makeBoel} from "../../src/BoelProvider";

describe("EqualTo", ()=>
{
    test("equal to test using number",()=>
    {
        const eq = new Comparison('=', {test_value:100});
        expect(eq.validate('calculated',{calculated:100})).toEqual(true);
        expect(eq.validate('calculated',{calculated:10})).toEqual(false);
        expect(eq.validate('calculated',{calculated:100.00})).toEqual(true);
        
        //The validation is not done if value is not present
        expect(eq.validate('calculated',{})).toEqual(true);
    })

    test("equal to using string", ()=>
    {
        const eq = new Comparison('=', {test_value:"a random string"});

        expect(eq.validate('pwd', {pwd:"a random string"})).toEqual(true);
        expect(eq.validate('pwd', {pwd:"another"})).toEqual(false);
    })

    test("equal-to integrated with Boel",()=>
    {
        const b = makeBoel();
        const rules =[
            b.field("confirm").equalsTo("yes")
        ];

        {
            const res = b.validate(rules,{confirm:'no'});
            expect(res.has_errors).toBeTruthy();
            res.error_map && expect(res.error_map.confirm.validation).toEqual('EqualTo');
        }

        {
            const res = b.validate(rules,{confirm:'yes'});
            expect(res.has_errors).toBeFalsy();
        }

    })
})