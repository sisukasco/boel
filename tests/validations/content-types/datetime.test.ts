import ContentType from "../../../src/Validations/ContentType";
import {makeBoel} from "../../../src/BoelProvider";
import {validateByRules} from "../../../src/validate-by-rules";


describe("DateTime",()=>
{
    test("DateTime (ISO 8601) validation",()=>
    {
        const ev= new ContentType("datetime");
        expect(ev.validate('start',{start:"2020-07-30T15:03:36"})).toEqual(true);
        expect(ev.validate('start',{start:"2019-07-09T15:03:36Z"})).toEqual(true);
        expect(ev.validate('start',{start:"2019-09-07T15:50+05:30"})).toEqual(true);
        expect(ev.validate('start',{start:"2021-10-08T23:50+05:30"})).toEqual(true);
        expect(ev.validate('start',{start:"2021-11-22"})).toEqual(false);
    })
    
    test("datetime validation - integration with Boel",()=>
    {
        const b = makeBoel();
        const rules=[
            b.field('start').isDateTime()
        ];

        {
            const res = b.validate(rules, {start:'12-10-1999'});
            expect(res.has_errors).toBeTruthy();
            res.error_map && expect(res.error_map.start.validation).toEqual('DateTime');
        }

        {
            const res = b.validate(rules, {start:'1999-10-12T08:30'});
            expect(res.has_errors).toBeFalsy();
        }    
    })    
    
    test("DateTime Validation - Rules style",()=>
    {
        const fd = {start_date:"2020-04-31", end_date:"2020-04-31T16:30Z"}
        const fields = [
            {
                name: "start_date",
                type: "datetime",
                validations:
                {
                    content_type: { type:"datetime" }
                }
            }
        ]
        const res = validateByRules(fields, fd)
        expect(res.has_errors).toEqual(true);
        res.error_map && expect(res.error_map.start_date.validation).toEqual('DateTime');
        
        const fd2 = {start_date:"2020-04-30T12:30:00Z", end_date:"2020-04-30T16:30Z"}
        const res2 = validateByRules(fields, fd2)
        expect(res2.has_errors).toEqual(false);
    
    });
})