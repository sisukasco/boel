import ContentType from "../../../src/Validations/ContentType";
import {makeBoel} from "../../../src/BoelProvider";
import {validateByRules} from "../../../src/validate-by-rules";

describe("Number", ()=>
{
    test("NUMVAL1: number validation",()=>
    {
        const ev= new ContentType("number");

        expect(ev.validate('height',{height:"+12345"})).toEqual(true);
        expect(ev.validate('height',{height:"+123.45"})).toEqual(true);
        expect(ev.validate('height',{height:"-123.45"})).toEqual(true);
        expect(ev.validate('height',{height:"--123.45"})).toEqual(false);
        expect(ev.validate('height',{height:"some12345"})).toEqual(false);
        expect(ev.validate('height',{height:"12345ss"})).toEqual(false);
        
        expect(ev.validate('height',{height:"12345.45.66"})).toEqual(false);
        
        expect(ev.validate('height',{height:"12345617.88"})).toEqual(true);
        
        //alternate decimal point symbol
        expect(ev.validate('height',{height:"12345617,88"})).toEqual(true);
    })
    
    test("Number validation integration with Boel",()=>
    {
        const b = makeBoel();
        const rules=[
            b.field('weight').isNumber()
        ];

        {
            const res = b.validate(rules, {weight:'some'});
            //console.log(" Email validation result ", res);
            expect(res.has_errors).toBeTruthy();
            res.error_map && expect(res.error_map.weight.validation).toEqual('Number');
        }

        {
            const res = b.validate(rules, {weight:'11.22'});
            expect(res.has_errors).toBeFalsy();
        }
    })
    
    test("Number validation - rules style",()=>
    {
        const fd = {weight:"k100", height:"10.1"}
        const fields = [
            {
                name: "weight",
                type: "Number",
                validations:
                {
                    content_type: { type:"number" }
                }
            }
        ]
        const res = validateByRules(fields, fd)
        expect(res.has_errors).toEqual(true);
        res.error_map && expect(res.error_map.weight.validation).toEqual('Number');
        
        const fd2 = {weight:"100", height:"10.1"}
        const res2 = validateByRules(fields, fd2)
        expect(res2.has_errors).toEqual(false);
        
        const fd3 = {weight:"-100", height:"10.1"}
        const res3 = validateByRules(fields, fd3)
        expect(res3.has_errors).toEqual(false);        
    
    });
})