import Comparison from "../../src/Validations/Comparison";
import { makeBoel } from "../../src/BoelProvider";

describe("GreaterThanOrEqualTo", ()=>
{
    test("greater-than-equal-to test ",()=>
    {
        const gt = new Comparison('>=',{test_value:10});

        expect(gt.validate('weight', {weight:10})).toEqual(true);
        expect(gt.validate('weight', {weight:2})).toEqual(false);
        expect(gt.validate('weight', {weight:22})).toEqual(true);
        expect(gt.validate('weight', {weight:10.1})).toEqual(true);
        expect(gt.validate('weight', {weight:9.9})).toEqual(false);
        
    });
    test("greater-than-equal-to with signs",()=>
    {
        const gt = new Comparison('>=', {test_value:-1});

        expect(gt.validate('weight', {weight:-1})).toEqual(true);
        expect(gt.validate('weight', {weight:2})).toEqual(true);
        expect(gt.validate('weight', {weight:0})).toEqual(true);
        expect(gt.validate('weight', {weight:-2})).toEqual(false);

    });

    test("greater-than-equal-to integration with Boel", ()=>
    {
        const b = makeBoel();
        const rules = [
            b.field("connections").isGreaterThanOrEqualTo(5)
        ];

        {
            const res = b.validate(rules, {connections:0});
            //console.log(" Greater than validation ", res);
            expect(res.has_errors).toBeTruthy();
        }
        {
            const res = b.validate(rules, {connections:5});
            //console.log(" Greater than validation ", res);
            expect(res.has_errors).toBeFalsy();            
        }

    })

});