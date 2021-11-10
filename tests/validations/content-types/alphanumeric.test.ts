import ContentType from "../../../src/Validations/ContentType";
import {makeBoel} from "../../../src/BoelProvider";
import {validateByRules} from "../../../src/validate-by-rules";

describe("AlphaNumeric",()=>
{
    test("ALNUM101: alphanumeric only - no spaces",()=>
    {
        const a = new ContentType("alnum");

        expect(a.validate('name', {name:'ANameWithOnlyAlphabetic'})).toEqual(true);
        expect(a.validate('name', {name:'ANameWithéäáéíóúý'})).toEqual(true);
        
        expect(a.validate('name', {name:'0123ANameWithéäáéíóúý'})).toEqual(true);
        
        expect(a.validate('name', {name:'0123 A NameWithéäáéíóúý'})).toEqual(false);
        
        expect(a.validate('name', {name:'0123.A.Name'})).toEqual(false);
        
        expect(a.validate('name', {name:'ANameWith11'})).toEqual(true);
        expect(a.validate('name', {name:'ANameWith 22 Spaces Spaces'})).toEqual(false);
    });
    
    test("ALNUM102: alphanumeric with spaces",()=>
    {
        const a = new ContentType("alnum_s");

        expect(a.validate('name', {name:'ANameWithOnlyAlphabetic'})).toEqual(true);
        expect(a.validate('name', {name:'ANameWith Spaces Spaces'})).toEqual(true);
        expect(a.validate('name', {name:'ANameWithNumber1'})).toEqual(true);
        expect(a.validate('name', {name:'11223344'})).toEqual(true);
        expect(a.validate('name', {name:'112 2 3344'})).toEqual(true);
        expect(a.validate('name', {name:'ANameWithChar!'})).toEqual(false);
        expect(a.validate('name', {name:'@!'})).toEqual(false);

        expect(a.validate('name', {name:'AName-Withéäáéíóúý'})).toEqual(false);
        
        expect(a.validate('name', {name:'A NameWithéäáéíóúý'})).toEqual(true);
        
        expect(a.validate('name', {name:'0123 A NameWithéäáéíóúý'})).toEqual(true);
        
        expect(a.validate('name', {name:'0123-A-Name'})).toEqual(false);
        expect(a.validate('name', {name:'0123_A_Name'})).toEqual(false);
    });

    

    test("AlphaNumeric Boel integration",()=>
    {
        const b = makeBoel();
        const res = b.validate([ b.field('name').isAlphaNumeric() ], {name:'NameWith11'});
        //console.log(" alphabetic test res", res);

        expect(res.has_errors).toBeFalsy();
       
        const res2 = b.validate([ b.field('name').isAlphaNumeric() ], {name:'Name#With11'});

        expect(res2.has_errors).toBeTruthy();

        res2.error_map && expect(res2.error_map.name.validation).toEqual('AlphaNumeric');
    })
    
    test("AlphaNumeric Rules style",()=>
    {
        const fd = {name:"A100  ", email:"some@website.com"}
        const fields = [
            {
                name: "name",
                type: "text",
                validations:
                {
                    content_type: { type:"alnum" }
                }
            }
        ]
        const res = validateByRules(fields, fd)
        expect(res.has_errors).toEqual(true);
        console.log("alnum rules - errors ", res);
        res.error_map && expect(res.error_map.name.validation).toEqual('AlphaNumeric');
        
        const fd2 = {name:"A100", email:"some@website.com"}
        const res2 = validateByRules(fields, fd2)
        expect(res2.has_errors).toEqual(false);
        
        const fd3 = {name:"1001232", email:"some@website.com"}
        const res3 = validateByRules(fields, fd3)
        expect(res3.has_errors).toEqual(false);        
    
    });
    
    

})