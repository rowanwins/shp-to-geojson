export function parseString (value) {
    return value.trim() || null;
}

export function parseBoolean (value) {
    return /^[nf]$/i.test(value) ? false :
        /^[yt]$/i.test(value) ? true :
            null
}

export function parseNumber (value) {
    return !(value = value.trim()) || isNaN(value = +value) ? null : value;
}

export function parseDate (value) {
    return new Date(+value.substring(0, 4), value.substring(4, 6) - 1, +value.substring(6, 8));
}
