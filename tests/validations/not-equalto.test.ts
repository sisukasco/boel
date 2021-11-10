import Comparison from "../../src/Validations/Comparison";
import {makeBoel} from "../../src/BoelProvider";
describe("NotEqualTo", ()=>
{
    test("not equal to test using number",()=>
    {
        let neq = new Comparison('!=', {test_value:100});

        expect(neq.validate('calculated',{calculated:100})).toEqual(false);
        expect(neq.validate('calculated',{calculated:100.1})).toEqual(true);
        expect(neq.validate('calculated',{calculated:100.00})).toEqual(false);
   })

   test("not equal to using string",()=>
   {
       let neq = new Comparison('!=', {test_value:"no"});
       expect(neq.validate('agree',{agree:'no'})).toEqual(false);
       expect(neq.validate('agree',{agree:'yes'})).toEqual(true);
   })

   test("not equal to using Boel",()=>
   {
       let b = makeBoel();
       let rules=[
        b.field('agree').isNotEqualTo("no")
       ]
       {
          let res = b.validate(rules, {agree:'no'});
          expect(res.has_errors).toBeTruthy();
          res.error_map && expect(res.error_map.agree.validation).toEqual('NotEqualTo');
       }
       {
            let res = b.validate(rules, {agree:'yes'});
            expect(res.has_errors).toBeFalsy();
       }
   })
})