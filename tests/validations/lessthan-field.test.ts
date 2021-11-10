import Comparison from "../../src/Validations/Comparison";
import {makeBoel} from "../../src/BoelProvider";

describe("LessThanField", ()=>
{
    test("less than field test",()=>
    {
        const lt = new Comparison('<',{test_field:'total_weight'});

        expect(lt.validate('weight', {weight:5, total_weight:15})).toBeTruthy();
        expect(lt.validate('weight', {weight:5, total_weight:5})).toBeFalsy();
    })

    test("less than field with Boel",()=>
    {
        const b = makeBoel();
        const rules =[
            b.field("unit").isLessThanField("total")
        ];

        {
            const res = b.validate(rules, {unit:100, total:50});
            //console.log("less than field results ", res);
            expect(res.has_errors).toBeTruthy();
        }

        {
            const res = b.validate(rules, {unit:10, total:50});
            //console.log("less than field results ", res);
            expect(res.has_errors).toBeFalsy();            
        }

    })
    test("less than or equal to field with Boel",()=>
    {
        const b = makeBoel();
        const rules =[
            b.field("unit").isLessThanOrEqualToField("total")
        ];

        {
            const res = b.validate(rules, {unit:100, total:50});
            //console.log("less than field results ", res);
            expect(res.has_errors).toBeTruthy();
        }

        {
            const res = b.validate(rules, {unit:50, total:50});
            //console.log("less than field results ", res);
            expect(res.has_errors).toBeFalsy();            
        }
    });

    test("multiple fields less than or equal to field with Boel",()=>
    {
        const b = makeBoel();
        const rules =[
            b.fields("unit","discount","tax").areLessThanOrEqualToField("total")
        ];

        {
            const res = b.validate(rules, {unit:100,discount:200,tax:30, total:50});
            //console.log("less than field results ", res);
            expect(res.has_errors).toBeTruthy();
        }

        {
            const res = b.validate(rules, {unit:50,discount:20,tax:30, total:50});
            //console.log("less than field results ", res);
            expect(res.has_errors).toBeFalsy();            
        }
    });
})