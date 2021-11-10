import {DataMap, Validator} from "../types";
import {
    isValidDate,
    isValidISODateString
    } from 'iso-datestring-validator';
  
import alpha from "./alpha-chars"

interface ContentTypeMap
{
    [cmp:string]:{name:string, message:string, fn:(val:string)=>boolean }
}

  
const type_map:ContentTypeMap=
{
    'alpha':{
        name:'Alphabetic',
        message:"{{field}} can contain only alphabetic characters",
        fn: (val:string)=>RegExp('^['+alpha+']+$').test(val)
    },
    'alpha_s':{
        name:'Alphabetic',
        message:"{{field}} can contain only alphabetic characters",
       fn: (val:string)=>RegExp('^['+alpha+'\\s]+$').test(val)
    },
    'alnum':{
        name:'AlphaNumeric',
        message:"{{field}} can contain only alpha-numeric characters",
        //fn: (val:string)=>XRegExp('^[\\p{L}0-9]+$').test(val)
        fn: (val:string)=>RegExp('^['+alpha+'0-9]+$').test(val)
    },
    'alnum_s':{
        name:'AlphaNumeric',
        message:"{{field}} can contain only alpha-numeric characters",
        //fn: (val:string)=>XRegExp('^[\\p{L}\\s0-9]+$').test(val)
        fn: (val:string)=>RegExp('^['+alpha+'\\s0-9]+$').test(val)
    }, 
    'email':{
        name:'Email',
        message:"Please provide a valid email address",
        fn: (val:string)=>{
            //from:http://projects.scottsplayground.com/email_address_validation/
            const re = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
            return re.test(val)
        }
    },
    'number':{
        name:'Number',
        message:"Please provide a valid number",
        fn: (val:string)=>(/^[\-\+]?\d+([\.,]\d+)?$/.test(val))
    },
    'phone':{
        name:'Phone',
        message:"Please provide a valid phone number",
        fn: (val:string)=>{
            //idea from: https://stackoverflow.com/a/26211492/1198745
            const phoneNum = val.replace(/[^\d]/g, '');
            return(phoneNum.length > 6 && phoneNum.length <= 14)
        }
    },
    'color':{
        name:'Color',
        message:"Please provide a valid color code",
        fn: (val:string)=>/^#[0-9a-fA-F]{6}$/i.test(val)
    },
    'date':{
        name:'Date',
        message:"Please enter a valid date",
        fn:(val:string)=>isValidDate(val)
    },
    'datetime':{
        name:'DateTime',
        message:"Please enter a valid date",
        fn:(val:string)=>isValidISODateString(val)        
    },
    'url':{
        name:'URL',
        message:"Please enter a valid URL",
        fn:(val:string)=>{
            const regex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i
            return regex.test(val)
        }               
    }
}

export default 
class ContentType implements Validator
{
    public message="";
    public name=""; 
    constructor(private type:string)
    {
        const types = Object.keys(type_map);
        if(!types.includes(type))
        {
            throw Error(`unsupported content type ${type}`);
        }
        
        this.name = type_map[type].name;
        this.message = type_map[type].message;
    }
    validate(field_name:string, data:DataMap):boolean
    {
        if(typeof(data[field_name]) == 'undefined' ||
        data[field_name] == "")
        {
            //won't validate if field is not present
            return true;
        }
       return type_map[this.type].fn(data[field_name])
    }
}