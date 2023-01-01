/* global chrome */
import Draggable from "react-draggable";
import Button from '@jetbrains/ring-ui/dist/button/button';
import {Sidebar} from "react-pro-sidebar";
import {useProSidebar} from "react-pro-sidebar";
import {AdaptiveIsland} from "@jetbrains/ring-ui/dist/island/island";
import Header from "@jetbrains/ring-ui/dist/header/header";
import Content from "@jetbrains/ring-ui/dist/island/content";
import Heading from "@jetbrains/ring-ui/dist/heading/heading";
import Text from "@jetbrains/ring-ui/dist/text/text";
import {Input, Size} from "@jetbrains/ring-ui/dist/input/input";
import {useState} from "react";
import Img from 'react-image';
import Loader from '@jetbrains/ring-ui/dist/loader/loader';
import Popup from '@jetbrains/ring-ui/dist/popup/popup';

export default function KnowledgeDashBoard() {
    const [state, setState] = useState({pods: []});

    const {collapseSidebar, toggleSidebar, collapsed, toggled} = useProSidebar();

    function toggle() {
        if (collapsed) {
            toggleSidebar(true);
            collapseSidebar(false);
        } else {
            collapseSidebar(true);
            toggleSidebar(false);
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

    return (
        <div>
            <Draggable>
                <Button style={{position: "fixed", bottom: 0, right: 0, zIndex: 9999}}
                        onClick={() => {
                            console.log(toggled, collapsed)
                            toggle()
                        }}>
                    Click me</Button>
            </Draggable>
            <Sidebar
                width={"40%"}
                collapsedWidth={"0%"}
                defaultCollapsed={true}
                style={{position: "fixed", bottom: "5%", right: 0, zIndex: 9999,height:"90%"}}
            >
                <AdaptiveIsland>
                    <Header border>
                        Knowledge Dashboard
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
            </Sidebar>
        </div>
    )
}


