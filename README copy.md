# BoelJS
Form Data validation library

**Note** : Work in progress

## Usage 

```js
let b = makeBoel();
const rules = [ 
    b.field('name').isRequired().minLength(5).maxLength(100),
    b.field('email').isEmail().isRequired(),
]

let res = b.validate(rules, formData)
if(res.has_errors){
    //res.error_map[field_ame].message contains the error message
    email_error = res.error_map.email.message
}
```
### Validate conditionally

```js
    b.field('age').isBetween(10,60).message("Age out of range").onlyWhen("paying_now==1"),

    /** Compare between fields */
    b.field('current_salary').isGreaterThan('prev_salary'),
```
### Shortcut for validating multiple fields, same validations
```js
/** multiple fields at the same time */
b.fields("name", "email").areRequired().maxLength(100);
// Fields name and email are required with maxlength 100 (for both fields)
```

## Customize/Translate Error message templates

```js
/** change/translate message templates for all validations */
b.updateMessages({
    'Required':"{{field}} is required", 
    "MaxLength":"The input shouldn't exceed {{max_length}} characters"
})

```

## List of Validations

#### Required
For example:

```js
b.field("name").isRequired()

b.field("total").required()
```

#### MaxLength
checks the length of the input in characters
```js
b.field("name").maxLength(32)

b.field("email").checkMaxLength(23)

b.fields("address1","address2").maxLength(52)
```

#### MinLength
requires a minimum length for the input

```js
b.field("name").minLength(5)

b.field("email").checkMinLength(5)
```

#### Alphabetic
checks whether the input contains English Alphabetic Characters only
An optional flag can be used to allow spaces in the input.

```js
b.field("code").isAlphabetic()

b.fields("code1", "code2").areAlphabetic(/*allow spaces*/ true)

```

#### Alphanumeric
Allows English alphabetic and numeric characters in the input
An optional flag can be used to allow spaces in the input.
```js
b.field("code").isAlphaNumeric()

b.fields("code1", "code2").areAlphaNumeric(/*allow spaces*/ true)

```

#### Email
Checks the input to be in a valid email format. (It doesn't check the existence of the email)
```js
b.field("user_email").isEmail()

b.fields("email1", "email2").areEmails()
```

#### Less Than
Compare the input to a fixed number

```js
b.field("weight").isLessThan(80)

b.fields("luggage", "checkin").areLessThan(25)
```

#### Less Than Or Equal To
Check whether the input is <= a number

```js
b.field("weight").lessThanOrEqualTo(82)

b.fields("luggage", "checkin").areLessThanOrEqualTo(35)
```





