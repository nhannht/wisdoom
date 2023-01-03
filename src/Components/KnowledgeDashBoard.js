/* global chrome */
import Draggable from "react-draggable";
import Button from '@jetbrains/ring-ui/dist/button/button';
import {Sidebar, useProSidebar} from "react-pro-sidebar";
import Island from "@jetbrains/ring-ui/dist/island/island";
import Header from "@jetbrains/ring-ui/dist/header/header";
import Content from "@jetbrains/ring-ui/dist/island/content";
import Heading, {H1, H2, H3, H4} from "@jetbrains/ring-ui/dist/heading/heading";
import {Input, Size} from "@jetbrains/ring-ui/dist/input/input";
import {useState} from "react";
import Img from 'react-image';
import Loader from '@jetbrains/ring-ui/dist/loader/loader';
// import ButtonGroup from '@jetbrains/ring-ui/dist/button-group/button-group';
import Tray from "@jetbrains/ring-ui/dist/header/tray";
import TrayIcon from '@jetbrains/ring-ui/dist/header/tray-icon';
import settingIcon from '@jetbrains/icons/settings';
import collapseIcon from '@jetbrains/icons/collapse';
import starIcon from '@jetbrains/icons/star-empty';
import likeIcon from '@jetbrains/icons/vote-empty';
// import Icon from '@jetbrains/ring-ui/dist/icon/icon';
import Logo from "@jetbrains/ring-ui/dist/header/logo";
import Popup from '@jetbrains/ring-ui/dist/popup/popup';
import Text from '@jetbrains/ring-ui/dist/text/text';
import Icon from '@jetbrains/ring-ui/dist/icon/icon';
import '@jetbrains/icons/file-js'
import alertService from '@jetbrains/ring-ui/dist/alert-service/alert-service';
import checkmarkIcon from '@jetbrains/icons/checkmark';
import Panel from "@jetbrains/ring-ui/dist/panel/panel";
import Badge from "@jetbrains/ring-ui/dist/badge/badge";
import ButtonGroup from "@jetbrains/ring-ui/dist/button-group/button-group";
import Caption from "@jetbrains/ring-ui/dist/button-group/caption";
import LoaderScreen from "@jetbrains/ring-ui/dist/loader-screen/loader-screen";
import Select from "@jetbrains/ring-ui/dist/select/select";

export default function KnowledgeDashBoard() {
    const [state, setState] = useState({
        queryResult: [],
        dashBoardHidden: true,
        buttonPosition: {x: 0, y: 0},
        settingHidden: true,
        currentView: 'WolframAlpha',
        loadingResult: false,
    });

    const {collapseSidebar, toggleSidebar, collapsed, toggled} = useProSidebar();

    function toggle() {
        if (collapsed) {
            toggleSidebar(true);
            collapseSidebar(false);
            setState({...state, dashBoardHidden: false});
        } else {
            collapseSidebar(true);
            toggleSidebar(false);
            setState({...state, dashBoardHidden: true});
        }
    }

    function toggleLoading() {
        setState({...state, loadingResult: !state.loadingResult});
    }

    function sendQueryToBackGround(query, assumption = "") {
        setState(prevState => ({...prevState, loadingResult: true}));
        chrome.runtime.sendMessage({freeStyleQuery: query, assumption: assumption}, (response) => {
            setState(prevState => ({...prevState, queryResult: response.queryresult}));
            setState(prevState => ({...prevState, loadingResult: false}));
        });
    }

    function onDragStart(e) {
        setState({...state, buttonPosition: {x: e.screenX, y: e.screenY}});
    }

    function onDragStop(e) {
        const dragX = Math.abs(e.screenX - state.buttonPosition.x);
        const dragY = Math.abs(e.screenY - state.buttonPosition.y);
        // console.log(dragX,dragY)
        if (dragX > 5 || dragY > 5) {
            e.stopPropagation();
        } else {
            toggle();
        }

    }

    function setWolframKey(key) {
        chrome.storage.sync.set({apiKey: key}, function () {
            console.log('Wolfram is set to ' + key);
        })
        alertService.successMessage('Wolfram is set to ' + key);
    }

    const brainIcon = "<!-- Uploaded to: SVG Repo, www.svgrepo.com, Transformed by: SVG Repo Mixer Tools -->\n" +
        "<svg width=\"800px\" height=\"800px\" viewBox=\"-20 0 190 190\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
        "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M129.49 114.51C129.121 116.961 128.187 119.293 126.762 121.322C125.337 123.351 123.461 125.021 121.28 126.2C120.676 126.535 120.043 126.816 119.39 127.04C120.22 138.04 102.74 142.04 93.32 139.42L96.82 151.66L87.82 151.98L72.07 129.43C66.76 130.93 60.49 131.65 56.44 125.15C56.0721 124.553 55.7382 123.935 55.44 123.3C54.4098 123.51 53.3614 123.617 52.31 123.62C49.31 123.62 44.31 122.72 41.77 120.96C39.7563 119.625 38.1588 117.75 37.16 115.55C31.75 116.29 27.16 115.02 24.16 111.88C20.36 107.97 19.28 101.51 21.26 94.58C23.87 85.33 31.81 74.91 47.59 71C48.9589 69.2982 50.5972 67.8322 52.44 66.66C62.35 60.31 78.44 59.76 90.65 65.79C95.3836 64.9082 100.27 65.376 104.75 67.14C113.53 70.43 119.91 77.31 121.11 84.3C123.487 85.5317 125.433 87.4568 126.69 89.82C129.32 94.76 129.69 99.71 127.92 103.71C129.587 107.049 130.138 110.835 129.49 114.51ZM123.01 109.31C121.612 110.048 120.056 110.434 118.475 110.434C116.894 110.434 115.338 110.048 113.94 109.31L114.67 104.46C117.75 104.76 120.26 103.8 121.57 101.83C123.04 99.64 122.81 96.39 120.95 92.9C118.87 88.99 114.38 88.37 111.89 88.34H111.73C105.49 88.34 99.13 91.89 96.56 96.52L92.82 94.73C93.5553 92.3449 94.8046 90.15 96.48 88.3C95.0376 87.0754 93.9474 85.4887 93.3217 83.703C92.696 81.9173 92.5574 79.9971 92.92 78.14L96.61 77.8C96.7789 79.302 97.4 80.7172 98.3911 81.8583C99.3822 82.9994 100.697 83.8125 102.16 84.19C105.238 82.8161 108.58 82.1335 111.95 82.19C112.43 82.19 112.89 82.24 113.36 82.27C110.969 78.0312 107.18 74.7545 102.64 73C91.56 68.7 84.09 75.37 82.38 77.67C78.26 83.19 80.9 88.41 82.91 91.8L79.61 94.8C76.736 92.314 74.8075 88.9127 74.15 85.17C69.92 86.44 64.24 86.17 61.06 80.74L64.06 78.68C67.43 81.2 72.78 80.98 75.32 77.87C75.9252 76.4949 76.6905 75.1959 77.6 74C79.044 72.093 80.7864 70.4316 82.76 69.08C74.47 66.82 62.76 67.19 55.68 71.73C53.7668 72.841 52.192 74.4517 51.1244 76.3895C50.0569 78.3274 49.5368 80.5192 49.62 82.73C49.62 86.3 52.42 91.94 56.19 92.82L54 97.07C51.5946 96.5129 49.4109 95.2487 47.73 93.44L44.48 97.58L41.23 96L44.41 87.68C43.8904 86.064 43.624 84.3774 43.62 82.68C43.628 81.3361 43.7687 79.9963 44.04 78.68C34.04 82.81 29.1 89.68 27.29 95.96C25.9 100.79 26.44 105.15 28.72 107.49C30.53 109.35 33.3 109.79 35.91 109.62L42.91 104.17L45.21 106.11L43.13 112.93C44.22 116.4 47.79 118.19 54.3 116.93C54.6375 114.169 55.7272 111.554 57.45 109.37C58.7133 107.552 60.3846 106.056 62.33 105L65.75 95.79L69.17 95.64L68.8 103.19C74.55 102.6 80.98 103.77 86.97 102.87L88.07 106.87C79.29 110.93 70.3 104.31 62.15 113.04C59.22 116.18 60.34 118.91 62.15 121.66C64.76 125.59 69.66 123.23 74.67 121.66C82.26 119.34 87.77 117.66 98.16 118.51C95.68 113.8 95.92 108.11 99.24 101.85L104.13 103.78C100.7 111.69 103.91 116.27 106.13 118.29C109.56 121.41 114.72 122.35 118.13 120.47C119.436 119.749 120.559 118.737 121.412 117.513C122.265 116.289 122.825 114.885 123.05 113.41C123.275 112.051 123.258 110.663 123 109.31H123.01Z\" fill=\"#000000\"/>\n" +
        "</svg>"
    const wolframIcon = "<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\n" +
        "<svg fill=\"#000000\" width=\"800px\" height=\"800px\" viewBox=\"0 0 24 24\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\"><title>Wolfram icon</title><path d=\"M20.105 12.001l3.307-3.708-4.854-1.059.495-4.944-4.55 1.996L12 0 9.495 4.287 4.947 2.291l.494 4.944L.587 8.289l3.305 3.707-3.305 3.713 4.854 1.053-.5 4.945 4.553-1.994L12 24l2.504-4.287 4.55 1.994-.495-4.938 4.854-1.06-3.308-3.708zm1.605 2.792l-2.861-.982-1.899-2.471 2.526.942 2.234 2.511zm.459-6.096l-2.602 2.918-3.066-1.141 1.844-2.612 3.824.835zm-4.288-1.324l-1.533 2.179.088-3.162 1.788-2.415-.343 3.398zm-3.304-2.399l3.091-1.354L15.9 5.998l-2.943 1.049 1.62-2.073zm1.187 1.772l-.096 3.652-3.341 1.12V7.969l3.437-1.223zM12 1.308l1.969 3.371L12 7.199l-1.971-2.521L12 1.308zM9.423 4.974l1.619 2.072-2.948-1.048L6.332 3.62l3.091 1.354zm2.245 2.995v3.549l-3.335-1.12-.102-3.652 3.437 1.223zM7.564 6.39l.086 3.162-1.532-2.179-.341-3.397L7.564 6.39zM1.83 8.692l3.824-.83 1.839 2.612-3.065 1.136L1.83 8.692zm2.694 3.585l2.526-.937-1.9 2.471-2.861.977 2.235-2.511zm-2.093 3.159l2.929-1 3.045.896-2.622.837-3.352-.733zm3.28 5.212l.392-3.896 3.111-.982.082 3.31-3.585 1.568zm3.691-5.708l-3.498-1.03 2.226-2.892 3.335 1.126-2.063 2.796zm2.266 7.191l-1.711-2.934-.066-2.771 1.777 2.597v3.108zm-1.73-6.8L12 12.532l2.063 2.799L12 18.336l-2.062-3.005zm4.104 3.866l-1.715 2.934v-3.107l1.782-2.597-.067 2.77zm-1.514-7.052l3.341-1.126 2.221 2.892-3.499 1.03-2.063-2.796zm2.175 6.935l.077-3.31 3.116.982.386 3.901-3.579-1.573zm3.514-2.912l-2.625-.837 3.049-.896 2.928 1.003-3.352.73z\"/></svg>"


    function toggleSettings() {
        console.log("toggleSettings")

        setState({...state, settingHidden: !state.settingHidden});
    }

    function settingBtnLocation() {
        const settingBtn = document.getElementById("settingButton");
        return settingBtn.getBoundingClientRect();
    }

    function renderAssumptions() {
        const queryResult = state.queryResult;
        console.log("query result", queryResult)
        const query = queryResult.inputstring;
        if (queryResult.success === false) return
        let assumptionRender = null;

        const simpleTypes = ["Clash", "MultiClash", "SubCategory", "SubCategory", "Attribute"
            , "Unit", "AngleUnit", "Function", "TimeAMOrPM", "DateOrder",
            "MortalityYearDOB", "ListOrTimes", "ListOrNumber", "CoordinateSystem",
            "I", "NumberBase", "MixedFraction", "TideStation"]
        if (queryResult.assumptions) {
            if (Array.isArray(queryResult.assumptions)) {
                const assumptionArray = queryResult.assumptions;
                console.log("assumption array", assumptionArray)
                assumptionRender = assumptionArray.map((assumptions, index) => {
                    const type = assumptions.type;
                    console.log(assumptions)
                    if (simpleTypes.includes(type)) {
                        const descriptions = assumptions.values.map((assumption) => assumption.desc);
                        const inputs = assumptions.values.map((assumption) => assumption.input);
                        const selectedData = descriptions.map((description, index) => ({
                                label: description,
                                input: inputs[index],
                                key: index,
                            })
                        )
                        return (
                            <p><Text>
                                Assumption {query} is {selectedData[0].label}
                                . Other possible assuption is
                                <Select data={selectedData.splice(1)}
                                        onSelect={(selected) => {
                                            sendQueryToBackGround(query, selected.input)
                                        }
                                        }
                                        filter={true}
                                        label={selectedData[0].label}
                                />
                            </Text></p>
                        )


                    }
                })
            } else if (queryResult.assumptions.values !== undefined) {
                const assumptions = queryResult.assumptions.values;
                const descriptions = assumptions.map((assumption) => assumption.desc);
                const inputs = assumptions.map((assumption) => assumption.input);
                const selectedData = descriptions.map((description, index) => ({
                    label: description,
                    input: inputs[index],
                    key: index,
                }))
                assumptionRender = (
                    <Text>
                        Assumption {query} is <Select
                        data={selectedData}
                        filter={true}
                        label={selectedData[0].label}
                    />
                    </Text>)
            }
        }
        return (
            <div>
                {assumptionRender && assumptionRender
                }
            </div>
        )


    }

    return (
        <div>
            <Draggable onStart={onDragStart} onStop={onDragStop}>

                <Button style={{
                    position: "fixed",
                    bottom: 0,
                    right: 0,
                    zIndex: 9999,
                    display: state.dashBoardHidden ? "block" : "none"
                }}
                >
                    Click me</Button>
            </Draggable>
            <Sidebar
                defaultCollapsed={true}
                collapsedWidth={0}
                width={"50%"}
                // white
                backgroundColor={"#ffffff"}
                style={{
                    position: "fixed",
                    bottom: "5%",
                    right: 0,
                    height: "90%",
                }}>
                <Island
                    style={{border: "none", boxShadow: "none"}}
                >
                    <Header>
                        <a title={"Huggin and Munnin"}>
                            <Logo
                                glyph={brainIcon}
                                onClick={toggle}/>


                        </a>
                        <Tray>
                            <TrayIcon title={"Wolfram Alpha"}
                                      icon={wolframIcon}
                                      onClick={() => {
                                          setState({...state, currentView: "WolframAlpha"})
                                      }
                                      }/>

                            <TrayIcon
                                title={'Hide Knowledge Dashboard'}
                                icon={collapseIcon}
                                id={"closeButton"} onClick={(e) => {
                                toggle();
                            }}>
                            </TrayIcon>
                            <TrayIcon
                                title={'Settings'}
                                icon={settingIcon}
                                onClick={(e) => {
                                    setState({...state, currentView: "Settings"});
                                }}
                                id={"settingButton"}
                            >
                            </TrayIcon>
                            <TrayIcon
                                title={'Source code'}
                                icon={starIcon}></TrayIcon>
                            <TrayIcon
                                title={'Give vote in product hunt'}
                                icon={likeIcon}></TrayIcon>
                        </Tray>

                    </Header>

                    {/*Setting view*/}
                    {state.currentView === "Settings" &&
                        <Content>
                            <Input placeholder={"Add  Wolfram api here api here"}
                                   id={"WolframApiSetting"}
                                   onKeyDown={(e) => {
                                       if (e.key === 'Enter') {
                                           setWolframKey(e.target.value);
                                       }
                                   }}
                            >

                            </Input>
                            <Button icon={checkmarkIcon} onClick={() => {
                                setWolframKey(document.getElementById("WolframApiSetting").value);
                            }}></Button>
                            <Text>{

                            }</Text>

                        </Content>
                    }

                    {state.currentView === "WolframAlpha" &&
                        <Content
                            style={{
                                backgroundColor: "rgb(0,0,0,0)", border: "none", boxShadow: "none"

                            }}
                        >
                            <Badge>Wolfram Beta</Badge>
                            <Panel>
                                <Input placeholder={"Press Enter to start searching knowledge"} size={Size.L}
                                       onKeyDown={(e) => {
                                           if (e.key === 'Enter') {
                                               sendQueryToBackGround(e.target.value)
                                           }
                                       }
                                       }

                                />
                            </Panel>
                            {/*{state.loadingResult === false ?
                                renderAssumptions() : <LoaderScreen
                                    message={"Inject Wis-doom everywhere"}/>}*/}
                            {renderAssumptions()}

                        </Content>
                    }
                </Island>
            </Sidebar>
        </div>
    )
}


