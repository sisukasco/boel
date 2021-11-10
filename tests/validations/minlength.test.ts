import MinLength from "../../src/Validations/MinLength";
import {makeBoel} from "../../src/BoelProvider";

describe("MinLength", ()=>
{
    test("simple minlength tests",()=>
    {
        let minlen = new MinLength(5);

        expect(minlen.validate("name", {name:''})).toEqual(false);

        expect(minlen.validate("name", {name:'a'})).toEqual(false);

        expect(minlen.validate("name", {name:'a name here'})).toEqual(true);

        expect(minlen.validate("name", {name:'aname'})).toEqual(true);

        expect(minlen.validate("name", {})).toEqual(true);
    })

    test("MinLength integrated with Boel",()=>
    {
        let b = makeBoel();
        let res = b.validate([b.field('address').minLength(6)] , 
                    {address:''});
        //console.log("MinLength test ", res);

        expect(res.has_errors).toBeTruthy();
        res.error_map && expect(res.error_map.address.validation).toEqual('MinLength');

        res.error_map && expect(res.error_map.address.message).not.toEqual('');

    });


});