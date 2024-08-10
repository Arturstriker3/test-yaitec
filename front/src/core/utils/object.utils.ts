class ObjectUtils {
    jsonToObject(data: any) {
        if (data instanceof Object) return data;
        return this.convertToCamelCase(JSON.parse(data)); 
    }

    base64ToJson(data: any) {
        let binaryString = atob(data);
        let jsonString = new TextDecoder().decode(new Uint8Array([ ...binaryString].map(char => char.charCodeAt(0))));
        return jsonString;
    }

    toCamelCase(str: string) {
        return str.split("_").reduce((acc, elem) => acc + (elem[0].toUpperCase() + elem.slice(1, elem.length).toLowerCase()), "");
    }

    convertToCamelCase(json: any): any {
        if (Array.isArray(json)) {
            return json.map(el => this.convertToCamelCase(el));
        }
    
        if (typeof json === "object") {
            let newJson = { ...json };
            Object.keys(newJson).forEach(key => {
                const newKey = this.toCamelCase(key);
                const value = this.convertToCamelCase(newJson[key]);
                delete newJson[key];
                newJson[newKey] = value;
            });
            return newJson;
        }
    
        return json;
    }
}

export default new ObjectUtils();