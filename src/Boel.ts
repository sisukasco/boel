import {Validator, DataMap, ValidationResult, SimpleField} from "./types";
import {FieldValidations, ValidatorInfoProvider} from "./FieldValidations";
import {ValidatorMakerMap,ValidatorInfoMap, 
    ValidatorFactoryFn, ValidationFacade,
    ValidationExecutionInterface } from "./internal-types";
import {FieldValidationsWrapper} from "./FieldValidationsWrapper";
import {getValidatorName} from "./utils";
import {generateRules} from "./rules";


export default class Boel implements ValidatorInfoProvider
{
    private  validator_makers:ValidatorMakerMap={};
    private all_validators:ValidatorInfoMap={};

    addValidator(name:string|string[], vfatory:ValidatorFactoryFn):Boel
    {
        if(typeof name == 'string')
        {
            this.validator_makers[name] = function(this:ValidationFacade, ...args:unknown[])
            {
                const vdtr = vfatory(...args)
                if(vdtr != null)
                {
                    this.addValidation(vdtr);    
                }
                return this;
            }
        }
        else
        {
            const names = name;
            for(const name_x of names)
            {
                this.addValidator(name_x, vfatory);
            }
        }
        return this;
    }

    updateMessages(messages:{[validator:string]:string}):void
    {
        for(const validator_name in messages )
        {
            if(!this.all_validators[validator_name])
            {
                this.all_validators[validator_name] = {
                    message: messages[validator_name]
                };
            }
            else
            {
                this.all_validators[validator_name].message = messages[validator_name];
            }
            
        }
    }


    field(field_name:string):ValidationFacade
    {
        const field_v_wrapper = new FieldValidationsWrapper(new FieldValidations([field_name],this));

        Object.assign(field_v_wrapper, this.validator_makers);

        return (<ValidationFacade><unknown>field_v_wrapper);
    }

    fields(...fields:string[]):ValidationFacade
    {
        const field_v_wrapper = new FieldValidationsWrapper(new FieldValidations(fields,this));

        Object.assign(field_v_wrapper, this.validator_makers);

        return (<ValidationFacade><unknown>field_v_wrapper);
    }

    validate(specs:ValidationExecutionInterface[]|SimpleField[], 
            data:DataMap ):ValidationResult
    {
        return this.validateByRules(specs as ValidationExecutionInterface[], data)
    }

    validateByRules(rules:ValidationExecutionInterface[], data:DataMap ):ValidationResult
    {
        let error_map = {};
        for(const rule of rules)
        {
            const field_errors = rule.validate(data);
            error_map = {...error_map, ...field_errors};
        }

        const has_errors = (Object.keys(error_map).length > 0) ? true:false;
        
        return({has_errors, error_map});
    }
    
    validateFields(fields:SimpleField[], data:DataMap ):ValidationResult
    {
        const rules = generateRules(fields, this);
        if(rules.length <= 0)
        {
            return({has_errors:false});
        }
        return this.validateByRules(rules, data);
    }

    getMessageTemplate(validator:Validator):string
    {
        let message_templ  = 'Error! ';
        const v_name = getValidatorName(validator);

        if(this.all_validators[v_name] &&  
        this.all_validators[v_name].message)
        {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            message_templ = this.all_validators[v_name].message!;
        }
        else if(validator.message)
        {
            message_templ = validator.message;
        }
        return message_templ;
    }
    
    
}