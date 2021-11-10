import ContentType from "../../../src/Validations/ContentType";
import {makeBoel} from "../../../src/BoelProvider";
import {validateByRules} from "../../../src/validate-by-rules";

describe("Email",()=>
{
    test("email address validation",()=>
    {
        const ev= new ContentType("email");

        expect(ev.validate('email',{email:"some.one@gmail.com"})).toEqual(true);
        expect(ev.validate('email',{email:"someone"})).toEqual(false);
        expect(ev.validate('email',{email:"some.one"})).toEqual(false);
        expect(ev.validate('email',{email:"some.one@"})).toEqual(false);
        expect(ev.validate('email',{email:"some.one@server@place.com"})).toEqual(false);

        expect(ev.validate('email',{email:"some.one@website.travel.guru"})).toEqual(true);

        expect(ev.validate('email',{email:"some.one@website.travel"})).toEqual(true);

        expect(ev.validate('email',{email:"person_x@f.guide"})).toEqual(true);
    })

    test("Email integration with Boel",()=>
    {
        const b = makeBoel();
        const rules=[
            b.field('email').isEmail()
        ];

        {
            const res = b.validate(rules, {email:'some'});
            //console.log(" Email validation result ", res);
            expect(res.has_errors).toBeTruthy();
            res.error_map && expect(res.error_map.email.validation).toEqual('Email');
        }

        {
            const res = b.validate(rules, {email:'some@website.com'});
            expect(res.has_errors).toBeFalsy();
        }

    })
    
    test("Email Rules style",()=>
    {
        const fd = {name:"A100", email:"@website.com"}
        const fields = [
            {
                name: "email",
                type: "Email",
                validations:
                {
                    content_type: { type:"email" }
                }
            }
        ]
        const res = validateByRules(fields, fd)
        expect(res.has_errors).toEqual(true);
        res.error_map && expect(res.error_map.email.validation).toEqual('Email');
        
        const fd2 = {name:"A100", email:"some@website.com"}
        const res2 = validateByRules(fields, fd2)
        expect(res2.has_errors).toEqual(false);
        
        const fd3 = {name:"1001232", email:"another.some@website.yy.com"}
        const res3 = validateByRules(fields, fd3)
        expect(res3.has_errors).toEqual(false);        
    
    });
})