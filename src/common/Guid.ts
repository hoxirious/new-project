/*
This file has no dependencies
GUID Creation
Project: https://github.com/Steve-Fenton/TypeScriptUtilities
Author: Steve Fenton
Example usage:

var id = Guid.newGuid();

*/

export class Guid {
    static newGuid() {
        try {
            return crypto.randomUUID();
        } catch {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }
    }
}