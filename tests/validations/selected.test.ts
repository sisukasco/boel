import Selected from "../../src/Validations/Selected";
import {makeBoel} from "../../src/index";
import {validateByRules} from "../../src/validate-by-rules";

describe("Selected",()=>
{
    test("triggers when not present",()=>
    {
        const s = new Selected();
        expect(s.validate('option',{name:'Someone'})).toBe(false);
        expect(s.validate('option',{})).toBe(false);
        expect(s.validate('option',{name:'Someone',option:''})).toBe(false);
        expect(s.validate('option',{name:'Someone',option:0})).toBe(false);
        expect(s.validate('option',{name:'Someone',option:true})).toBe(true);
    })

    test("selected integrated with boel",()=>
    {
        const b =  makeBoel();
        const rules = [
            b.field("agree").isSelected().message("Can't proceed since you didn't agree to the terms")
        ];

        {
            const res = b.validate(rules,{name:'John',agree:false});
            expect(res.has_errors).toBeTruthy();
            res.error_map && expect(res.error_map.agree.validation).toEqual('Selected');
        }

        {
            const res = b.validate(rules,{name:'John',agree:true});
            expect(res.has_errors).toBeFalsy();
        }        
    });
    
    test("MustCheck validation - rules style",()=>
    {
        const fd = {option1:"some value", another:"value"}
        const fields = [
            {
                name: "agree",
                type: "Checkbox",
                validations:
                {
                    must_check: { enabled:true }
                }
            }
        ]
        const res = validateByRules(fields, fd)
        expect(res.has_errors).toEqual(true);
        res.error_map && expect(res.error_map.agree.validation).toEqual('Selected');
        
        const fd2 = {agree:"yes", option1:"some value", another:"value"}
        const res2 = validateByRules(fields, fd2)
        expect(res2.has_errors).toEqual(false);
    });
})