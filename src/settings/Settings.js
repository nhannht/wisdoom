import React from 'react';
import ReactDOM from 'react-dom/client';
const placeHolder = document.createElement("div");
placeHolder.id = "WisdoomSettingsPlaceHolder";
function Settings (){
    return (
        <div
        className={"container text-red-600"}
        >hello</div>
    )
}

document.body.appendChild(placeHolder);
ReactDOM.createRoot(document.getElementById('WisdoomSettingsPlaceHolder')).render(<Settings/>);