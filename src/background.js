/*global chrome*/
// Put all the javascript code here, that you want to execute in background.
let api = 0

function apiSetup() {
    chrome.storage.sync.get('apiKey', async (result) => {
        console.log('init background script')
        if (typeof result.apiKey !== "undefined" || result.apiKey === "") {
            api = result.apiKey
        } else {
            chrome.storage.sync.set({'apiKey': 'K8AKR2-62T7EH48V5'})
            api = (await chrome.storage.sync.get('apiKey')).apiKey

        }
    })
}
apiSetup();

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

saveApiListener();

const getWolframFullResult = async (query) => {
    var myHeaders = new Headers();

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    const q = encodeURIComponent(query);
    console.log("Api is ", api)
    let url = `http://api.wolframalpha.com/v2/query?appid=${api}&input=${q}&output=json`
    console.log("url for full result is ", url)
    return fetch(url, requestOptions)
}

function createContextMenu() {
    chrome.contextMenus.create({
        "id": "wolfram",
        "title": "Compute in Wolfram Alpha",
        "type": "normal",
        "contexts": ["selection"],
    });
}

createContextMenu();

function freeInputListener() {
    chrome.runtime.onMessage.addListener((msg, sender) => {
        if (msg.freeStyleQuery) {
            console.log("We received free style query")
            getWolframFullResult(msg.freeStyleQuery).then(res => res.json()).then(json => {
                console.log(json)
                chrome.tabs.sendMessage(sender.tab.id, {result: JSON.stringify(json)})
            })
        }
    })
}

freeInputListener();

function getResultListener() {
    chrome.contextMenus.onClicked.addListener(
        async function (info, tab) {
            const response = await getWolframFullResult(info.selectionText)
            const status = response.clone().status
            const result = await response.clone().json()
            const text = await response.clone().text()

            console.log(result.queryresult)
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

getResultListener();
let oldSearch = ""
//
// function googleResultListener() {
//     chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
//         if (tab.url.includes("google.com/search")) {
//             const url = new URL(tab.url)
//             const query = url.searchParams.get("q")
//             // if (query === oldSearch) return
//             // Fix the problem reload event execute multiple time
//             oldSearch = query
//             const result = await getWolframFullResult(url.searchParams.get("q"))
//             const resultText = await result.clone().text()
//             console.log("We got result from wolfram alpha")
//             await chrome.tabs.sendMessage(tabId, {"google": resultText});
//         }
//     })
// }
// Make googleResultListener() also work after reload tab
chrome.webNavigation.onCommitted.addListener((details) => {
    if (["reload", "link", "typed", "generated"].includes(details.transitionType) &&
        details.url.includes("google.com/search")) {
        console.log("We got reload event")

        chrome.webNavigation.onCompleted.addListener(async function onComplete() {
            console.log("We got complete event")

            const url = new URL(details.url)
            const query = url.searchParams.get("q")
            // if (query === oldSearch) return
            // Fix the problem reload event execute multiple time
            oldSearch = query
            const result = await getWolframFullResult(url.searchParams.get("q"))
            const resultText = await result.clone().text()
            console.log("We got result from wolfram alpha")
            await chrome.tabs.sendMessage(details.tabId, {"google": resultText});

            chrome.webNavigation.onCompleted.removeListener(onComplete);
        });
    }
});


// googleResultListener();

// Add event listener every time user search google



