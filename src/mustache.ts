/*
	
	Super-simple Mustache-style text-replacement.
	
	Example:
	var data = {name: "James", location: "Mars"};
	mustache("Welcome to {{location}}, {{ name }}.", data); // => Welcome to Mars, James.
	
*/

export function mustache(string:string, data:Record<string,unknown>):string{
	if (typeof(string) === "string" && typeof(data) === "object") {
		for (const key in data) {
			string = string.replace(new RegExp("{{\\s*" + key + "\\s*}}", "g"), String(data[key]));
		}
	}
	return string;
}