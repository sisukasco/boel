import {DataMap, Validator} from "../types";

type Compareable = number|string|Date

interface ComparisonMap
{
    [cmp:string]:{ name:string, message:string, fn:(a:Compareable,b:Compareable)=>boolean}
}

const comparison_operators:ComparisonMap=
{
    '<':{
            name:'LessThan',
            message:"{{field}} should be less than {{test_value}}",
            fn:(a,b)=>(a < b)
        },
    '<=':
        {
            name:'LessThanOrEqualTo',
            message:"{{field}} should be less than or equal to {{test_value}}",
            fn:(a,b)=>(a <= b)
        }, 
    '>':
        {
            name:'GreaterThan',
            message:"{{field}} should be greater than {{test_value}}",
            fn:(a,b)=>(a > b)
        },
    '>=':
        {
            name: 'GreaterThanOrEqualTo',
            message:"{{field}} should be greater than or equal to {{test_value}}",
            fn:(a,b)=>(a >= b)
        },
    '=':
        {
            name: 'EqualTo',
            message:"{{field}} should be equal to {{test_value}}",
            fn:(a,b)=>(a === b)
        },
    '!=':
        {
            name: 'NotEqualTo',
            message: "{{field}} should not be equal to {{test_value}}",
            fn:(a,b)=>(a !== b)
        }
};

interface ComparisonOptions
{
    test_value ?: Compareable,
    test_field ?: string
}

enum TestType{ Value, Field }

export default 
class Comparison implements Validator
{
    public message="";
    public test_value:Compareable=0;
    private test_against= TestType.Value;
    public name="";
    
    constructor(private comparison:string,private options:ComparisonOptions)
    {
        const operators = Object.keys(comparison_operators);
        if(!operators.includes(comparison))
        {
            throw Error(`unsupported comparison operator ${comparison}`);
        }
        this.name = comparison_operators[comparison].name;
        this.message = comparison_operators[comparison].message;
        if(typeof(options.test_value) != 'undefined' )
        {
            this.test_against = TestType.Value;
            this.test_value = options.test_value;
        }
        else if(typeof(options.test_field) != 'undefined' )
        {
            this.test_against = TestType.Field;
            this.test_value = options.test_field;
        }
        else
        {
            throw Error("Provide one of test_value or test_field in the options");
        }
    }
    
    validate(field_name:string, data:DataMap):boolean
    {
        if(typeof(data[field_name]) == 'undefined')
        {
            //skip validation if the field is absent
            return true;
        }
        const value = this.getOtherValue(data);
        let fv;
        if(typeof(value) == "string")
        {
            fv = String(data[field_name])
        }
        else if(typeof(value) == "number")
        {
            fv = Number(data[field_name])
        }
        else if(value instanceof Date)
        {
            fv = new Date(data[field_name])
        }
        else
        {
            throw Error("Couldn't identify value type");
        }
        
        return this.doComparison(fv,value);
    }
    
    
    private getOtherValue(data:DataMap):Compareable
    {
        if(this.test_against == TestType.Field )
        {
            //This conditions shouldn't happen since the test is already done in contrsuctor. But typescript doesn't know that
            if(typeof(this.options.test_field) == 'undefined'){ throw Error("The test_field is not provided") }
            if(typeof(data[this.options.test_field]) == "string")
            {
                return(String(data[this.options.test_field]));
            }
            else if(typeof(data[this.options.test_field]) == "number")
            {
                return(Number(data[this.options.test_field]));
            }
            else
            {
                throw Error("Wrong type for test_field (neither string nor number)");
            }
        }   
        else
        {
            if(typeof(this.options.test_value) == 'undefined'){ throw Error("The test_value is not provided") }

            return(this.options.test_value);
        }
    }
    doComparison(param1:Compareable, param2:Compareable):boolean
    {
        return comparison_operators[this.comparison].fn(param1, param2);
    }
    
}