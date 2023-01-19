/* global chrome */
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {join, split} from 'lodash';

const placeHolder = document.createElement("div");
placeHolder.id = "WisdoomSettingsPlaceHolder";
function Settings() {
    const [hosts, setHosts] = useState(undefined);
    const [isEditHost, setIsEditHost] = useState(false);
    console.log("rerender")
    chrome.storage.sync.get(['hosts'], function (result) {
        if (JSON.stringify(result.hosts) !== JSON.stringify(hosts)) {
            setHosts(result.hosts);
        }
    })


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            chrome.storage.sync.set({'hosts': hosts}, () => {
            })
            console.log("Oh we just set the hosts")
        }, 1000)
        return () => clearTimeout(delayDebounceFn)
    }, [hosts])

    return (<div className={"container " +
        " flex flex-col items-center bg-cover  "}>
        <div className={"text-4xl "}>Wisdoom Setting</div>
        <textarea id="message" rows={hosts ? hosts.length : 1}
                  className="block
                        rounded
                        m-9
                        w-1/2
                         ring-2
                         "
                  placeholder="Current accepted host go here"
                  onFocus={() => setIsEditHost(true)}
                  onBlur={() => setIsEditHost(false)}
                  value={isEditHost === false ?
                      join(hosts, "\n")
                      : undefined}
                  onChange={(e) => {
                      chrome.storage.sync.set({'hosts': split(e.target.value, "\n")}, () => {
                      })
                  }}


        >

        </textarea>
    </div>)
}

document.body.appendChild(placeHolder);
ReactDOM.createRoot(document.getElementById('WisdoomSettingsPlaceHolder')).render(<Settings/>);

