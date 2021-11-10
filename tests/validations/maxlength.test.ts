import MaxLength from "../../src/Validations/MaxLength";
import {makeBoel} from "../../src/BoelProvider";



describe("MaxLength", ()=>
{
    test("maxlength works simple case",()=>
    {
        let maxlen = new MaxLength(10);
        let res = maxlen.validate('name', {name:'Some long long long name with more than 10 chars'});
        expect(res).toEqual(false);
        let res2 = maxlen.validate('name', {name:'Short Name'});

        expect(res2).toEqual(true);
        
        let res3 = maxlen.validate('name', {name:'Short Name '});
        expect(res3).toEqual(false);
    })

    test("MaxLength returns correct when 0",()=>
    {
        let maxlen = new MaxLength(5);
        expect(maxlen.validate('addr',{addr:'000000'})).toEqual(false);

        expect(maxlen.validate('addr',{addr:'0'})).toEqual(true);

        expect(maxlen.validate('addr',{})).toEqual(true);

        expect(maxlen.validate('addr',{x:0})).toEqual(true);
    })

    test("Maxlength integrated with Boel",()=>
    {
        let b = makeBoel();
        let res = b.validate([b.field('address').maxLength(6)] , 
                    {address:'a long long long address'});
        
        expect(res.has_errors).toBeTruthy();
        res.error_map && expect(res.error_map.address.validation).toEqual('MaxLength');

        res.error_map && expect(res.error_map.address.message).not.toEqual('');
    })
})