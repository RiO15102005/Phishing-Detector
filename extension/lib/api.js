import { CONFIG } from "./config.js";

/*
=========================================
Timeout Fetch
=========================================
*/

async function fetchWithTimeout(
    url,
    options = {},
    timeout = CONFIG.REQUEST_TIMEOUT
) {

    const controller = new AbortController();

    const timer = setTimeout(() => {

        controller.abort();

    }, timeout);

    try {

        const response = await fetch(

            url,

            {

                ...options,

                signal: controller.signal

            }

        );

        clearTimeout(timer);

        return response;

    }

    catch (error) {

        clearTimeout(timer);

        throw error;

    }

}

/*
=========================================
Analyze
=========================================
*/

export async function analyzeWebsite(url) {

    const api =

        CONFIG.API_BASE +

        CONFIG.ANALYZE_API;

    const response = await fetchWithTimeout(

        api,

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                url

            })

        }

    );

    if (!response.ok) {

        throw new Error(

            `HTTP ${response.status}`

        );

    }

    const data = await response.json();

    validateResponse(data);

    return data;

}

/*
=========================================
Validate
=========================================
*/

function validateResponse(data) {

    const required = [

        "risk_score",

        "status",

        "confidence",

        "reason"

    ];

    required.forEach(key => {

        if (!(key in data)) {

            throw new Error(

                "Invalid Response : " +

                key

            );

        }

    });

}

/*
=========================================
Health Check
=========================================
*/

export async function pingBackend() {

    try {

        const response = await fetch(

            CONFIG.API_BASE +

            "/docs"

        );

        return response.ok;

    }

    catch {

        return false;

    }

}