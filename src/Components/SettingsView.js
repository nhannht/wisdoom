/* global chrome */
// BOOKMARK end of imports
// DraggableButton.propTypes = {
//     onStart: PropTypes.func,
//     onStop: PropTypes.func,
//     state: PropTypes.shape({
//         dashBoardHidden: PropTypes.bool,
//         loadingResult: PropTypes.bool,
//         settingHidden: PropTypes.bool,
//         currentView: PropTypes.string,
//         queryResult: PropTypes.arrayOf(PropTypes.any),
//         buttonPosition: PropTypes.shape({x: PropTypes.number, y: PropTypes.number})
//     })
import checkmarkIcon from "@jetbrains/icons/checkmark";
import Content from "@jetbrains/ring-ui/dist/island/content";
import Input, {Size} from "@jetbrains/ring-ui/dist/input/input";
import Button from "@jetbrains/ring-ui/dist/button/button";
import Text from "@jetbrains/ring-ui/dist/text/text";
import {Grid, Col, Row} from "@jetbrains/ring-ui/dist/grid/grid";
import {useState} from "react";
import Panel from "@jetbrains/ring-ui/dist/panel/panel";
import {ControlsHeight, ControlsHeightContext} from "@jetbrains/ring-ui/dist/global/controls-height";
import * as PropTypes from "prop-types";

function SettingOption(props) {
    const [isEditing, setIsEditing] = useState(false);

    return <Row>
        <Input
            id={props.inputId}
            size={Size.L}
            style={{marginBottom: "10px"}}
            placeholder={props.placeholder}
            onKeyDown={props.onKeyDown}
            isEditing={isEditing}
            isEditingFunc={setIsEditing}
            value={isEditing === false ? props.value : undefined}
            onClick={() => setIsEditing(true)}
            onChange={() => setIsEditing(true)}

        />

        <Button icon={checkmarkIcon} onClick={props.onClick}></Button>
    </Row>;
}


export function SettingsView(props) {
    const [wolframApi, setWolframApi] = useState(undefined);
    chrome.storage.sync.get("wolframApi", (result) => {
        setWolframApi(result.wolframApi)
    })
    const [location, setLocation] = useState(undefined);
    chrome.storage.sync.get("location", (result) => {
        setLocation(result.location)
    })
    const [latlong, setLatlong] = useState(undefined);
    chrome.storage.sync.get("latlong", (result) => {
        setLatlong(result.latlong)
    })
    const [ip, setIp] = useState(undefined);
    chrome.storage.sync.get("ip", (result) => {
        setIp(result.ip)
    })
    const [textRazorApi, setTextRazorApi] = useState(undefined);
    chrome.storage.sync.get("textRazorApi", (result) => {
        setTextRazorApi(result.textRazorApi)
    })


    return <Content><Grid>
        <SettingOption
            inputId={"wolfram-input-id"}
            placeholder="Wolfram Api Key"
            value={wolframApi}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    chrome.storage.sync.set({'wolframApi': e.target.value}, () => {
                    })
                }
            }}


            onClick={() => {
                const value = document.getElementById("wolfram-input-id").value;
                chrome.storage.sync.set({'wolframApi': value}, () => {
                })
            }}/>
        <SettingOption
            inputId={"location-input-id"}
            value={location}
            placeholder={"Location, eg: oasis of vermin| Useful for weather or distance"}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    chrome.storage.sync.set({'location': e.target.value}, () => {
                    })
                }
            }}
            onClick={() => {
                const value = document.getElementById("location-input-id").value;
                chrome.storage.sync.set({'location': value}, () => {
                })
            }}

        />
        <SettingOption
            inputId={"latlong-input-id"}
            value={latlong}
            placeholder={"Lat and Long, eg: 51.5074,0.1278"}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    chrome.storage.sync.set({'latlong': e.target.value}, () => {
                    })
                }
            }}
            onClick={() => {
                const value = document.getElementById("latlong-input-id").value;
                chrome.storage.sync.set({'latlong': value}, () => {
                })
            }}

        />
        <SettingOption
            inputId={"ip-input-id"}
            value={ip}
            placeholder={"IP, eg:192.168.1.1"}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    chrome.storage.sync.set({'ip': e.target.value}, () => {
                    })
                }
            }}
            onClick={() => {
                const value = document.getElementById("ip-input-id").value;
                chrome.storage.sync.set({'ip': value}, () => {
                })
            }}

        />
        <SettingOption
            inputId={"textrazor-api-input-id"}
            value={textRazorApi}
            placeholder={"TextRazor Api Key"}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    chrome.storage.sync.set({'textRazorApi': e.target.value}, () => {
                    })
                }
            }}
            onClick={() => {
                const value = document.getElementById("textrazor-api-input-id").value;
                chrome.storage.sync.set({'textRazorApi': value}, () => {
                })
            }}

        />

    </Grid></Content>;
}