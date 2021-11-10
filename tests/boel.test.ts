import Boel from "../src/Boel";

import {DataMap} from "../src/types";

describe("Boel", ()=>
{
    test("make_validator simple setup",()=>
    {
        const b = new Boel();

        b.addValidator("simplyMatches",(param:unknown)=>
        ({
            validate(field_name:string, data:DataMap)
            {
                //console.log("inside validator function");
                return(data[field_name] === <string>param);
            }
        }));

        let v = b.field("name").simplyMatches('param 1');
        let res = b.validate([v], {name:'param 1'});
        expect(res.has_errors).toEqual(false);
        res = b.validate([v], {name:'another param'});
        expect(res.has_errors).toEqual(true);
        
    })
    

})