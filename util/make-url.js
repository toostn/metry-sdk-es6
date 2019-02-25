export function makeUrl (components , params = {}) {
    components = !Array.isArray(components)
        ? [components]
        : components;

    return [
        components
            .filter(c => c != null)
            .map(c => c.replace(/^\/|\/$/, ''))
            .join('/'),
        Object.keys(params)
            .map(k => k + '=' + encodeURIComponent(params[k]))
            .join('&')
    ]
    .filter(c => c.length > 0)
    .join('?');
}