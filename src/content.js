/* global chrome */
import React from 'react';
import ReactDOM from 'react-dom';
import '@jetbrains/ring-ui/dist/style.css';
// SimpleContent component is wrapper around ContentLayout component
// It is used to display content in the popup
import {GoogleTabs} from "./Components/GoogleTabs";
// Render at appbar
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.google) {
        const resultJSON = JSON.parse(msg.google)
        console.log("resultJSON", resultJSON)
        // Render under the appbar
        const appbar = document.querySelector("#appbar")
        ReactDOM.render(<GoogleTabs data={resultJSON}/>, appbar)
    }
})
