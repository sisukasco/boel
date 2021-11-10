import ContentType from "../../../src/Validations/ContentType";
import {makeBoel} from "../../../src/BoelProvider";
import {validateByRules} from "../../../src/validate-by-rules";

describe("Phone", ()=>
{
    test("phone number validation",()=>
    {
        const ev= new ContentType("phone");

        expect(ev.validate('phone',{phone:"123456789"})).toEqual(true);
        expect(ev.validate('phone',{phone:"+91 9845121170"})).toEqual(true);
        expect(ev.validate('phone',{phone:"+44 (0) 1234 567890"})).toEqual(true);
        expect(ev.validate('phone',{phone:"111"})).toEqual(false);
        expect(ev.validate('phone',{phone:"my phone ate my dog"})).toEqual(false);
        expect(ev.validate('phone',{phone:"my"})).toEqual(false);
    })
    
    test("phone integration with Boel",()=>
    {
        const b = makeBoel();
        const rules=[
            b.field('phone').isPhoneNumber()
        ];

        {
            const res = b.validate(rules, {phone:'some'});
            //console.log(" Email validation result ", res);
            expect(res.has_errors).toBeTruthy();
            res.error_map && expect(res.error_map.phone.validation).toEqual('Phone');
        }

        {
            const res = b.validate(rules, {phone:'1234567890'});
            expect(res.has_errors).toBeFalsy();
        }
    })
    
    test("Phone Number validation - rules style",()=>
    {
        const fd = {work:"123", home:"123456789"}
        const fields = [
            {
                name: "work",
                type: "Tel",
                validations:
                {
                    content_type: { type:"phone" }
                }
            }
        ]
        const res = validateByRules(fields, fd)
        expect(res.has_errors).toEqual(true);
        res.error_map && expect(res.error_map.work.validation).toEqual('Phone');
        
        const fd2 = {work:"123456789", home:"123456789"}
        const res2 = validateByRules(fields, fd2)
        expect(res2.has_errors).toEqual(false);
    
    });
})