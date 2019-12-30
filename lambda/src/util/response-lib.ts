export function success(info: object={}) {
    return {ok: true, ...info};
}

export function failure(info: object={}, code: number = 500) {
    return buildResponse(code, {ok: false, ...info});
}

function buildResponse(statusCode: number, info: any) {
    console.log("Building response: ", statusCode, info);

    return {
        statusCode: statusCode,
        headers: {
            // 'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Credentials': true,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
    };
}