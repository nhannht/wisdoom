/* global chrome */
import React from 'react';
import ReactDOM from 'react-dom';
import '@jetbrains/ring-ui/dist/style.css';
// SimpleContent component is wrapper around ContentLayout component
// It is used to display content in the popup
import {GoogleTabs} from "./Components/GoogleTabs";
import KnowledgeDashBoard from "./Components/KnowledgeDashBoard";
import {ProSidebarProvider} from "react-pro-sidebar";
// import * as cheerio from 'cheerio';
// Render at appbar
// chrome.runtime.onMessage.addListener((msg) => {
//     if (msg.google) {
//         const resultJSON = JSON.parse(msg.google)
//         console.log("resultJSON", resultJSON)
//         // Render under the appbar
//         const appbar = document.querySelector("#appbar")
//         ReactDOM.render(<GoogleTabs data={resultJSON}/>, appbar)
//     }
// })

// Render KnowledgeDashBoard
const KnowledgeDashBoardPlaceHolder = document.createElement("div")
KnowledgeDashBoardPlaceHolder.id = "KnowledgeDashBoardPlaceHolder"
KnowledgeDashBoardPlaceHolder.style["zIndex"] = 999999
KnowledgeDashBoardPlaceHolder.style["position"] = "sticky";
document.body.appendChild(KnowledgeDashBoardPlaceHolder)
ReactDOM.render(
    <ProSidebarProvider>
        <KnowledgeDashBoard/>
    </ProSidebarProvider>, document.getElementById('KnowledgeDashBoardPlaceHolder'))
// Extract page content with cheerio
// const $ = cheerio.load(document.body.innerHTML)
// console.log($)
// console.log("This is the text from cheerio",$.textContent)


