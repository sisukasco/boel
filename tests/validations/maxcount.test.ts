import MaxCount from "../../src/Validations/MaxCount";
import {makeBoel} from "../../src/BoelProvider";
import {validateByRules} from "../../src/validate-by-rules";

describe("MaxCount", ()=>
{
    test("maxcount test simple case",()=>
    {
        const max_count = new MaxCount(2);
        expect(max_count.validate('options', {options:["opt1","opt2","opt3"]})).toBeFalsy();
        expect(max_count.validate('options', {options:["opt1"]})).toBeTruthy();
        expect(max_count.validate('options', {options:[]})).toBeTruthy();
    })
    test("maxcount integrated with boel",()=>
    {
        const b = makeBoel();
        const rules =[
            b.field("options").hasMaxSelections(1)
        ]
        const res = b.validate(rules,{options:["item 1", "item 2","item 3"]});
        expect(res.has_errors).toBeTruthy();
        res.error_map && expect(res.error_map.options.validation).toEqual('MaxCount');

        res.error_map && expect(res.error_map.options.message).not.toEqual('');
    });
    test("Maxcount validation - rules style",()=>
    {
        const fd = {colors:["green", "blue", "yellow", "red"], options:[]}
        const fields = [
            {
                name: "colors",
                type: "CheckboxGroup",
                validations:
                {
                    max_count: { num:3 }
                }
            }
        ]
        const res = validateByRules(fields, fd)
        expect(res.has_errors).toEqual(true);
        res.error_map && expect(res.error_map.colors.validation).toEqual('MaxCount');
        
        const fd2 = {colors:["green", "blue"], options:[]}
        const res2 = validateByRules(fields, fd2)
        expect(res2.has_errors).toEqual(false);
    });
    
})