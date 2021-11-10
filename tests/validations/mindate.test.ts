
import Comparison from "../../src/Validations/Comparison";
import {makeBoel} from "../../src/BoelProvider";
import {validateByRules} from "../../src/validate-by-rules";

describe("MinDate", ()=>
{
    test("MinDate Simple cases", ()=>{
        
        const mindate = new Comparison(">=", {test_value: new Date("2012-10-12")});
        
        expect(mindate.validate('start_date', {start_date:'2012-10-13'})).toBe(true);
        
        expect(mindate.validate('start_date', {start_date:'2012-10-11'})).toBe(false);
        
        expect(mindate.validate('start_date', {start_date:'2000-10-11'})).toBe(false);
        
        expect(mindate.validate('start_date', {start_date:'2012-10-12'})).toBe(true);        
        expect(mindate.validate('start_date', {start_date:'2013-10-12'})).toBe(true);
    })
    
    test("MinDate validation - integration with Boel",()=>
    {
        const b = makeBoel();
        const rules=[
            b.field('start_date').minDate("2020-12-31")
        ];
        
        {
            const res = b.validate(rules, {start_date:"2020-12-30", end_date:"2021-01-03"});
            expect(res.has_errors).toBeTruthy();
            res.error_map && expect(res.error_map.start_date.validation).toEqual('GreaterThanOrEqualTo');
        }
        
        {
            const res = b.validate(rules, {start_date:"2021-01-02", end_date:"2021-01-03"});
            expect(res.has_errors).toBe(false)
        }
    })
    
    test("MinDate validation - rules style",()=>
    {
        const fd = {start:"2020-11-11", end:"2020-11-18"}
        const fields = [
            {
                name: "start",
                type: "Date",
                validations:
                {
                    min_date: { date:"2020-11-13" }
                }
            }
        ]
        const res = validateByRules(fields, fd)
        expect(res.has_errors).toEqual(true);
        res.error_map && expect(res.error_map.start.validation).toEqual('GreaterThanOrEqualTo');
        
        const fd2 = {start:"2020-11-13", end:"2020-11-18"}
        const res2 = validateByRules(fields, fd2)
        expect(res2.has_errors).toEqual(false);
    });
})