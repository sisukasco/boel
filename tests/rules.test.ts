import {generateRules} from "../src/rules";
import {makeBoel} from "../src/BoelProvider";
import {validateByRules} from "../src/validate-by-rules";

const txt_settings=`{
    "fields": [
      {
        "name": "name",
        "type": "text",
        "validations": {
            "required":{
                "enabled": true
            }
        }
      },
      {
        "name": "email",
        "type": "text",
        "validations": {
            "required":{
                "enabled": true
            }
        }
      },
      {
        "name": "Age",
        "type": "number",
        "validations": {
            "greaterthan": {
                "num": "15"
            },
            "lessthan":{
                "num": "60"
            }            
        }
      }
    ]
  }`;

const txt_settings2=`
{
    "fields": [
      {
        "name": "name",
        "type": "text",
        "validations": {
            "required": {
                "enabled": true
            },
            "maxlength":{
                "message": "some error message for maxlen",
                "size": "5"
            }
        }
      },
      {
        "name": "email",
        "type": "text",
        "validations": {
            "required": {
                "enabled": true
            }
        }
      },
      {
        "name": "Age",
        "type": "number",
        "validations": {
            "greaterthan": {
                "num": "15"
            },
            "lessthan": {
                "num": "60"
            }
        }
      }
    ]
  }
`

const txt_settings3=
`
[
    {
      "pos": 0,
      "type": "text",
      "name": "name",
      "label": "",
      "validations": {
        "maxlength": {
          "condition": "",
          "message": "",
          "size": 52
        },
        "required": {
          "enabled": true
        }
      },
      "settings": null
    },
    {
      "pos": 0,
      "type": "email",
      "name": "email",
      "label": "",
      "validations": {
        "maxlength": {
          "size": 52
        },
        "required": {
          "enabled": true
        }
      },
      "settings": null
    }
  ]
`
describe("generaterules", ()=>
{
    test("required",()=>
    {
        const settings = JSON.parse(txt_settings);
        const b = makeBoel();
        const rules = generateRules(settings.fields, b);
        console.log("validation rules ", rules);
        const res = b.validate(rules, {});
        console.log("validation results ", res);
        expect(res.has_errors).toEqual(true);
        if(res.error_map)
        {
            expect(res.error_map.name.validation).toEqual("Required"); 
            expect(res.error_map.email.validation).toEqual("Required");
        }
    });
    
    test("maxlen",()=>
    {
        const settings = JSON.parse(txt_settings2);
        
        const b = makeBoel();
        const rules = generateRules(settings.fields, b);
        console.log("validation rules ", rules);
        const res = b.validate(rules, {name:"a very very long name", email:"some@website.com"});
        console.log("validation results ", res);
        expect(res.has_errors).toEqual(true);
        if(res.error_map)
        {
            expect(res.error_map.name.validation).toEqual("MaxLength");
            expect(res.error_map.name.message).toEqual("some error message for maxlen"); 
        }
    })
    
    test("VDNS100: new validation structure",()=>
    {
        const fds = `{"email": "valentin.nader@gusikowski.com"}`
        const fields = JSON.parse(txt_settings3);
        const fd =  JSON.parse(fds);
        const res = validateByRules(fields, fd)
        console.log("validation results ", res);
        expect(res.has_errors).toEqual(true);
        console.log("validation results ", res)
    })
})