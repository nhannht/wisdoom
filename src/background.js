/*global chrome*/
// Put all the javascript code here, that you want to execute in background.
// function apiSetup() {
//     chrome.storage.sync.get('apiKey', async (result) => {
//         console.log('init background script')
//         if (typeof result.apiKey !== "undefined" || result.apiKey === "") {
//             api = result.apiKey
//         } else {
//             chrome.storage.sync.set({'apiKey': 'K8AKR2-62T7EH48V5'})
//             api = (await chrome.storage.sync.get('apiKey')).apiKey
//
//         }
//     })
// }
// apiSetup();
// For development only
/**
 * Global api
 * @type {number}
 */

/**
 *
 * @type {number}
 */
let api = 0
// chrome.storage.sync.get("apiKey", (result) => {
//     console.log("current apiKey in the storage is " + result.apiKey)
// })

/**
 *
 */
function addWolframKeyChangeListener () {

    chrome.storage.onChanged.addListener((changes, namespace) => {
        console.log(changes)
        if (changes.apiKey) {
            // api = changes.apiKey.newValue
        }
        console.log("we just change apiKey in sync storage,this is ", changes.apiKey.newValue)
    })
    console.log("We just add listener for storage change")
    // setTimeout(()=> console.log("wait 5s"),5000);
}
addWolframKeyChangeListener()


/**
 *
 */
function setDefaultWolframKey () {
    chrome.storage.sync.set({apiKey: 'K8AKR2-62T7EH48V5'}, () => {
        chrome.storage.sync.get("apiKey", (result) => {
            api = result.apiKey
        })

    })
}
setDefaultWolframKey()


/**
 *
 */
function saveApiListener() {
    chrome.runtime.onMessage.addListener(async (msg) => {
        if (msg.apiKey) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icons8-wolfram-alpha-50.png',
                title: 'Wolfram Alpha setting notification',
                message: `Your API key is set successfully, it is ${msg.apiKey}`,

            })


        }
    })
}

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
                                    assumption ,
                                    reinterpret="true",
                                    podstate) => {
    var myHeaders =await new Headers();

    var requestOptions =  {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    // wait api was change before do anything
    const q = encodeURIComponent(query);
    // console.log("the api using in this query is ",api)
    let baseUrl = 'https://api.wolframalpha.com/'
    let apiPath = 'v2/query?'
    let url = new URL(apiPath, baseUrl)
    url.searchParams.set('appid',api )
    url.searchParams.set('input', q)
    url.searchParams.set('output', 'json')
    url.searchParams.set('reinterpret', 'true')
    url.searchParams.set('assumption', assumption)
    if (reinterpret === false){
        url.searchParams.set('reinterpret','false')
    }
    url.searchParams.set('podstate', podstate)
    url.search = decodeURI(url.search)
    // /*console.log*/("url for full result is ", url)
    return fetch(url, requestOptions)
}


/**
 *
 */
function createContextMenu() {
    chrome.contextMenus.create({
        "id": "wolfram",
        "title": "Compute in Wolfram Alpha",
        "type": "normal",
        "contexts": ["selection"],
    });
}

createContextMenu();
/**
 *
 * @type {string}
 */
let oldFreeStyleQuery = ''


/**
 *
 */
function freeInputListener() {
    chrome.runtime.onMessage.addListener((msg, sender,sendResponse) => {
        getWolframFullResult(msg.freeStyleQuery,
            msg.assumption,
            msg.reinterpret,
            msg.podstate
        ).then((response) => {
            response.json().then((result) => {
                sendResponse(result)
            })
        })
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
function getResultListener() {
    chrome.contextMenus.onClicked.addListener(
        async function (info, tab) {
            const response = await getWolframFullResult(info.selectionText)
            const status = response.clone().status
            const result = await response.clone().json()
            const text = await response.clone().text()

            /*console.log*/(result.queryresult)
            if (result.queryresult.success === "false") {
                if (result.queryresult.didyoumean) {
                    await chrome.tabs.sendMessage(tab.id, {"didyoumean": result.queryresult.didyoumean})
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: 'icons/icons8-wolfram-alpha-50.png',
                        title: 'Wolfram Alpha',
                        message: 'Did you mean ' + result.queryresult.didyoumean + '?'
                    })
                } else if (result.queryresult.error.msg) {
                    chrome.notifications.create(
                        {
                            message: result.queryresult.error.msg,
                            type: "basic",
                            iconUrl: "icons/icons8-wolfram-alpha-50.png",
                            title: "Wolfram Alpha Error",
                        })
                } else {
                    chrome.notifications.create(
                        {
                            message: "Unknown error, most is because you give a query that don't have any meaning",
                            type: "basic",
                            iconUrl: "icons/icons8-wolfram-alpha-50.png",
                            title: "Wolfram Alpha Error",
                        })
                }
                return
            }
            if (status !== 200) {
                chrome.notifications.create(
                    {
                        message: "The response status is " + status + ",maybe we have problem with server",
                        type: "basic",
                        iconUrl: "icons/icons8-wolfram-alpha-50.png",

                    }
                )
                return
            }
            await chrome.tabs.sendMessage(tab.id,
                {"result": text});
        }
    )
}

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
function googleResultListener() {
    chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
        if (tab.url.includes("google.com/search")) {
            const url = new URL(tab.url)
            const query = url.searchParams.get("q")
            if (query === oldSearch) return
            // Fix the problem  event execute multiple time
            oldSearch = query
            const result = await getWolframFullResult(url.searchParams.get("q"))
            const resultText = await result.clone().text()
            /*console.log*/("We got result from wolfram alpha")
            await chrome.tabs.sendMessage(tabId, {"google": resultText});
        }
    })
}
googleResultListener();

// Make googleResultListener() also work after reload tab
chrome.webNavigation.onCommitted.addListener((details) => {
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
            /*console.log*/("We got result from wolfram alpha")
            await chrome.tabs.sendMessage(details.tabId, {"google": resultText});

            chrome.webNavigation.onCompleted.removeListener(onComplete);
        });
    }
});



// Add event listener every time user search google



