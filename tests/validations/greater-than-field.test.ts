import Comparison from "../../src/Validations/Comparison";
import {makeBoel} from "../../src/BoelProvider";
describe("GreaterThanField",()=>{

    test("greater than field test",()=>
    {
        let gt = new Comparison('>', {test_field:'unit'});

        expect(gt.validate('total',{total:100, unit:10})).toBeTruthy();
        expect(gt.validate('total',{total:20, unit:100})).toBeFalsy();
    })
    test("greater than field with Boel",()=>
    {
        let b= makeBoel();
        let rules = [
            b.field('total_weight').greaterThanField('table_weight')
        ];

        {
            let res = b.validate(rules, {total_weight:10, table_weight:100});
            expect(res.has_errors).toBeTruthy();
            res.error_map && expect(res.error_map.total_weight.validation).toEqual('GreaterThan');
        }

        {
            let res = b.validate(rules, {total_weight:11, table_weight:10});
            expect(res.has_errors).toBeFalsy();
        }        

    })

    test("greater than or equal to field with Boel",()=>
    {
        let b= makeBoel();
        let rules = [
            b.field('total_weight').isGreaterThanOrEqualToField('table_weight')
        ];

        {
            let res = b.validate(rules, {total_weight:10, table_weight:100});
            expect(res.has_errors).toBeTruthy();
            res.error_map && expect(res.error_map.total_weight.validation).toEqual('GreaterThanOrEqualTo');
        }

        {
            let res = b.validate(rules, {total_weight:10, table_weight:10});
            expect(res.has_errors).toBeFalsy();
        }        

    })
})