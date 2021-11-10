//import "../src/general-validations";
//import {fields, field, validate, update_messages} from "../src/validator-map";

import {makeBoel} from "../src/BoelProvider";

describe("GeneralValidations",()=>
{
    test("simple required field missing", ()=>
    {
        let b = makeBoel();
        let v = b.field("first_name").isRequired();
        let res = b.validate([v], {});
        //console.log("Validation results ", res);
        expect(res.has_errors).toBe(true);
        expect(res.error_map).toBeDefined();
        if(!res.error_map){throw new Error("Bad Error Map")};
        expect(res.error_map.first_name).toBeDefined();
        expect(res.error_map.first_name.message).toBeDefined();
        expect(res.error_map.first_name.validation).toEqual('Required');
    });

    test("simple required provided", ()=>
    {
        let b = makeBoel();
        let v = b.field("first_name").isRequired();
        let res = b.validate([v], {first_name:"x"});
        //console.log("Validation results ", res);
        expect(res.has_errors).toBe(false);
        expect(res.error_map).toBeDefined();
        if(!res.error_map){throw new Error("Bad Error Map")};
        expect(res.error_map.first_name).not.toBeDefined();
    })

    test("Multiple required fields together",()=>
    {
        let b = makeBoel();
        let v = b.fields("first_name", "last_name", "email").areRequired();
        let res = b.validate([v], {first_name:"x"});
        //console.log("Validation results ", res);
        expect(res.has_errors).toBe(true);
        expect(res.error_map).toBeDefined();
        res.error_map && expect(res.error_map.last_name.validation).toEqual('Required');
        res.error_map && expect(res.error_map.email.validation).toEqual('Required');
    })

    test("with max length", ()=>
    {
        let b = makeBoel();
        let v = b.field("last_name").isRequired().checkMaxLength(5);
        let res = b.validate([v], {last_name:"x1234567890"});

        //console.log("Validation results ", res);
        expect(res.has_errors).toBe(true);
        expect(res.error_map).toBeDefined();
        res.error_map && expect(res.error_map.last_name.validation).toEqual('MaxLength');
    });

    test("required with custom global message", ()=>
    {
        let b = makeBoel();
        let rules = [
            b.field("some_name").isRequired(),
            b.field("another_name").isRequired()
        ]
        b.updateMessages({'Required':"{{field}} is required."});

        let res = b.validate(rules, {});
        //console.log("validation results ", res);
        expect(res.has_errors).toBe(true);
        expect(res.error_map).toBeDefined();
        res.error_map && expect(res.error_map.some_name.validation).toEqual('Required');
        res.error_map && expect(res.error_map.some_name.message).toEqual('some_name is required.');
        res.error_map && expect(res.error_map.another_name.message).toEqual('another_name is required.');
    });

    test("required with validator's message", ()=>
    {
        let b = makeBoel();

        let rules = [
            b.field("some_name").isRequired(),
            b.field("another_name").isRequired()
        ]

        let res = b.validate(rules, {});
        //console.log("validation results 2 ", res);
        expect(res.has_errors).toBe(true);
        expect(res.error_map).toBeDefined();
        res.error_map && expect(res.error_map.some_name.validation).toEqual('Required');
        res.error_map && expect(res.error_map.some_name.message).toEqual('some_name is required');
        res.error_map && expect(res.error_map.another_name.message).toEqual('another_name is required');
    });

    test("required with custom message",()=>
    {
        let b = makeBoel();
        let rules = [
            b.field("last_name").isRequired()
            .message("The last name field is essential")
            .checkMaxLength(5)
            .message("Last name is too long!")
        ];
        let res = b.validate(rules, {first_name:"Paul"});
        //console.log("validation results cust message ", res);
        expect(res.has_errors).toBe(true);
        expect(res.error_map).toBeDefined();
        res.error_map && expect(res.error_map.last_name.validation).toEqual('Required');
        res.error_map && expect(res.error_map.last_name.message).toEqual('The last name field is essential');
        
        let res2 = b.validate(rules, {first_name:"Paul", last_name:"A very very long name"});

        //console.log("validation results cust message 2 ", res2);
        expect(res2.has_errors).toBe(true);
        expect(res2.error_map).toBeDefined();
        res2.error_map && expect(res2.error_map.last_name.validation).toEqual('MaxLength');
        res2.error_map && expect(res2.error_map.last_name.message).toEqual('Last name is too long!');

        let res3 = b.validate(rules, {first_name:"Paul", last_name:"Short"});
        expect(res3.has_errors).toBe(false);

    });

    test("maxlength with custom message", ()=>
    {
        let b = makeBoel();

        const custom_message = "{{field}} length should be less than {{max_length}}";

        let rules = [
            b.field('message').maxLength(5).message(custom_message),
            b.field('another_message').maxLength(5)
        ]

        let res = b.validate(rules, {message:"some randome long text"});
        expect(res.has_errors).toBe(true);
        expect(res.error_map).toBeDefined();
        res.error_map && expect(res.error_map.message.validation).toEqual('MaxLength');
        res.error_map && expect(res.error_map.message.message).toEqual('message length should be less than 5');

        //console.log(" max length results ", res);
        
        let res2 =  b.validate(rules, {another_message:"This is another long message"});
        //console.log(" max length 2 ", res2);
        expect(res2.has_errors).toBe(true);
        expect(res2.error_map).toBeDefined();
        res2.error_map && expect(res2.error_map.another_message.validation).toEqual('MaxLength');
        res2.error_map && expect(res2.error_map.another_message.message).not.toEqual('message length should be less than 5');
    });

    test("conditional validation simple",()=>
    {
        let b = makeBoel();
        let rules =[
            b.field("phone").isRequired().onlyWhen("contact==1")
        ];

        let res = b.validate(rules, {contact:1});
        //console.log(" results ", res);
        expect(res.has_errors).toBe(true);
        expect(res.error_map).toBeDefined();
        res.error_map && expect(res.error_map.phone.validation).toEqual('Required');


        let res2 = b.validate(rules, {contact:0});

        expect(res2.has_errors).toBe(false);
        
        let res3 = b.validate(rules, {phone:"1234567890",contact:1});
        expect(res3.has_errors).toBe(false);

    })

    test("multiple conditional validation", ()=>
    {
        let b = makeBoel();
        let rules =[
            b.field("tax").isRequired().onlyWhen("income > 1000 and paid <= 0")
        ];

        let res = b.validate(rules, {income:'', paid:0});
        //console.log(" conditional results 2 ", res);
        expect(res.has_errors).toBe(false);

        let res2 = b.validate(rules, {income:1000.1, paid:0});
        //console.log(" conditional results 2 ", res2);
        expect(res2.has_errors).toBe(true);
        expect(res2.error_map).toBeDefined();
        res2.error_map && expect(res2.error_map.tax.validation).toEqual('Required');
    })

    test("conditional validation with equal to b66s6",()=>
    {
        let b = makeBoel();
        let rules =[
            b.field("name").isRequired().onlyWhen("agree==\"on\"")
        ];

        let res = b.validate(rules, {agree:"on", name:""});
        console.log(" results ", res);
    })
    
});