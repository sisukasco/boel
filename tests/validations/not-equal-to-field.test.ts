import Comparison from "../../src/Validations/Comparison";
import {makeBoel} from "../../src/BoelProvider";
describe("NotEqualToField", ()=>
{
    test("not equalto field using number",()=>
    {
        let neq = new Comparison('!=', {test_field:'total'});

        expect(neq.validate('discount',{discount:100, total:100})).toEqual(false);
        expect(neq.validate('discount',{discount:99, total:100})).toEqual(true);
    })

    test("not equalto field using number",()=>
    {
        let neq = new Comparison('!=', {test_field:'name2'});

        expect(neq.validate('name1',{name1:'joel', name2:'joel'})).toEqual(false);
        expect(neq.validate('name1',{name1:'joel', name2:'boel'})).toEqual(true);
    })

    test("not equal to field using Boel",()=>
    {
        let b = makeBoel()
        let rules =[
            b.field("your_name").isNotEqualToField("spouse_name")
        ];

        {
            let res = b.validate(rules, {your_name:'some name',spouse_name:'some name'});
            expect(res.has_errors).toBeTruthy();
            res.error_map && expect(res.error_map.your_name.validation).toEqual('NotEqualTo');
        }
        {
            let res = b.validate(rules, {your_name:'some name',spouse_name:'good name'});
            expect(res.has_errors).toBeFalsy();            
        }

    });
})