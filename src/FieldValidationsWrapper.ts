import {FieldValidations} from "./FieldValidations";
import {ValidationSupportInterface, ValidationFacade, ValidationExecutionInterface} from "./internal-types";
import {Validator, DataMap, ErrorMap} from "./types";

export class FieldValidationsWrapper 
    implements ValidationSupportInterface,
    ValidationExecutionInterface
{
    constructor(private field_v: FieldValidations)
    {

    }
    addValidation(v:Validator):void
    {
        this.field_v.addValidation(v);
    }
    validate(data:DataMap):ErrorMap
    {
        return this.field_v.validate(data);
    }
    message(m:string):ValidationFacade
    {
        this.field_v.addMessage(m);
        return(<ValidationFacade><unknown>this);
    }
    onlyWhen(condition:string):ValidationFacade
    {
        this.field_v.addCondition(condition);
        return(<ValidationFacade><unknown>this);
    }
}