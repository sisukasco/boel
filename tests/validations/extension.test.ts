import FileExtension from "../../src/Validations/FileExtension";
import {makeBoel} from "../../src/BoelProvider";
import {validateByRules} from "../../src/validate-by-rules";

describe("FileExtension",()=>
{
    test("tests single extension",()=>
    {
        const v = new FileExtension('jpg');

        expect(v.validate('photo',{photo:'myprofile.jpg'})).toEqual(true);
        expect(v.validate('photo',{})).toEqual(true);
        expect(v.validate('photo',{photo:'document.pdf'})).toEqual(false);
        expect(v.validate('photo',{photo:'document'})).toEqual(false);
    });

    test("tests multiple extensions",()=>
    {
        const v = new FileExtension('jpg,jpeg,  png, gif ');

        expect(v.validate('photo',{photo:'myprofile.jpg'})).toEqual(true);
        expect(v.validate('photo',{photo:'apic.png'})).toEqual(true);
        expect(v.validate('photo',{photo:'long.file-name.png'})).toEqual(true);
        expect(v.validate('photo',{photo:'a name with space.gif'})).toEqual(true);
        expect(v.validate('photo',{photo:'another name.jpeg'})).toEqual(true);
        expect(v.validate('photo',{})).toEqual(true);
        expect(v.validate('photo',{photo:'document.pdf'})).toEqual(false);
        expect(v.validate('photo',{photo:'document'})).toEqual(false);
    });
    test("boel integration", ()=>
    {
        const b = makeBoel();
        const res = b.validate([ b.field('doc').hasExtension("pdf, docx, txt") ], {doc:'myfile.png'});

        //console.log("extension error", res);
        expect(res.has_errors).toBeTruthy();
        res.error_map && expect(res.error_map.doc.validation).toEqual('FileExtension');

        res.error_map && expect(res.error_map.doc.message).not.toEqual('');
    })
    
    
   test("FileExtension validation - rules style",()=>
    {
        const fd = {profile:{file_name:"adoc.docx"}, options:[]}
        const fields = [
            {
                name: "profile",
                type: "File",
                validations:
                {
                    file_extension: { valid_extensions:"jpg,png,gif" }
                }
            }
        ]
        const res = validateByRules(fields, fd)
        expect(res.has_errors).toEqual(true);
        res.error_map && expect(res.error_map.profile.validation).toEqual('FileExtension');
        
        const fd2 =  {profile:{file_name:"mypic.jpg"}, options:[]}
        const res2 = validateByRules(fields, fd2)
        expect(res2.has_errors).toEqual(false);
    });
});