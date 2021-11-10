import {Validator, DataMap, ErrorMap} from "./types";
import {Parser, Expression, Value} from 'expr-eval';
import {getValidatorName} from "./utils";
import {ValidationExecutionInterface} from "./internal-types"
import {mustache} from "./mustache";

class ValidatorObj
{
    public validator:Validator;
    public message='';
    public condition_expr:Expression|null=null;

    constructor(validator:Validator)
    {
        this.validator = validator;
    }
    set condition(cond:string)
    {
        if(!cond)
        {
            this.condition_expr=null;
        }
        else
        {
            const parser = new Parser();
            this.condition_expr = parser.parse(cond);
        }
    }
}

export interface ValidatorInfoProvider
{
    getMessageTemplate(validator:Validator):string
}


export class FieldValidations implements ValidationExecutionInterface
{
    private validations:ValidatorObj[]=[];

    constructor(private fields:string[],
        private validator_info: ValidatorInfoProvider)
    {

    }
    addValidation(v:Validator):void
    {
        this.validations.push( new ValidatorObj(v) );
    }
    addMessage(msg_templ:string):void
    {
        if(this.validations.length > 0)
        {
            this.validations[this.validations.length-1].message = msg_templ;
        }
    }
    addCondition(condition:string):void
    {
        if(this.validations.length > 0)
        {
            this.validations[this.validations.length-1].condition = condition;
        }
    }
    validate(data:DataMap):ErrorMap
    {
        const error_map:ErrorMap={};
        for(const validation of this.validations)
        {
            
            if(validation.condition_expr !== null)
            {
                const result = 
                    validation.condition_expr.evaluate(<Value>data);
                
                if(!result){ continue; }
            }

            for (const field of this.fields) 
            {
                //TODO: check the field is present in the data
                // Also check the validator check for undefined
                
                if (!validation.validator.validate(field, data)) 
                {
                    if (!error_map[field]) 
                    {
                        error_map[field] = { 
                            validation: getValidatorName(validation.validator) ,
                            message: this.getMessage(validation,field)
                        };
                    }
                }
            }
            
        }
        return error_map;
    }
    getMessage(validn:ValidatorObj, field:string):string
    {
        let message_templ = '';
        if(validn.message)
        {
            message_templ= validn.message;
        }
        else
        {
            message_templ = this.validator_info.getMessageTemplate(validn.validator);
        }
        const vmap = {field, ...validn.validator}
        const msg = mustache(message_templ, vmap)
        
        return msg;
    }
    public hasValidations():boolean
    {
        return(this.validations.length > 0 ?true:false);
    }

}

