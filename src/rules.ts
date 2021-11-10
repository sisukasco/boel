import Required from "./Validations/required";
import MaxLength from "./Validations/MaxLength";
import MinLength from "./Validations/MinLength";
import Comparison from "./Validations/Comparison";
import ContentType from "./Validations/ContentType";
import MaxCount from "./Validations/MaxCount";
import MinCount from "./Validations/MinCount";
import Selected from "./Validations/Selected";
import Pattern from "./Validations/Pattern";
import FileExtension from "./Validations/FileExtension";


import {ValidationExecutionInterface} from "./internal-types";
import {FieldValidations, ValidatorInfoProvider} from "./FieldValidations";
import {SimpleField, SimpleValidation, Validator} from "./types";

export function generateRules(fields:SimpleField[], infoP:ValidatorInfoProvider):ValidationExecutionInterface[]
{
    const retFvs:ValidationExecutionInterface[] = [] 
    for(const f of fields)
    {
        const fv = MakeFieldValidator(f, infoP)
        if(fv.hasValidations())
        {
            retFvs.push(fv );
        }
    }
    return retFvs;
}

export function MakeFieldValidator(f:SimpleField, infoP:ValidatorInfoProvider):FieldValidations
{
    const fv = new FieldValidations([f.name], infoP)
    for(const v in f.validations)
    {
        const vx = f.validations[v]
        
        const validator = vxToValidation(v,vx)
        if(validator)
        {
            fv.addValidation(validator);
            fv.addMessage(vx.message||'');
            fv.addCondition(vx.condition||'');
        }
    }
    return fv ;
}
function vxToValidation(v:string, vx:SimpleValidation):Validator|null{
    let validator:Validator|null = null;
    switch(v)
    {
        case "required":
            if(vx.enabled === true)
            {
                validator = new Required();    
            }
            break;
        case "maxlength":
            if(vx.size)
            {
                validator = new MaxLength(+vx.size);    
            }
            break;
        case "minlength":
            if(vx.size)
            {
                validator = new MinLength(+vx.size);
            }
            break;

        case "min":
            if(vx.num !== undefined)
            {
                validator = new Comparison('>=', {test_value: +vx.num});
            }
            break;
            
        case "max":
            if(vx.num !== undefined)
            {
                validator = new Comparison('<=', {test_value: +vx.num});
            }
            break;
        case "confirm":
            if(vx.other)
            {
                validator = new Comparison('=', {test_field: String(vx.other) });
            }
            break;
            
        case "max_date":
            if(vx.date !== undefined && vx.other !== "")
            {
                validator = new Comparison('<=', 
                    { test_value: new Date(String(vx.date)) });
            }
            break;
            
        case "min_date":
            if(vx.date !== undefined && vx.other !== "")
            {
                validator = new Comparison('>=', 
                    { test_value: new Date(String(vx.date)) });
            }
            break;                    
        case "content_type":
            const type = String(vx.type)
            if(type)
            {
                validator = new ContentType(type);
            }
            break;
        case "max_count":
            if(vx.num)
            {
                validator = new MaxCount(Number(vx.num))
            }
            break;
        case "min_count":
            if(vx.num)
            {
                validator = new MinCount(Number(vx.num))
            }
            break;
        case "must_check":
            if(vx.enabled)
            {
                validator = new Selected()
            }
            break;
        case "should_select":
            if(vx.item)
            {
                validator =  new Comparison("=", 
                    { test_value: String(vx.item) })
            }
            break;
        case "should_not_select":
            if(vx.item)
            {
                validator =  new Comparison("!=", 
                    { test_value: String(vx.item) })
            }
            break;
        case "pattern":
            if(vx.regexp)
            {
                validator =  new Pattern(String(vx.regexp))
            }
            break;
        case "file_extension":
            if(vx.valid_extensions)
            {
                validator =  new FileExtension(String(vx.valid_extensions)) 
            }  
            break; 
    }
    return validator
}