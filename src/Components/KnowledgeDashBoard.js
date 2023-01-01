/* global chrome */
import Draggable from "react-draggable";
import Button from '@jetbrains/ring-ui/dist/button/button';
// import {Sidebar} from "react-pro-sidebar";
// import {useProSidebar} from "react-pro-sidebar";
import {AdaptiveIsland} from "@jetbrains/ring-ui/dist/island/island";
import Header from "@jetbrains/ring-ui/dist/header/header";
import Content from "@jetbrains/ring-ui/dist/island/content";
import Heading from "@jetbrains/ring-ui/dist/heading/heading";
// import Text from "@jetbrains/ring-ui/dist/text/text";
import {Input, Size} from "@jetbrains/ring-ui/dist/input/input";
import {useState} from "react";
import Img from 'react-image';
import Loader from '@jetbrains/ring-ui/dist/loader/loader';
import Popup from '@jetbrains/ring-ui/dist/popup/popup';

export default function KnowledgeDashBoard() {
    const [state, setState] = useState({
        pods: [],
        dashBoardHidden: true,
        buttonPosition: {x: 0, y: 0},
    });

    /*const {collapseSidebar, toggleSidebar, collapsed, toggled} = useProSidebar();

    function toggle() {
        if (collapsed) {
            toggleSidebar(true);
            collapseSidebar(false);
        } else {
            collapseSidebar(true);
            toggleSidebar(false);
        }
    }*/

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
    function onDragStart(e){
        setState({...state,buttonPosition: {x: e.screenX, y: e.screenY}});
    }
    function onDragStop(e){
        const dragX = Math.abs(e.screenX - state.buttonPosition.x);
        const dragY = Math.abs(e.screenY - state.buttonPosition.y);
        console.log(dragX,dragY)
        if ( dragX > 5 || dragY > 5 ) {
            e.stopPropagation();
        } else {
            setState({...state, dashBoardHidden: !state.dashBoardHidden});
        }

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
            <Popup
                style={{position: "fixed", top: 5, right: 0, zIndex: 9000}}
                hidden={state.dashBoardHidden}
                onCloseAttempt={() =>
                {
                    console.log("onCloseAttempt")
                    setState({...state, dashBoardHidden: true})}
                }
            >
                <AdaptiveIsland>
                    <Header border>
                        Knowledge Dashboard
                        <Button id={"closeButton"} onClick={(e) => {
                            setState({...state, dashBoardHidden: true})
                        }}>
                            Close</Button>
                    </Header>
                    <Content>
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
                </AdaptiveIsland>
            </Popup>
        </div>
    )
}


