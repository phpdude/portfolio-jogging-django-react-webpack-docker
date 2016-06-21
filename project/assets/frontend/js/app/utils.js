function isInteger(value) {
    return value ^ 0 === value;
}

function errorsList(json) {
    return Object.values(json).map(function (x) {
        return Array.isArray(x) ? x.join(", ") : ("" + x);
    }).join('. ');
}

export function status(code_or_response, json_errors_callback) {
    // default response status code
    var code = 200;

    if (!json_errors_callback) {
        json_errors_callback = function (json) {
            return new Error(errorsList(json));
        };
    }

    const check = (response) => {
        return new Promise(function (resolve, reject) {
            if (response.status == code) {
                resolve(response);
            } else {
                response.json()
                    .then(function (json) {
                        reject(json_errors_callback(json));
                    }, function (err) {
                        reject(err);
                    });
            }
        });
    };

    // check for passed integer status code, otherwise process as response object
    if (isInteger(code_or_response)) {
        code = code_or_response;

        return check;
    } else {
        return check(code_or_response);
    }
}

export function statusJSON(code_or_response, json_errors_callback) {
    var code = 200;

    const result = (response) => {
        return new Promise(function (resolve, reject) {
            status(code, json_errors_callback)(response).then(function (response) {
                response.json().then(function (json) {
                    resolve(json);
                }, reject);
            }, function (err) {
                reject(err);
            });
        });
    };

    if (isInteger(code_or_response)) {
        code = code_or_response;

        return result;
    } else {
        return result(code_or_response);
    }
}