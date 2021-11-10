import ContentType from "../../../src/Validations/ContentType";
import {makeBoel} from "../../../src/BoelProvider";
import {validateByRules} from "../../../src/validate-by-rules";

describe("Color",()=>
{
    test("color code validation",()=>
    {
        const ev= new ContentType("color");

        expect(ev.validate('color',{color:"#880088"})).toEqual(true);
        expect(ev.validate('color',{color:"#ccFFcc"})).toEqual(true);
        expect(ev.validate('color',{color:"#ccc"})).toEqual(false);
        expect(ev.validate('color',{color:"#ggffgg"})).toEqual(false);
        expect(ev.validate('color',{color:"#ffffff  "})).toEqual(false);
    })
    
    test("color code validation - integration with Boel",()=>
    {
        const b = makeBoel();
        const rules=[
            b.field('my_color').isColorCode()
        ];

        {
            const res = b.validate(rules, {my_color:'#8080'});
            //console.log(" Email validation result ", res);
            expect(res.has_errors).toBeTruthy();
            res.error_map && expect(res.error_map.my_color.validation).toEqual('Color');
        }

        {
            const res = b.validate(rules, {my_color:'#808080'});
            expect(res.has_errors).toBeFalsy();
        }

    })
    
    test("color code validation - Rules style",()=>
    {
        const fd = {widget:"green"}
        const fields = [
            {
                name: "widget",
                type: "Color",
                validations:
                {
                    content_type: { type:"color" }
                }
            }
        ]
        const res = validateByRules(fields, fd)
        expect(res.has_errors).toEqual(true);
        res.error_map && expect(res.error_map.widget.validation).toEqual('Color');
        
        const fd2 = {widget:"#808080"}
        const res2 = validateByRules(fields, fd2)
        expect(res2.has_errors).toEqual(false);
    });
})