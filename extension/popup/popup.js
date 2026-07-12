/*
=========================================================
Anti Scam Detector

Popup Controller

Version : 2.0 (Updated with Badge Sync)
=========================================================
*/

import { analyzeWebsite } from "../lib/api.js";
import {
    cleanupCache,
    isCacheValid,
    getCachedResult,
    saveCache,
    addHistory,
    getSettings
} from "../lib/storage.js";

/*
=========================================================
DOM
=========================================================
*/

const urlElement = document.getElementById("url");
const scanButton = document.getElementById("scan-button");
const rescanButton = document.getElementById("rescan-button");
const actionCard = document.getElementById("action-card");
const loadingCard = document.getElementById("loading-card");
const resultCard = document.getElementById("result-card");
const reasonCard = document.getElementById("reason-card");
const statusBadge = document.getElementById("status-badge");
const riskScore = document.getElementById("risk-score");
const confidence = document.getElementById("confidence");
const source = document.getElementById("source");
const reasonList = document.getElementById("reason-list");

/*
=========================================================
State
=========================================================
*/

let currentUrl = ""; // Đã xóa currentResult theo yêu cầu số 4

/*
=========================================================
Current Tab
=========================================================
*/

async function getCurrentTab() {
    const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });
    return tabs[0];
}

/*
=========================================================
Init
=========================================================
*/

async function init() {
    hideAll();
    await cleanupCache();

    try {
        const tab = await getCurrentTab();
        currentUrl = tab.url || "";
        urlElement.textContent = shortenUrl(currentUrl);
    } catch (error) {
        console.error(error);
        urlElement.textContent = "Không lấy được URL.";
    }
}

/*
=========================================================
Hide All
=========================================================
*/

function hideAll() {
    actionCard.classList.remove("hidden");
    loadingCard.classList.add("hidden");
    resultCard.classList.add("hidden");
    reasonCard.classList.add("hidden");
    rescanButton.classList.add("hidden");
}

/*
=========================================================
Loading
=========================================================
*/

function showLoading() {
    actionCard.classList.add("hidden");
    loadingCard.classList.remove("hidden");
    resultCard.classList.add("hidden");
    reasonCard.classList.add("hidden");
    rescanButton.classList.add("hidden");

    scanButton.disabled = true;
    rescanButton.disabled = true;
}

/*
=========================================================
Finish Loading
=========================================================
*/

function finishLoading() {
    loadingCard.classList.add("hidden");
    scanButton.disabled = false;
    rescanButton.disabled = false;
}

/*
=========================================================
Analyze
=========================================================
*/

async function analyze() {
    if (!currentUrl) {
        return;
    }

    showLoading();

    const settings = await getSettings();

    try {
        /*
        =========================================
        Cache (Yêu cầu số 1)
        =========================================
        */
        if (settings.cacheEnabled && await isCacheValid(currentUrl)) {
            const cache = {
                ...(await getCachedResult(currentUrl))
            };
            cache.source += " (Cache)";
            render(cache);
            
            await chrome.runtime.sendMessage({
                type: "UPDATE_BADGE",
                result: cache
            });
            return;
        }

        /*
        =========================================
        Backend (Yêu cầu số 2 & 4)
        =========================================
        */
        const result = await analyzeWebsite(currentUrl);

        /*
        =========================================
        Save Cache
        =========================================
        */
        if (settings.cacheEnabled) {
            await saveCache(currentUrl, result);
        }

        /*
        =========================================
        Save History
        =========================================
        */
        await addHistory({
            url: currentUrl,
            riskScore: result.risk_score,
            status: result.status,
            source: result.source,
            timestamp: Date.now()
        });

        render(result);

        // Gửi tin nhắn cập nhật badge sau khi render thành công
        await chrome.runtime.sendMessage({
            type: "UPDATE_BADGE",
            result
        });

    } catch (error) {
        console.error(error);
        // Yêu cầu số 3 & 6: renderError tự động gửi thông báo xóa/reset badge về 0
        await renderError(
            error.message || "Không kết nối Backend."
        );
    } finally {
        finishLoading();
    }
}

/*
=========================================
Render
=========================================
*/

function render(result) {
    actionCard.classList.add("hidden");
    resultCard.classList.remove("hidden");
    reasonCard.classList.remove("hidden");
    rescanButton.classList.remove("hidden");

    riskScore.textContent = result.risk_score;
    confidence.textContent = Math.round((result.confidence || 0) * 100) + "%";

    renderSource(result.source);
    renderStatus(result.status);
    renderReasons(result.reason);
}

/*
=========================================
Render Error (Yêu cầu số 3 & 6)
=========================================
*/

async function renderError(message) {
    actionCard.classList.add("hidden");
    resultCard.classList.remove("hidden");
    reasonCard.classList.remove("hidden");
    rescanButton.classList.remove("hidden");

    statusBadge.className = "status-danger";
    statusBadge.textContent = "❌ Lỗi";
    riskScore.textContent = "--";
    confidence.textContent = "--";
    source.textContent = "Không khả dụng";

    reasonList.innerHTML = "";
    const li = document.createElement("li");
    li.textContent = message;
    reasonList.appendChild(li);

    // Đồng bộ xóa/reset Badge khi gặp bất kỳ lỗi nào
    await chrome.runtime.sendMessage({
        type: "UPDATE_BADGE",
        result: {
            risk_score: 0
        }
    });
}

/*
=========================================
Render Status
=========================================
*/

function renderStatus(status) {
    statusBadge.className = "";

    switch (status) {
        case "safe":
            statusBadge.classList.add("status-safe");
            statusBadge.textContent = "🟢 An toàn";
            break;
        case "suspicious":
            statusBadge.classList.add("status-warning");
            statusBadge.textContent = "🟡 Nghi ngờ";
            break;
        case "high":
            statusBadge.classList.add("status-high");
            statusBadge.textContent = "🟠 Rủi ro cao";
            break;
        case "malicious":
            statusBadge.classList.add("status-danger");
            statusBadge.textContent = "🔴 Nguy hiểm";
            break;
        default:
            statusBadge.classList.add("status-warning");
            statusBadge.textContent = status;
    }
}

/*
=========================================
Render Source
=========================================
*/

function renderSource(value) {
    switch (value) {
        case "ChongLuaDao":
            source.textContent = "✔ ChongLuaDao";
            break;
        case "ChongLuaDao (Cache)":
            source.textContent = "✔ ChongLuaDao (Cache)";
            break;
        case "AI Analysis":
            source.textContent = "🤖 AI Analysis";
            break;
        case "AI Analysis (Cache)":
            source.textContent = "🤖 AI Analysis (Cache)";
            break;
        case "Fallback":
            source.textContent = "⚠ Fallback";
            break;
        default:
            source.textContent = value || "-";
    }
}

/*
=========================================
Render Reasons
=========================================
*/

function renderReasons(reasons) {
    reasonList.innerHTML = "";

    if (!reasons || reasons.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Không có thông tin.";
        reasonList.appendChild(li);
        return;
    }

    reasons
        .slice(0, 5)
        .forEach(reason => {
            const li = document.createElement("li");
            li.textContent = reason;
            reasonList.appendChild(li);
        });
}

/*
=========================================
Short URL
=========================================
*/

function shortenUrl(url) {
    if (!url) {
        return "";
    }
    if (url.length <= 60) {
        return url;
    }
    return url.substring(0, 60) + "...";
}

/*
=========================================
Refresh Current Tab
=========================================
*/

async function refreshCurrentTab() {
    try {
        const tab = await getCurrentTab();
        currentUrl = tab.url || "";
        urlElement.textContent = shortenUrl(currentUrl);
    } catch (error) {
        console.error(error);
    }
}

/*
=========================================
Events (Yêu cầu số 5)
=========================================
*/

scanButton.addEventListener("click", async () => {
    await refreshCurrentTab();
    await analyze();
});

rescanButton.addEventListener("click", async () => {
    await refreshCurrentTab();
    await analyze();
});

/*
=========================================
DOMContentLoaded
=========================================
*/

document.addEventListener("DOMContentLoaded", async () => {
    await init();
});

/*
=========================================
Export (Future)
=========================================
*/

window.ASD = {
    analyze,
    render,
    renderError
};