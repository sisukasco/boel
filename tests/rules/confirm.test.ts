import {validateByRules} from "../../src/validate-by-rules";

test("VDNCONFIRM001: validate confirm field using rules",()=>
{
    const fd = {email:'one@website.com', conf_email:'another@website.com'}
    const fields = [
        {
            name: "email",
            type: "email",
            validations:
            {
               confirm:{other:'conf_email'}
            }
        }
    ]
    const res = validateByRules(fields, fd)
    expect(res.has_errors).toEqual(true);
    console.log("validation results ", res)
    expect(res!.error_map!.email!.message!.length).toBeGreaterThan(0);
    
});

test("VDNCONFIRM002: validate confirm field truthy case",()=>
{
    const fd = {email:'one@website.com', conf_email:'one@website.com'}
    const fields = [
        {
            name: "email",
            type: "email",
            validations:
            {
               confirm:{other:'conf_email'}
            }
        }
    ]
    const res = validateByRules(fields, fd)
    expect(res.has_errors).toEqual(false);
    
});
