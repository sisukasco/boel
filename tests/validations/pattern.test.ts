import Pattern from "../../src/Validations/Pattern";
import {makeBoel} from "../../src/BoelProvider";
import {validateByRules} from "../../src/validate-by-rules";

describe("Pattern",()=>
{
    test("pattern simple validations",()=>
    {
        const s = new Pattern("^[0-9]{4}$");
        expect(s.validate('code',{code:'SomeValue'})).toBe(false);
        expect(s.validate('code',{})).toBe(true);
        expect(s.validate('code',{code:'1234',option:''})).toBe(true);
        expect(s.validate('code',{code:'0123',option:''})).toBe(true);
        expect(s.validate('code',{code:'0123 ',option:''})).toBe(false);
    })
    
    test("pattern validation to using Boel",()=>
    {
        const b = makeBoel();
        const rules=[
        b.field('code').matchesPattern("^[a-z]{6}$")
        ]
        {
            const res = b.validate(rules, {code:'00'});
            expect(res.has_errors).toBeTruthy();
            res.error_map && expect(res.error_map.code.validation).toEqual('Pattern');
        }
        {
            const res = b.validate(rules, {code:'abcdef'});
            expect(res.has_errors).toBeFalsy();
        }
    })

    test("Pattern validation - rules style",()=>
    {
        const fd = {code:"some1234", another:"value"}
        const fields = [
            {
                name: "code",
                type: "Textbox",
                validations:
                {
                    pattern: { regexp:"^[a-z]{4}$" }
                }
            }
        ]
        const res = validateByRules(fields, fd)
        expect(res.has_errors).toEqual(true);
        res.error_map && expect(res.error_map.code.validation).toEqual('Pattern');
        
        const fd2 = {code:"some", option1:"some value", another:"value"}
        const res2 = validateByRules(fields, fd2)
        expect(res2.has_errors).toEqual(false);
    });
    
})