import MinCount from "../../src/Validations/MinCount";
import {makeBoel} from "../../src/BoelProvider";
import {validateByRules} from "../../src/validate-by-rules";

describe("MinCount",()=>
{
    test("Min count simple test",()=>
    {
        const min_count = new MinCount(3);

        expect(min_count.validate('options',{options:['Option 1','Option 2']})).toBeFalsy();
        expect(min_count.validate('options',
        {options:['Option 1','Option 2','Opt 3']})).toBeTruthy();
        
        expect(min_count.validate('options', {options:['Option 1','Option 2','']})).toBeTruthy();
        
        expect(min_count.validate('options',{options:['Option 1']})).toBeFalsy();

        expect(min_count.validate('options',{options:[]})).toBeFalsy();
    })

    test("MinCount integrated with boel",()=>
    {
        const b= makeBoel();
        const rules =[
            b.field("options").hasMinSelections(2)
        ];
        const res = b.validate(rules,{options:["item 1"]});
        expect(res.has_errors).toBeTruthy();
        res.error_map && expect(res.error_map.options.validation).toEqual('MinCount');

        res.error_map && expect(res.error_map.options.message).not.toEqual('');
    });
    
    test("MinCount validation - rules style",()=>
    {
        const fd = {colors:["green"], options:[]}
        const fields = [
            {
                name: "colors",
                type: "CheckboxGroup",
                validations:
                {
                    min_count: { num:2 }
                }
            }
        ]
        const res = validateByRules(fields, fd)
        expect(res.has_errors).toEqual(true);
        res.error_map && expect(res.error_map.colors.validation).toEqual('MinCount');
        
        const fd2 = {colors:["green", "blue"], options:[]}
        const res2 = validateByRules(fields, fd2)
        expect(res2.has_errors).toEqual(false);
    });
})