import ContentType from "../../../src/Validations/ContentType";
import {makeBoel} from "../../../src/BoelProvider";
import {validateByRules} from "../../../src/validate-by-rules";

describe("Date",()=>
{
    test("Date (ISO 8601) validation",()=>
    {
        const ev= new ContentType("date");

        expect(ev.validate('bday',{bday:"2020-02-28"})).toEqual(true);
        expect(ev.validate('bday',{bday:"1999-08-09"})).toEqual(true);
        expect(ev.validate('bday',{bday:"2021-13-09"})).toEqual(false);
        expect(ev.validate('bday',{bday:"2021-02-29"})).toEqual(false);
        expect(ev.validate('bday',{bday:"1000-02-29"})).toEqual(false);
        expect(ev.validate('bday',{bday:"2020/12/31"})).toEqual(false);
    })
    
    test("date validation - integration with Boel",()=>
    {
        const b = makeBoel();
        const rules=[
            b.field('bday').isDate()
        ];

        {
            const res = b.validate(rules, {bday:'12/10/1999'});
            //console.log(" Email validation result ", res);
            expect(res.has_errors).toBeTruthy();
            res.error_map && expect(res.error_map.bday.validation).toEqual('Date');
        }

        {
            const res = b.validate(rules, {bday:'1999-10-12'});
            expect(res.has_errors).toBeFalsy();
        }

    })
    
    test("Date Validation - Rules style",()=>
    {
        const fd = {start_date:"2020-04-31", end_date:"2020-05-06"}
        const fields = [
            {
                name: "start_date",
                type: "date",
                validations:
                {
                    content_type: { type:"date" }
                }
            }
        ]
        const res = validateByRules(fields, fd)
        expect(res.has_errors).toEqual(true);
        res.error_map && expect(res.error_map.start_date.validation).toEqual('Date');
        
        const fd2 = {start_date:"2020-04-30", end_date:"2020-05-06"}
        const res2 = validateByRules(fields, fd2)
        expect(res2.has_errors).toEqual(false);
    
    });
})