import Comparison from "../../src/Validations/Comparison";
import { makeBoel } from "../../src/BoelProvider";

describe("GreaterThan", ()=>
{
    test("greater-than test ",()=>
    {
        let gt = new Comparison('>', {test_value:10});

        expect(gt.validate('weight', {weight:2})).toEqual(false);
        expect(gt.validate('weight', {weight:22})).toEqual(true);
        expect(gt.validate('weight', {weight:10.1})).toEqual(true);
        expect(gt.validate('weight', {weight:9.9})).toEqual(false);
        expect(gt.validate('weight', {weight:10})).toEqual(false);
    });
    test("greater than with signs",()=>
    {
        let gt = new Comparison('>', {test_value:-1});

        expect(gt.validate('weight', {weight:2})).toEqual(true);
        expect(gt.validate('weight', {weight:0})).toEqual(true);
        expect(gt.validate('weight', {weight:-2})).toEqual(false);

    })
    test("greater than integration with Boel", ()=>
    {
        let b = makeBoel();
        let rules = [
            b.field("connections").greaterThan(5)
        ];

        {
            let res = b.validate(rules, {connections:0});
            //console.log(" Greater than validation ", res);
            expect(res.has_errors).toBeTruthy();
        }
        {
            let res = b.validate(rules, {connections:6});
            //console.log(" Greater than validation ", res);
            expect(res.has_errors).toBeFalsy();            
        }

    })

});