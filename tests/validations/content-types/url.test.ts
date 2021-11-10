import ContentType from "../../../src/Validations/ContentType";
import {makeBoel} from "../../../src/BoelProvider";
import {validateByRules} from "../../../src/validate-by-rules";

describe("URL",()=>
{
    test("URL address validation",()=>
    {
        const ev= new ContentType("url");

        expect(ev.validate('website',{website:"//simfatic.com"})).toEqual(true);
        expect(ev.validate('website',{website:"http://simfatic.com"})).toEqual(true);
        expect(ev.validate('website',{website:"https://simfatic.com"})).toEqual(true);
        expect(ev.validate('website',{website:"real://simfatic.com"})).toEqual(false);
        expect(ev.validate('website',{website:"ftp://simfatic.com"})).toEqual(true);
        expect(ev.validate('website',{website:"http://abc.cde.simfatic.com"})).toEqual(true);
        expect(ev.validate('website',{website:"http://simfatic.in/page/here.yaml"})).toEqual(true);
        expect(ev.validate('website',{website:"http://simfatic.in/page/here.yaml.html"})).toEqual(true);
        expect(ev.validate('website',{website:"simplestring"})).toEqual(false);
    })
    
    test("URL integration with Boel",()=>
    {
        const b = makeBoel();
        const rules=[
            b.field('website').isURL()
        ];

        {
            const res = b.validate(rules, {website:'somelink'});
            expect(res.has_errors).toBeTruthy();
            res.error_map && expect(res.error_map.website.validation).toEqual('URL');
        }

        {
            const res = b.validate(rules, {website:'//www.simfatic.com'});
            expect(res.has_errors).toBeFalsy();
        }

    })
    
    test("URL validation - rules style",()=>
    {
        const fd = {profile:"somelink", github:"http://github.io/site"}
        const fields = [
            {
                name: "profile",
                type: "URL",
                validations:
                {
                    content_type: { type:"url" }
                }
            }
        ]
        const res = validateByRules(fields, fd)
        expect(res.has_errors).toEqual(true);
        res.error_map && expect(res.error_map.profile.validation).toEqual('URL');
        
        const fd2 = {profile:"http://github.io/prasanthmj", github:"http://github.io/site"}
        const res2 = validateByRules(fields, fd2)
        expect(res2.has_errors).toEqual(false);
    
    });
    
})