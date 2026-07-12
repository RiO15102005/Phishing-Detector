/*
=========================================================
Anti Scam Detector

Background Service Worker

Author : Anti Scam Detector
Version : 1.0
=========================================================
*/

import { analyzeWebsite } from "./lib/api.js";

import {

    getCachedResult,

    saveCache,

    addHistory,

    getSettings

} from "./lib/storage.js";

/*
=========================================================
Startup
=========================================================
*/

console.log("======================================");
console.log("Anti Scam Detector");
console.log("Background Service Started");
console.log("======================================");

/*
=========================================================
Normalize URL
=========================================================
*/

function normalizeUrl(url){

    try{

        const u = new URL(url);

        return (

            u.origin +

            u.pathname.replace(/\/$/,"")

        );

    }

    catch{

        return url;

    }

}

/*
=========================================================
Cache Expired
=========================================================
*/

function isExpired(cache,ttl){

    if(!cache){

        return true;

    }

    const age =

        Date.now() -

        cache.timestamp;

    return age >

        ttl*1000;

}

/*
=========================================================
Update Badge
=========================================================
*/

function updateBadge(result){

    const score =

        result.risk_score ?? 0;

    //
    // SAFE
    //

    if(score <= 20){

        chrome.action.setBadgeText({

            text:""

        });

        chrome.action.setTitle({

            title:"Website an toàn"

        });

        return;

    }

    let color = "#eab308";

    if(score <=45){

        color = "#eab308";

    }

    else if(score <=79){

        color = "#f97316";

    }

    else{

        color = "#dc2626";

    }

    chrome.action.setBadgeText({

        text:String(score)

    });

    chrome.action.setBadgeBackgroundColor({

        color

    });

    chrome.action.setTitle({

        title:`Risk Score : ${score}`

    });

}

/*
=========================================================
Analyze
=========================================================
*/

async function analyze(url){

    url = normalizeUrl(url);

    console.log(

        "[Analyze]",

        url

    );

    const settings =

        await getSettings();

    /*
    ===========================
    Cache
    ===========================
    */

    if(settings.cacheEnabled){

        const cache=

            await getCachedResult(url);

        if(

            cache &&

            !isExpired(

                cache,

                settings.cacheTTL

            )

        ){

            console.log(

                "[Cache]",

                url

            );

            updateBadge(cache);

            return cache;

        }

    }

    /*
    ===========================
    Backend
    ===========================
    */

    console.log(

        "[Backend]",

        url

    );

    const result=

        await analyzeWebsite(url);

    /*
    ===========================
    Cache
    ===========================
    */

    if(settings.cacheEnabled){

        await saveCache(

            url,

            result

        );

    }

    /*
    ===========================
    History
    ===========================
    */

    await addHistory({

    url,

    riskScore: result.risk_score,

    status: result.status,

    source: result.source,

    timestamp: Date.now()

});

    /*
    ===========================
    Badge
    ===========================
    */

    updateBadge(result);

    return result;

}

/*
=========================================================
Runtime Message
=========================================================
*/

chrome.runtime.onMessage.addListener(

(request,sender,sendResponse)=>{

    switch(request.type){

        case "ANALYZE":

            analyze(

                request.url

            )

            .then(

                result=>sendResponse(result)

            )

            .catch(

                error=>{

                    console.error(error);

                    sendResponse({

                        error:error.message

                    });

                }

            );

            return true;

        case "OPEN_POPUP":

            if(chrome.action.openPopup){

                chrome.action.openPopup();

            }

            sendResponse({

                success:true

            });

            return true;

        case "UPDATE_BADGE":

            updateBadge(

                request.result

            );

            sendResponse({

                success:true

            });

            return true;
            
        default:

            return false;

    }

});


/*
=========================================================
Installed
=========================================================
*/

chrome.runtime.onInstalled.addListener(()=>{

    console.log(

        "Extension Installed"

    );

});

/*
=========================================================
Startup
=========================================================
*/

chrome.runtime.onStartup.addListener(()=>{

    console.log(

        "Extension Started"

    );

});