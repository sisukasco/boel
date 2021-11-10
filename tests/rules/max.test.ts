
import {validateByRules} from "../../src/validate-by-rules";

test("VDNMAX001: validate max using rules",()=>
{
    const fd = {height:100, weight:12}
    const fields = [
        {
            name: "weight",
            type: "number",
            validations:
            {
                max: { num:10 }
            }
        }
    ]
    const res = validateByRules(fields, fd)
    expect(res.has_errors).toEqual(true);
    console.log("validation results ", res)
    expect(res!.error_map!.weight!.message!.length).toBeGreaterThan(0);
    
});

test("VDNMAX002: validate max - exact number",()=>
{
    const fd = {height:100, weight:10}
    const fields = [
        {
            name: "weight",
            type: "number",
            validations:
            {
                max: { num:10 }
            }
        }
    ]
    const res = validateByRules(fields, fd)
    expect(res.has_errors).toEqual(false);
    
});

test("VDNMAX003: validate max - smaller number",()=>
{
    const fd = {height:100, weight:9}
    const fields = [
        {
            name: "weight",
            type: "number",
            validations:
            {
                max: { num:10 }
            }
        }
    ]
    const res = validateByRules(fields, fd)
    expect(res.has_errors).toEqual(false);
    
});

test("VDNMAX004: validate max when field absent",()=>
{
    const fd = {height:100}
    const fields = [
        {
            name: "weight",
            type: "number",
            validations:
            {
                max: { num:10 }
            }
        }
    ]
    const res = validateByRules(fields, fd)
    expect(res.has_errors).toEqual(false);
    console.log("validation results ", res)
    //expect(res!.error_map!.weight!.message!.length).toBeGreaterThan(0);
    
});