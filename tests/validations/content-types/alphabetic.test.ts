import {makeBoel} from "../../../src/BoelProvider";
import ContentType from "../../../src/Validations/ContentType";
import {validateByRules} from "../../../src/validate-by-rules";

describe("Alphabetic",()=>
{
    test("ALPHA101: alphabetic only",()=>
    {
        const a = new ContentType('alpha');

        expect(a.validate('name', {name:'ANameWithOnlyAlphabetic'})).toEqual(true);
        expect(a.validate('name', {name:'ANameWith Spaces Spaces'})).toEqual(false);
        
        expect(a.validate('name', {name:'ANameWithéä'})).toEqual(true);
        
        expect(a.validate('name', {name:'AName Withéä'})).toEqual(false);
        
        expect(a.validate('name', {name:'AName12Withéä'})).toEqual(false);
        
        expect(a.validate('name', {name:'A+NameWithéä'})).toEqual(false);
        
        expect(a.validate('name', {name:'日本語'})).toEqual(true);
        expect(a.validate('name', {name:'العربية'})).toEqual(true);
        
        expect(a.validate('name', {})).toEqual(true);
    });
    
    test("ALPHA102: alphabetic with spaces test",()=>
    {
        const a = new ContentType('alpha_s');

        expect(a.validate('name', {name:'ANameWithOnlyAlphabetic'})).toEqual(true);
        expect(a.validate('name', {name:'ANameWith Spaces Spaces'})).toEqual(true);
        expect(a.validate('name', {name:'ANameWithNumber1'})).toEqual(false);
        expect(a.validate('name', {name:'ANameWithChar!'})).toEqual(false);
        
        expect(a.validate('name', {name:'ANameWithéäáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄ'})).toEqual(true);
        
        expect(a.validate('name', {name:'AName With éäáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄ'})).toEqual(true);

        expect(a.validate('name', {name:'AName-Withéäáéíóúý'})).toEqual(false);
        
        expect(a.validate('name', {name:'日本語'})).toEqual(true);
        
        expect(a.validate('name', {name:'日本語123'})).toEqual(false);
        
        expect(a.validate('name', {name:'日本 語'})).toEqual(true);
        
        expect(a.validate('name', {})).toEqual(true);
    });
    
    
    test("ALPHA103: alphanumeric test",()=>
    {
        const a = new ContentType('alnum');

        expect(a.validate('name', {name:'ANameWithOnlyAlphabetic'})).toEqual(true);
        expect(a.validate('name', {name:'ANameWith num 1 Spaces Spaces'})).toEqual(false);
        expect(a.validate('name', {name:'ANameWithNumber1'})).toEqual(true);
        expect(a.validate('name', {name:'ANameWithChar!'})).toEqual(false);
        
        expect(a.validate('name', {name:'ANameWithéäáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄ109'})).toEqual(true);
        expect(a.validate('name', {name:'ANameWithéäáéíóúý9876543210'})).toEqual(true);
        expect(a.validate('name', {name:'ANameWithéäáéíóúý987654.3210'})).toEqual(false);

        expect(a.validate('name', {name:'AName123-Withéäáéíóúý'})).toEqual(false);
        expect(a.validate('name', {name:'AName123Withéäáéíóúý'})).toEqual(true);
        
        expect(a.validate('name', {name:'日本語'})).toEqual(true);
        
        expect(a.validate('name', {name:'日本語123'})).toEqual(true);
        
        expect(a.validate('name', {name:'日本 語123'})).toEqual(false);
        
        expect(a.validate('name', {})).toEqual(true);
    });

    test("ALPHA104: alphanumeric space test",()=>
    {
        const a = new ContentType('alnum_s');

        expect(a.validate('name', {name:'ANameWithOnlyAlphabetic'})).toEqual(true);
        expect(a.validate('name', {name:'ANameWith num 1 Spaces Spaces'})).toEqual(true);
        expect(a.validate('name', {name:'ANameWithNumber1'})).toEqual(true);
        expect(a.validate('name', {name:'ANameWithChar!'})).toEqual(false);
        
        expect(a.validate('name', {name:'ANameWithéäáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄ  109'})).toEqual(true);
        expect(a.validate('name', {name:'ANameWithéäáéíóúý  98765 43210'})).toEqual(true);
        expect(a.validate('name', {name:'ANameWithéäáéíóúý987654.3210'})).toEqual(false);

        expect(a.validate('name', {name:'AName123 - Withéäáéíóúý'})).toEqual(false);
        expect(a.validate('name', {name:'AName123Withéäáéíóúý'})).toEqual(true);
        expect(a.validate('name', {name:'AName123 With éäáéíóúý'})).toEqual(true);
        
        expect(a.validate('name', {name:'日本 語'})).toEqual(true);
        
        expect(a.validate('name', {name:'日本語 123'})).toEqual(true);
        
        expect(a.validate('name', {name:'日本-語123'})).toEqual(false);
        
        expect(a.validate('name', {})).toEqual(true);
    });

    

    test("Alphabetic Boel integration",()=>
    {
        const b = makeBoel();
        const res = b.validate([ b.field('name').isAlphabetic() ], {name:'NameWith11'});
        //console.log(" alphabetic test res", res);

        expect(res.has_errors).toBeTruthy();
        res.error_map && expect(res.error_map.name.validation).toEqual('Alphabetic');

        res.error_map && expect(res.error_map.name.message).not.toEqual('');
    })
    
    test("Alphabetic Rules style",()=>
    {
        const fd = {name:"A100", email:"some@website.com"}
        const fields = [
            {
                name: "name",
                type: "text",
                validations:
                {
                    content_type: { type:"alpha" }
                }
            }
        ]
        const res = validateByRules(fields, fd)
        expect(res.has_errors).toEqual(true);
        console.log("alnum rules - errors ", res);
        res.error_map && expect(res.error_map.name.validation).toEqual('Alphabetic');
        
        const fd2 = {name:"ABCDEFG", email:"some@website.com"}
        const res2 = validateByRules(fields, fd2)
        expect(res2.has_errors).toEqual(false);
        
        const fd2x1 = {}
        const res2x1 = validateByRules(fields, fd2x1)
        expect(res2x1.has_errors).toEqual(false);
        
        fields[0].validations.content_type.type = 'alpha_s'
        
        const fd3 = {name:"AB CD EF", email:"some@website.com"}
        const res3 = validateByRules(fields, fd3)
        expect(res3.has_errors).toEqual(false);        
    
    });

})