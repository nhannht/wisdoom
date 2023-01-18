/*global chrome*/
/**
 * @type {number|string}
 */
let api = undefined;
let location = undefined;
let ip = undefined
let latlong = undefined

let textRazorApi = undefined
// Example: Parse a list of match patterns:
var acceptedHost = [
    'google.com',
    'facebook.com'
]
// Example of filtering:
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        let match = false;
        const url = new URL(tab.url);
        const host = url.host.replace(/^www\./, '');
        console.log(host)
        const protocol = url.protocol;
        if (protocol === 'http:' || protocol === 'https:') {
            if (acceptedHost.includes(host)) {
                match = true;
            }
        }
        if (match) {
            chrome.scripting.executeScript({
                    target: {tabId: tabId},
                    files: ['static/js/content.js']
                }
            );
        }
    }
});

function settingsChangeListener() {
    chrome.storage.onChanged.addListener((changes, namespace) => {
        console.log(changes)
        if (changes.wolframApi) {
            api = changes.wolframApi.newValue
        }
        if (changes.location) {
            location = changes.location.newValue

        }
        if (changes.ip) {
            ip = changes.ip.newValue
        }
        if (changes.latlong) {
            latlong = changes.latlong.newValue
        }
        if (changes.textRazorApi) {
            textRazorApi = changes.textRazorApi.newValue
        }
        if (changes.hosts) {
            acceptedHost = changes.hosts.newValue
        }
    })
}

settingsChangeListener()


/**
 *
 */

function setDefault() {
    chrome.storage.sync.get('wolframApi', (result) => {
        if (!result.wolframApi) {
            chrome.storage.sync.set({wolframApi: 'DEMO'})
            api = 'DEMO'
        } else {
            api = result.wolframApi
        }

    })

    chrome.storage.sync.get("location", (result) => {
        location = result.location
    })
    chrome.storage.sync.get("ip", (result) => {
        ip = result.ip
    })
    chrome.storage.sync.get("latlong", (result) => {
        latlong = result.latlong
    })
    chrome.storage.sync.get("hosts",
        (result) => {
            if (result.hosts) {
                acceptedHost = result.hosts
            } else {
                acceptedHost = ["google.com", "facebook.com"]
            }
        }
    )
}

setDefault()


/**
 *
 */

// saveApiListener();
/**
 *
 * @param query
 * @param assumption
 * @param reinterpret
 * @param podstate
 * @returns {Promise<Response>}
 */
const getWolframFullResult = async (query,
                                    assumption,
                                    reinterpret = "true",
                                    podstate) => {
    var myHeaders = await new Headers();

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const q = encodeURIComponent(query);
    // console.log("the api using in this query is ",api)
    let baseUrl = 'https://api.wolframalpha.com/'
    let apiPath = 'v2/query?'
    let url = new URL(apiPath, baseUrl)
    url.searchParams.set('appid', api)
    url.searchParams.set('input', q)
    url.searchParams.set('output', 'json')
    url.searchParams.set('reinterpret', 'true')
    url.searchParams.set('assumption', assumption)
    url.searchParams.set('location', location)
    url.searchParams.set('ip', ip)
    url.searchParams.set('latlong', latlong)
    if (reinterpret === false) {
        url.searchParams.set('reinterpret', 'false')
    }
    url.searchParams.set('podstate', podstate)
    url.search = decodeURI(url.search)
    console.log("url for full result is ", url)
    return fetch(url, requestOptions)
}

const getWolframShortResult = async (query) => {
    var myHeaders = await new Headers();

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const q = encodeURIComponent(query);
    // console.log("the api using in this query is ",api)
    let baseUrl = 'https://api.wolframalpha.com/'
    let apiPath = 'v1/spoken?'
    let url = new URL(apiPath, baseUrl)
    url.searchParams.set('appid', api)
    url.searchParams.set('i', q)
    url.search = decodeURI(url.search)
    console.log("url for full result is ", url)
    return fetch(url, requestOptions)
}

const getTextRazorResultEntities = async (query) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("x-textrazor-key", textRazorApi);

    var urlencoded = new URLSearchParams();
    urlencoded.append("extractors", "entities");
    urlencoded.append("text", query);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    return fetch("https://api.textrazor.com", requestOptions)

}
const textRazorEntitiesListener = () => {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (msg.textRazorEntitiesQuery) {
            getTextRazorResultEntities(msg.textRazorEntitiesQuery).then((response) => {
                response.json().then((result) => {
                    console.log("The result is ", result)
                    sendResponse(result)
                })
            })
        }
    })
}

textRazorEntitiesListener()


const shortWolframAnswerListener = () => {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (msg.shortAnswerWolframQuery) {
            getWolframShortResult(msg.shortAnswerWolframQuery).then((response) => {
                response.text().then((result) => {
                    console.log("The short answer result is ", result)
                    sendResponse(result)
                })
            })
        }
    })
}
shortWolframAnswerListener()

// function createContextMenu() {
//     chrome.contextMenus.create({
//         "id": "wolfram",
//         "title": "Compute in Wolfram Alpha",
//         "type": "normal",
//         "contexts": ["selection"],
//     });
// }
//
// createContextMenu();
/**
 *
 * @type {string}
 */
let oldFreeStyleQuery = ''


/**
 *
 */
function freeInputListener() {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (msg.freeStyleQuery) {
            getWolframFullResult(msg.freeStyleQuery,
                msg.assumption,
                msg.reinterpret,
                msg.podstate
            ).then((response) => {
                response.json().then((result) => {
                    console.log("The result is ", result)
                    sendResponse(result)
                })
            })
        }
        return true
    })
}

freeInputListener();

/**
 * @function
 */
function downloadUrl() {
    chrome.runtime.onMessage.addListener((msg) => {
        if (msg.urlDownload) {
            chrome.downloads.download({
                url: msg.urlDownload,
            })
        }
    })
}

downloadUrl()


/**
 *
 */
// function getResultListener() {
//     chrome.contextMenus.onClicked.addListener(
//         async function (info, tab) {
//             const response = await getWolframFullResult(info.selectionText)
//             const status = response.clone().status
//             const result = await response.clone().json()
//             const text = await response.clone().text()
//
//             /*console.log*/(result.queryresult)
//             if (result.queryresult.success === "false") {
//                 if (result.queryresult.didyoumean) {
//                     await chrome.tabs.sendMessage(tab.id, {"didyoumean": result.queryresult.didyoumean})
//                     chrome.notifications.create({
//                         type: 'basic',
//                         iconUrl: 'icons/icons8-wolfram-alpha-50.png',
//                         title: 'Wolfram Alpha',
//                         message: 'Did you mean ' + result.queryresult.didyoumean + '?'
//                     })
//                 } else if (result.queryresult.error.msg) {
//                     chrome.notifications.create(
//                         {
//                             message: result.queryresult.error.msg,
//                             type: "basic",
//                             iconUrl: "icons/icons8-wolfram-alpha-50.png",
//                             title: "Wolfram Alpha Error",
//                         })
//                 } else {
//                     chrome.notifications.create(
//                         {
//                             message: "Unknown error, most is because you give a query that don't have any meaning",
//                             type: "basic",
//                             iconUrl: "icons/icons8-wolfram-alpha-50.png",
//                             title: "Wolfram Alpha Error",
//                         })
//                 }
//                 return
//             }
//             if (status !== 200) {
//                 chrome.notifications.create(
//                     {
//                         message: "The response status is " + status + ",maybe we have problem with server",
//                         type: "basic",
//                         iconUrl: "icons/icons8-wolfram-alpha-50.png",
//
//                     }
//                 )
//                 return
//             }
//             await chrome.tabs.sendMessage(tab.id,
//                 {"result": text});
//         }
//     )
// }

// getResultListener();
//
/**
 *
 * @type {string}
 */
let oldSearch = ""


    /**
     * @function
     */
// function googleResultListener() {
//     chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
//         if (tab.url.includes("google.com/search")) {
//             const url = new URL(tab.url)
//             const query = url.searchParams.get("q")
//             if (query === oldSearch) return
//             // Fix the problem  event execute multiple time
//             oldSearch = query
//             const result = await getWolframFullResult(url.searchParams.get("q"))
//             const resultText = await result.clone().text()
//             /*console.log*/("We got result from wolfram alpha")
//             await chrome.tabs.sendMessage(tabId, {"google": resultText});
//         }
//     })
// }
// googleResultListener();

// Make googleResultListener() also work after reload tab
    /*chrome.webNavigation.onCommitted.addListener((details) => {
        if (["reload", "link", "typed", "generated"].includes(details.transitionType) &&
            details.url.includes("google.com/search")) {
            // console.log("We got reload event")

            chrome.webNavigation.onCompleted.addListener(async function onComplete() {
                // console.log("We got complete event")

                const url = new URL(details.url)
                const query = url.searchParams.get("q")
                if (query === oldSearch) return
                // Fix the problem  event execute multiple time
                oldSearch = query
                const result = await getWolframFullResult(url.searchParams.get("q"))
                const resultText = await result.clone().text()
                /!*console.log*!/("We got result from wolfram alpha")
                await chrome.tabs.sendMessage(details.tabId, {"google": resultText});

                chrome.webNavigation.onCompleted.removeListener(onComplete);
            });
        }
    })*/;


// Add event listener every time user search google




