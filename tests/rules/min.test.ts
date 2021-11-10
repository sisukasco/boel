
import {validateByRules} from "../../src/validate-by-rules";

test("VDNMIN001: validate min using rules",()=>
{
    const fd = {height:100, weight:9}
    const fields = [
        {
            name: "weight",
            type: "number",
            validations:
            {
                min: { num:10 }
            }
        }
    ]
    const res = validateByRules(fields, fd)
    expect(res.has_errors).toEqual(true);
    console.log("validation results ", res)
    expect(res!.error_map!.weight!.message!.length).toBeGreaterThan(0);
    
});

test("VDNMIN002: validate min - exact number",()=>
{
    const fd = {height:100, weight:10}
    const fields = [
        {
            name: "weight",
            type: "number",
            validations:
            {
                min: { num:10 }
            }
        }
    ]
    const res = validateByRules(fields, fd)
    expect(res.has_errors).toEqual(false);
    
});

test("VDNMIN003: validate min - larger number",()=>
{
    const fd = {height:100, weight:11}
    const fields = [
        {
            name: "weight",
            type: "number",
            validations:
            {
                min: { num:10 }
            }
        }
    ]
    const res = validateByRules(fields, fd)
    expect(res.has_errors).toEqual(false);
    
});

test("VDNMIN004: validate min - Field not present",()=>
{
    const fields = [
        {
            name: "weight",
            type: "number",
            validations:
            {
                min: { num:10 }
            }
        }
    ]
    
    {
        const res = validateByRules(fields, {height:100})
        expect(res.has_errors).toEqual(false);        
    }
    
    {
        const res = validateByRules(fields, {})
        expect(res.has_errors).toEqual(false);        
    }

    
});

test("VDNMIN005: validate min - Field not present with required validation",()=>
{
    const fields = [
        {
            name: "weight",
            type: "number",
            validations:
            {
                min: { num:10 },
                required:{ enabled: true}
            }
        }
    ]
    
    {
        const res = validateByRules(fields, {height:100})
        expect(res.has_errors).toEqual(true);        
    }
    
    {
        const res = validateByRules(fields, {})
        expect(res.has_errors).toEqual(true);        
    }

    
});