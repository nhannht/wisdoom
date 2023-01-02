/* global chrome */
import Draggable from "react-draggable";
import Button from '@jetbrains/ring-ui/dist/button/button';
import {Sidebar, useProSidebar} from "react-pro-sidebar";
import Island from "@jetbrains/ring-ui/dist/island/island";
import Header from "@jetbrains/ring-ui/dist/header/header";
import Content from "@jetbrains/ring-ui/dist/island/content";
import Heading from "@jetbrains/ring-ui/dist/heading/heading";
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

export default function KnowledgeDashBoard() {
    const [state, setState] = useState({
        pods: [],
        dashBoardHidden: true,
        buttonPosition: {x: 0, y: 0},
        settingHidden: true,
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

    function listPods(json) {
        const listPods = json.queryresult.pods.map((pod) => {
            const title = pod.title;
            const id = pod.id.replace(/:/g, '_');
            const subpodContent = pod.subpods.map(subpod => {
                    const url = subpod.img.src;
                    const text = subpod.plaintext;
                    return {subpodUrl: url, subpodText: text};
                }
            )
            return {
                title: title,
                id: id,
                content: subpodContent
            }
        });
        return listPods;

    }

    function sendQueryToBackGround(query) {
        chrome.runtime.sendMessage({freeStyleQuery: query}, function (response) {
            const data = JSON.parse(response.result);
            setState({pods: listPods(data)});
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

    const ICONURL = "<!-- Uploaded to: SVG Repo, www.svgrepo.com, Transformed by: SVG Repo Mixer Tools -->\n" +
        "<svg width=\"800px\" height=\"800px\" viewBox=\"-20 0 190 190\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
        "<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M129.49 114.51C129.121 116.961 128.187 119.293 126.762 121.322C125.337 123.351 123.461 125.021 121.28 126.2C120.676 126.535 120.043 126.816 119.39 127.04C120.22 138.04 102.74 142.04 93.32 139.42L96.82 151.66L87.82 151.98L72.07 129.43C66.76 130.93 60.49 131.65 56.44 125.15C56.0721 124.553 55.7382 123.935 55.44 123.3C54.4098 123.51 53.3614 123.617 52.31 123.62C49.31 123.62 44.31 122.72 41.77 120.96C39.7563 119.625 38.1588 117.75 37.16 115.55C31.75 116.29 27.16 115.02 24.16 111.88C20.36 107.97 19.28 101.51 21.26 94.58C23.87 85.33 31.81 74.91 47.59 71C48.9589 69.2982 50.5972 67.8322 52.44 66.66C62.35 60.31 78.44 59.76 90.65 65.79C95.3836 64.9082 100.27 65.376 104.75 67.14C113.53 70.43 119.91 77.31 121.11 84.3C123.487 85.5317 125.433 87.4568 126.69 89.82C129.32 94.76 129.69 99.71 127.92 103.71C129.587 107.049 130.138 110.835 129.49 114.51ZM123.01 109.31C121.612 110.048 120.056 110.434 118.475 110.434C116.894 110.434 115.338 110.048 113.94 109.31L114.67 104.46C117.75 104.76 120.26 103.8 121.57 101.83C123.04 99.64 122.81 96.39 120.95 92.9C118.87 88.99 114.38 88.37 111.89 88.34H111.73C105.49 88.34 99.13 91.89 96.56 96.52L92.82 94.73C93.5553 92.3449 94.8046 90.15 96.48 88.3C95.0376 87.0754 93.9474 85.4887 93.3217 83.703C92.696 81.9173 92.5574 79.9971 92.92 78.14L96.61 77.8C96.7789 79.302 97.4 80.7172 98.3911 81.8583C99.3822 82.9994 100.697 83.8125 102.16 84.19C105.238 82.8161 108.58 82.1335 111.95 82.19C112.43 82.19 112.89 82.24 113.36 82.27C110.969 78.0312 107.18 74.7545 102.64 73C91.56 68.7 84.09 75.37 82.38 77.67C78.26 83.19 80.9 88.41 82.91 91.8L79.61 94.8C76.736 92.314 74.8075 88.9127 74.15 85.17C69.92 86.44 64.24 86.17 61.06 80.74L64.06 78.68C67.43 81.2 72.78 80.98 75.32 77.87C75.9252 76.4949 76.6905 75.1959 77.6 74C79.044 72.093 80.7864 70.4316 82.76 69.08C74.47 66.82 62.76 67.19 55.68 71.73C53.7668 72.841 52.192 74.4517 51.1244 76.3895C50.0569 78.3274 49.5368 80.5192 49.62 82.73C49.62 86.3 52.42 91.94 56.19 92.82L54 97.07C51.5946 96.5129 49.4109 95.2487 47.73 93.44L44.48 97.58L41.23 96L44.41 87.68C43.8904 86.064 43.624 84.3774 43.62 82.68C43.628 81.3361 43.7687 79.9963 44.04 78.68C34.04 82.81 29.1 89.68 27.29 95.96C25.9 100.79 26.44 105.15 28.72 107.49C30.53 109.35 33.3 109.79 35.91 109.62L42.91 104.17L45.21 106.11L43.13 112.93C44.22 116.4 47.79 118.19 54.3 116.93C54.6375 114.169 55.7272 111.554 57.45 109.37C58.7133 107.552 60.3846 106.056 62.33 105L65.75 95.79L69.17 95.64L68.8 103.19C74.55 102.6 80.98 103.77 86.97 102.87L88.07 106.87C79.29 110.93 70.3 104.31 62.15 113.04C59.22 116.18 60.34 118.91 62.15 121.66C64.76 125.59 69.66 123.23 74.67 121.66C82.26 119.34 87.77 117.66 98.16 118.51C95.68 113.8 95.92 108.11 99.24 101.85L104.13 103.78C100.7 111.69 103.91 116.27 106.13 118.29C109.56 121.41 114.72 122.35 118.13 120.47C119.436 119.749 120.559 118.737 121.412 117.513C122.265 116.289 122.825 114.885 123.05 113.41C123.275 112.051 123.258 110.663 123 109.31H123.01Z\" fill=\"#000000\"/>\n" +
        "</svg>"

    function toggleSettings() {
        console.log("toggleSettings")

        setState({...state,settingHidden: !state.settingHidden});
    }
    function settingBtnLocation(){
        const settingBtn = document.getElementById("settingButton");
        return settingBtn.getBoundingClientRect();
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
                style={{
                    position: "fixed",
                    bottom: "5%",
                    right: 0,
                    height: "90%",
                }}>
                <Island>
                    <Header>
                        <a title={"Huggin and Munnin"}>
                            <Logo
                                glyph={ICONURL}
                                onClick={toggle}/>


                        </a>
                        <Tray>
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
                                    toggleSettings();
                                }}
                                id={"settingButton"}
                            >
                                {<Popup
                                    style={{zIndex: 10000}}
                                    hidden={state.settingHidden}
                                    onCloseAttempt={
                                        (e) => {
                                            // if cursor is in setting button, dont occur, else close this popup
                                            const btnLocation = settingBtnLocation();
                                            if (e.clientX < btnLocation.left || e.clientX > btnLocation.right || e.clientY < btnLocation.top || e.clientY > btnLocation.bottom) {
                                                setState({...state, settingHidden: true});
                                            }
                                        }

                                    }
                                >
                                    <Island>
                                        <Heading level={3}>Settings</Heading>
                                        <Content>
                                            <div>
                                                Hello world
                                            </div>
                                        </Content>
                                    </Island>
                                </Popup>}
                            </TrayIcon>
                            <TrayIcon
                                title={'Source code'}
                                icon={starIcon}></TrayIcon>
                            <TrayIcon
                                title={'Give vote in product hunt'}
                                icon={likeIcon}></TrayIcon>
                        </Tray>
                    </Header>

                    <Content
                    style={{height: "100%"}}
                    >
                        <Input placeholder={"Press Enter to start searching knowledge"} size={Size.L}
                               onKeyDown={(e) => {
                                   if (e.key === 'Enter') {
                                       sendQueryToBackGround(e.target.value)
                                   }
                               }
                               }
                        />
                        {state.pods.map((pod) => {
                            return (
                                <div key={pod.id}>
                                    <Heading>{pod.title}</Heading>
                                    {pod.content.map((subpod) => {
                                        return (
                                            <div key={subpod.subpodUrl}>
                                                <Img src={subpod.subpodUrl}
                                                     loader={<Loader/>}
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </Content>
                </Island></Sidebar>
        </div>
    )
}


