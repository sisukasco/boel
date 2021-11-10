import Boel from "./Boel";
import {add_common_validations} from "./common-validations";

export function makeBoel():Boel
{
    return add_common_validations(new Boel());
}