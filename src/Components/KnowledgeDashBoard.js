/* global chrome */
import Draggable from "react-draggable";
import Button from '@jetbrains/ring-ui/dist/button/button';
import {Sidebar} from "react-pro-sidebar";
import {useProSidebar} from "react-pro-sidebar";
import Island from "@jetbrains/ring-ui/dist/island/island";
import Header from "@jetbrains/ring-ui/dist/header/header";
import Content from "@jetbrains/ring-ui/dist/island/content";
import Heading from "@jetbrains/ring-ui/dist/heading/heading";
import Text from "@jetbrains/ring-ui/dist/text/text";
import {Input, Size} from "@jetbrains/ring-ui/dist/input/input";

export default function KnowledgeDashBoard() {

    const {collapseSidebar, toggleSidebar, collapsed, toggled, broken, rtl} = useProSidebar();

    function toggle() {
        if (collapsed) {
            toggleSidebar(true);
            collapseSidebar(false);
        } else {
            collapseSidebar(true);
            toggleSidebar(false);
        }
    }

    function sendQueryToBackGround(query) {
        chrome.runtime.sendMessage({freeStyleQuery: query}, function (response) {
            console.log(response);
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
                collapsedWidth={0}
                defaultCollapsed={true}
                style={{position: "fixed", bottom: 100, right: 0, zIndex: 9999}}
            >
                <Island>
                    <Header><Heading>Knowledge DashBoard</Heading>
                        <Input placeholder={"Press Enter to start searching knowledge"} size={Size.L}
                               onKeyDown={(e) => {
                                   if (e.key === 'Enter') {
                                       sendQueryToBackGround(e.target.value)
                                   }
                               }
                               }
                        />
                    </Header>
                    <Content><Text>Knowledge DashBoard </Text></Content>
                </Island>
            </Sidebar>
        </div>
    )
}


