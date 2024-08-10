const stringMapper = (obj: Record<string, any>) => {
    if (!obj) return "";
    const properties = Object.keys(obj);
    if (!properties.length) return '';
    const query = properties
        .filter(property => obj[property] || typeof obj[property] === 'number' || typeof obj[property] === 'boolean')
        .map(property => {
            return `${property}=${obj[property]}`
        }).join('&');
    
    return `?${query}`;
}

export default stringMapper;