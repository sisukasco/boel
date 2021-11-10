import {makeBoel} from "../../src/index";
import {validateByRules} from "../../src/validate-by-rules";

describe("ShouldSelect",()=>
{
    test("ShouldSelect integrated with boel",()=>
    {
        const b =  makeBoel();
        const rules = [
            b.field("color").shouldSelect("green")
        ];

        {
            const res = b.validate(rules,{color:'red',agree:true});
            expect(res.has_errors).toBeTruthy();
            res.error_map && expect(res.error_map.color.validation).toEqual('EqualTo');
        }

        {
            const res = b.validate(rules,{color:'green',agree:true});
            expect(res.has_errors).toBeFalsy();
        }        
    });
    
    test("ShouldSelect validation - rules style",()=>
    {
        const fd = {agree:"no", another:"value"}
        const fields = [
            {
                name: "agree",
                type: "RadioGroup",
                validations:
                {
                    should_select: { item:"yes" }
                }
            }
        ]
        const res = validateByRules(fields, fd)
        expect(res.has_errors).toEqual(true);
        res.error_map && expect(res.error_map.agree.validation).toEqual('EqualTo');
        
        const fd2 = {agree:"yes", option1:"some value", another:"value"}
        const res2 = validateByRules(fields, fd2)
        expect(res2.has_errors).toEqual(false);
    });
})