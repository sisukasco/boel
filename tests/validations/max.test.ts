import {makeBoel} from "../../src/BoelProvider";

describe("Max", ()=>
{
    test("MAXV101: Max integration with Boel",()=>
    {
        const b = makeBoel();
        const rules =[
            b.field('score').isMax(100)
        ];
        {
            const res = b.validate(rules, {score: 101});
            expect(res.has_errors).toBeTruthy();
            res.error_map && expect(res.error_map.score.validation).toEqual('LessThanOrEqualTo');
        }
        {
            const res = b.validate(rules, {score: 100});
            expect(res.has_errors).toBeFalsy();          
        }
        {
            const res = b.validate(rules, {something: 100});
            expect(res.has_errors).toBeFalsy(); 
        }
        {
            const res = b.validate(rules, {});
            expect(res.has_errors).toBeFalsy(); 
        }

    }) 
});