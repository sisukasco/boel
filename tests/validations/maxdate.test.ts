
import Comparison from "../../src/Validations/Comparison";
import {makeBoel} from "../../src/BoelProvider";
import {validateByRules} from "../../src/validate-by-rules";

describe("MaxDate", ()=>
{
    test("MaxDate Simple cases", ()=>{
        
        const maxdate = new Comparison("<=", {test_value: new Date("2012-10-12")});
        
        expect(maxdate.validate('start_date', {start_date:'2012-10-13'})).toBe(false);
        
        expect(maxdate.validate('start_date', {start_date:'2012-10-11'})).toBe(true);
        
        expect(maxdate.validate('start_date', {start_date:'2012-10-12'})).toBe(true);        
        expect(maxdate.validate('start_date', {start_date:'2013-10-12'})).toBe(false);
    })
    
    test("MaxDate validation - integration with Boel",()=>
    {
        const b = makeBoel();
        const rules=[
            b.field('start_date').maxDate("2020-12-31")
        ];
        
        {
            const res = b.validate(rules, {start_date:"2021-01-01", end_date:"2021-01-03"});
            expect(res.has_errors).toBeTruthy();
            res.error_map && expect(res.error_map.start_date.validation).toEqual('LessThanOrEqualTo');
        }
        
        {
            const res = b.validate(rules, {start_date:"2020-12-29", end_date:"2021-01-03"});
            expect(res.has_errors).toBe(false)
        }
    })
    
    test("Maxdate validation - rules style",()=>
    {
        const fd = {start:"2020-11-14", end:"2020-11-18"}
        const fields = [
            {
                name: "start",
                type: "Date",
                validations:
                {
                    max_date: { date:"2020-11-13" }
                }
            }
        ]
        const res = validateByRules(fields, fd)
        expect(res.has_errors).toEqual(true);
        res.error_map && expect(res.error_map.start.validation).toEqual('LessThanOrEqualTo');
        
        const fd2 = {start:"2020-11-13", end:"2020-11-18"}
        const res2 = validateByRules(fields, fd2)
        expect(res2.has_errors).toEqual(false);
    });
})