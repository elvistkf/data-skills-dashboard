/**
 * 
 * @param {object} obj 
 * @param {number} topN 
 * @returns a sorted object based on the numeric values for each key
 */
export function sortObjectCount(obj, topN = 0) {
    let tmpArray = [];
    let tmpObject = {};
    for (let key in obj) {
        tmpArray.push([key, obj[key]]);
    }
    tmpArray.sort((a, b) => {
        return b[1] - a[1];
    })
    if (topN > 0) {
        tmpArray = tmpArray.slice(0, topN);
    }
    // eslint-disable-next-line
    tmpArray.forEach(item => {
        tmpObject[item[0]] = item[1]
    })
    return tmpObject;
}

/**
 * 
 * @param {any} obj
 * @returns if the param obj is iterable (except strings)
 */
function isIterable(obj) {
    if (obj == null) {
        return false;
    }
    return (typeof obj[Symbol.iterator] === 'function') && (typeof obj !== 'string')
}

/**
 * 
 * @param {object} doc 
 * @param {object} strongFilter 
 * @param {object} weakFilter 
 * @returns if the param doc fulfils both strongFilter and weakFilter
 * strongFilter is an object where each key must have at least one element matched to the param doc
 * weakFilter is an object where at least one key has an element matched to the param doc
 */
export function validateFilter(doc, strongFilter, weakFilter = {}) {
    const validateStrongFilter = (doc, filter) => {
        for (const [key, val] of Object.entries(filter)) {
            if (!(key in doc)) {
                return false
            }
            if (isIterable(val)) {
                console.log(val);
                for (let v of val) {
                    if (!doc[key].includes(v)) {
                        return false
                    }
                }
            } else {
                if (!doc[key].includes(val)) {
                    return false
                }
            }
        }
        return true;
    }
    const validateWeakFilter = (doc, filter) => {
        let totalLength = 0;
        for (let key in filter) {
            if (isIterable(filter[key])) {
                totalLength += filter[key].length
            } else {
                totalLength++;
            }
        }
        if (Object.keys(filter).length === 0 || totalLength === 0) {
            return true;
        }

        for (const [key, val] of Object.entries(filter)) {
            if (!(key in doc)) {
                continue
            }
            if (isIterable(val)) {
                for (let v of val) {
                    if (doc[key].includes(v)) {
                        return true
                    }
                }
            } else {
                if (doc[key].includes(val)) {
                    return true
                }
            }
        }
        return false;
    }
    return validateStrongFilter(doc, strongFilter) && validateWeakFilter(doc, weakFilter);
}