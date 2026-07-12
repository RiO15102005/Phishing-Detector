/*
=========================================================
Anti Scam Detector

Storage Service

Version : 1.0
=========================================================
*/

const HISTORY_KEY = "history";

const CACHE_KEY = "cache";

const SETTINGS_KEY = "settings";

const WHITELIST_KEY = "whitelist";

const BLACKLIST_KEY = "blacklist";

/*
=========================================================
Generic
=========================================================
*/

export async function get(key){

    const data = await chrome.storage.local.get(key);

    return data[key];

}

export async function set(key,value){

    await chrome.storage.local.set({

        [key]:value

    });

}

export async function remove(key){

    await chrome.storage.local.remove(key);

}

export async function clear(){

    await chrome.storage.local.clear();

}

/*
=========================================================
History
=========================================================
*/

const MAX_HISTORY = 20;

/*
=========================================================
Get History
=========================================================
*/

export async function getHistory(){

    return await get(

        HISTORY_KEY

    ) || [];

}

/*
=========================================================
Add History
=========================================================
*/

export async function addHistory(item){

    let history = await getHistory();

    //
    // Xóa URL đã tồn tại
    //

    history = history.filter(

        h => h.url !== item.url

    );

    //
    // Thêm mới lên đầu
    //

    history.unshift({

        url: item.url,

        riskScore: item.riskScore,

        status: item.status,

        source: item.source,

        timestamp: item.timestamp

    });

    //
    // Chỉ giữ tối đa 20 website
    //

    if(history.length > MAX_HISTORY){

        history.length = MAX_HISTORY;

    }

    await set(

        HISTORY_KEY,

        history

    );

}

/*
=========================================================
Clear History
=========================================================
*/

export async function clearHistory(){

    await remove(

        HISTORY_KEY

    );

}

/*
=========================================================
Cache
=========================================================
*/

export async function getCache(){

    return await get(CACHE_KEY) || {};

}

export async function getCachedResult(url){

    const cache = await getCache();

    return cache[url];

}

export async function saveCache(url,result){

    const cache = await getCache();

    cache[url]={

        ...result,

        timestamp:Date.now()

    };

    await set(

        CACHE_KEY,

        cache

    );

}

export async function removeCache(url){

    const cache = await getCache();

    delete cache[url];

    await set(

        CACHE_KEY,

        cache

    );

}

export async function clearCache(){

    await remove(

        CACHE_KEY

    );

}

export async function isCacheValid(url){

    const settings =

        await getSettings();

    if(

        !settings.cacheEnabled

    ){

        return false;

    }

    const cache =

        await getCachedResult(url);

    if(!cache){

        return false;

    }

    const age =

        Date.now() -

        cache.timestamp;

    return age <

        settings.cacheTTL * 1000;

}

export async function cleanupCache(){

    const cache =

        await getCache();

    const settings =

        await getSettings();

    const ttl =

        settings.cacheTTL * 1000;

    const now =

        Date.now();

    let changed = false;

    for(

        const url in cache

    ){

        if(

            now -

            cache[url].timestamp >

            ttl

        ){

            delete cache[url];

            changed = true;

        }

    }

    if(changed){

        await set(

            CACHE_KEY,

            cache

        );

    }

}

/*
=========================================================
Settings
=========================================================
*/

export async function getSettings(){

    return (

        await get(

            SETTINGS_KEY

        )

    ) || {

        cacheEnabled:true,

        cacheTTL:300,

        notifications:true,

        darkMode:false

    };

}

export async function saveSettings(settings){

    await set(

        SETTINGS_KEY,

        settings

    );

}

/*
=========================================================
Whitelist
=========================================================
*/

export async function getWhitelist(){

    return await get(

        WHITELIST_KEY

    ) || [];

}

export async function addWhitelist(domain){

    const list =

        await getWhitelist();

    if(

        !list.includes(domain)

    ){

        list.push(domain);

    }

    await set(

        WHITELIST_KEY,

        list

    );

}

export async function removeWhitelist(domain){

    const list =

        await getWhitelist();

    await set(

        WHITELIST_KEY,

        list.filter(

            item=>item!==domain

        )

    );

}

/*
=========================================================
Blacklist
=========================================================
*/

export async function getBlacklist(){

    return await get(

        BLACKLIST_KEY

    ) || [];

}

export async function addBlacklist(domain){

    const list =

        await getBlacklist();

    if(

        !list.includes(domain)

    ){

        list.push(domain);

    }

    await set(

        BLACKLIST_KEY,

        list

    );

}

export async function removeBlacklist(domain){

    const list =

        await getBlacklist();

    await set(

        BLACKLIST_KEY,

        list.filter(

            item=>item!==domain

        )

    );

}

/*
=========================================================
Reset
=========================================================
*/

export async function resetStorage(){

    await clearHistory();

    await clearCache();

    await saveSettings({

        cacheEnabled:true,

        cacheTTL:300,

        notifications:true,

        darkMode:false

    });

}