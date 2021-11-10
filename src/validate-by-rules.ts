import {SimpleField, DataMap, ValidationResult} from "./types";
import Boel from "./Boel";
import {generateRules} from "./rules";

export function validateByRules(fields:SimpleField[],data:DataMap):ValidationResult
{
    const b = new Boel()
    const rules = generateRules(fields, b)
    return b.validate(rules, data)
}
