import {Validator, DataMap, ErrorMap} from "./types";

/**
 * Wrapper for a single field's validations
 * message() makes it possible to customize the last validation message
 * and
 * onlyWhen() to add validation conditions
 */
export interface ValidationSupportInterface
{
    //field_v: FieldValidations
    addValidation(v:Validator):void
    message(m:string):ValidationFacade
    onlyWhen(condition:string):ValidationFacade
}

export interface ValidationExecutionInterface
{
    validate(data:DataMap):ErrorMap
}

export type ValidatorFactoryFn= (...args:unknown[])=>Validator|null;

/**
 * Validation facade exposes all validation methods (like isRequired() maxLength())
 * plus, adds the FieldValidation Methods like message() that allows customizing the 
 * validation. The two interfaces are combined so that the validations can be expressed declaratively
 */
export type ValidationFacade = ValidationSupportInterface & ValidatorMakerMap & ValidationExecutionInterface;

/**
 * The Validator Wrapper function wraps the ValidatorFactoryFn  (that generates the validator objects)
 * It takes variable number of arguments, attaches the validations to the field and then returns the 
 * Facade object so that more validations can be chained
 */
export  type ValidatorWrapperFn = (...args:unknown[])=>ValidationFacade;


export interface ValidatorMakerMap
{
    [name:string]:ValidatorWrapperFn
}


export  interface ValidatorInfoMap
{
    [field:string]:{
        message ?: string
    }
}

