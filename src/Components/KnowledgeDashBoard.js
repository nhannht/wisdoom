/* global chrome */
// BOOKMARK import here
import {Menu, MenuItem, Sidebar, SubMenu, useProSidebar} from "react-pro-sidebar";
import Island from "@jetbrains/ring-ui/dist/island/island";
import {H3, H4} from "@jetbrains/ring-ui/dist/heading/heading";
import {useEffect, useState} from "react";
import Img from 'react-image';
import Loader from '@jetbrains/ring-ui/dist/loader/loader';
import Text from '@jetbrains/ring-ui/dist/text/text';
import '@jetbrains/icons/file-js'
import Panel from "@jetbrains/ring-ui/dist/panel/panel";
import ImageActions from "./ImageActions";
import DraggableButton from "./KnowledgeDashBoard/DraggableButton";
import 'rc-dropdown/assets/index.css';
import Link from "@jetbrains/ring-ui/dist/link/link";
import {Col, Grid, Row} from '@jetbrains/ring-ui/dist/grid/grid';
import * as PropTypes from "prop-types";
import {SettingsView} from "./SettingsView";
import {WolframAlphaSearchArea} from "./WolframAlphaSearchArea";
import {filter, uniq} from "lodash";
import Badge from "@jetbrains/ring-ui/dist/badge/badge";
import {KnowledgeDashBoardHeader} from "./KnowledgeDashBoardHeader";

SettingsView.propTypes = {
    onKeyDown: PropTypes.func,
    onClick: PropTypes.func
};


KnowledgeDashBoardHeader.propTypes = {
    onClick: PropTypes.func,
    state: PropTypes.shape({
        loadingDraggableButton: PropTypes.bool,
        currentAssumption: PropTypes.string,
        dashBoardHidden: PropTypes.bool,
        loadingResult: PropTypes.bool,
        currentQuery: PropTypes.string,
        currentView: PropTypes.string,
        queryResult: PropTypes.arrayOf(PropTypes.any),
        buttonPosition: PropTypes.shape({x: PropTypes.number, y: PropTypes.number})
    }),
    onClick1: PropTypes.func,
    onClick2: PropTypes.func
};
/**
 * @desc This is Knowledge Dashboard
 * @class KnowledgeDashBoard
 * @returns {JSX.Element}
 * @todo How to design a program
 */
export default function KnowledgeDashBoard() {


// BOOKMARK state of this file
    /**
     * @desc state of this file
     */
    const [state, setState] = useState({
        currentQuery: "",
        currentAssumption: "",
        queryResult: [],
        dashBoardHidden: true,
        buttonPosition: {x: 0, y: 0},
        currentView: 'WolframAlpha',
        loadingDraggableButton: false,
        loadingResult: false,
    });
    const [isUsingDemoApi, setIsUsingDemoApi] = useState(undefined);
    chrome.storage.sync.get("wolframApi", (result) => {
        if (result.wolframApi === 'DEMO') {
            setIsUsingDemoApi(true);
        } else {
            setIsUsingDemoApi(false);
        }
    })
    const [currentPageReadability, setCurrentPageReadability] = useState(undefined);
    const [extensionEntities, setExtensionEntities] = useState(undefined);
    window.onload = () => {
        /*console.log("page is fully loaded")
        const clonedDocument = document.cloneNode(true)
        const pageReadability = new Readability(clonedDocument).parse()
        console.log("pageReadability", pageReadability.textContent)
        if (currentPageReadability !== pageReadability) {
            setCurrentPageReadability(pageReadability)
        }*/
    }

    useEffect(() => {
        chrome.runtime.sendMessage({textRazorEntitiesQuery: currentPageReadability?.textContent}, (result) => {
            const entities = result.response.entities
            const highConfidenceAndRelevanceEntities = filter(entities, (entity) => entity.confidenceScore > 5.0 && entity.relevanceScore > 0.9)
            const uniqueEntitiesId = uniq(highConfidenceAndRelevanceEntities.map((entity) => entity.entityId))
            setExtensionEntities(uniqueEntitiesId)
        })
    }, [currentPageReadability])

    const renderEntities = () => {
        if (extensionEntities) {
            return extensionEntities.map(entity => {
                return (<Badge valid
                               style={{cursor: 'pointer'}}
                               onClick={() => {
                                   sendQueryToBackGround(entity, undefined, undefined, undefined)
                               }}
                >{entity}</Badge>)
            })
        }
    }
    /**
     * @desc state of React-Pro-Sidebar
     */
    const {collapseSidebar, toggleSidebar, collapsed} = useProSidebar();
    // Fetch wolfram api in background and set to this component stage
    // Set wolfram api in background when this component state change


    /**
     * @function
     * @desc Toggle sidebar
     */
    function toggleSideBar() {
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


    /**
     * @function
     * @param query
     * @param assumption
     * @param reinterpret
     * @param podstate
     */
    function sendQueryToBackGround(query,
                                   assumption,
                                   reinterpret,
                                   podstate = ""
    ) {
        // console.log("currentAssumption is",state.currentAssumption)
        setState(prevState => ({...prevState, currentQuery: query}));
        setState(prevState => ({...prevState, loadingResult: true}));
        if (assumption !== undefined) {
            setState(prevState => ({...prevState, currentAssumption: assumption}));
        }
        // If query is change, assumption simply get reset, at least in our case
        chrome.runtime.sendMessage({
            freeStyleQuery: query,
            assumption: assumption,
            reinterpret: reinterpret,
            podstate: podstate
        }, (response) => {
            setState(prevState => ({...prevState, queryResult: response.queryresult}));
            setState(prevState => ({...prevState, loadingResult: false}));
        });
    }

    /**
     * @function
     * @param e
     */
    function onDragStart(e) {
        setState({...state, buttonPosition: {x: e.screenX, y: e.screenY}});
    }

    /**
     * @function
     * @param e
     */
    function onDragStop(e) {
        const dragX = Math.abs(e.screenX - state.buttonPosition.x);
        const dragY = Math.abs(e.screenY - state.buttonPosition.y);
        // console.log(dragX,dragY)
        if (dragX > 5 || dragY > 5) {
            e.stopPropagation();
        } else {
            toggleSideBar();
        }

    }

    /**
     * Set wolfram key
     * @function
     * @param key
     */


    // DONE render podstate
    /**
     * @function
     * @returns {*}
     */
    function renderPods() {
        const queryResult = state.queryResult;
        if (queryResult.success === false) return;
        const query = queryResult.inputstring;
        const pods = queryResult.pods;
        let renderPods = null;
        if (queryResult.pods === undefined) return;
        renderPods = pods.map((pod, index) => {
            let renderStates;
            // DONE render states
            if (pod.states) {
                const statesArray = [];
                for (let i = 0; i < pod.states.length; i++) {
                    if (pod.states[i].states) {
                        for (let j = 0; j < pod.states[i].states.length; j++) {
                            statesArray.push(pod.states[i].states[j]);
                        }
                    } else {
                        statesArray.push(pod.states[i]);
                    }
                }
                renderStates = statesArray.map((state_, index) => {
                    const podStateInput = state_.input;
                    const podStateName = state_.name;
                    return (
                        <span>
                            {index > 0 && ", "}
                            <Link
                                onClick={() => {
                                    sendQueryToBackGround(query,
                                        state.currentAssumption,
                                        true, podStateInput)
                                }
                                }
                            >{podStateName}</Link></span>
                    )
                })
            }
            /**
             * @function
             */
            const subpodRender = pod.subpods.map((subpod, index) => {
                const subpodTitle = subpod.title;
                const subpodImage = subpod.img.src;
                const height = subpod.img.height;
                const width = subpod.img.width;
                let renderSubpodStates;

                if (subpod.states) {
                    const subpodStatesArray = [];
                    for (let i = 0; i < subpod.states.length; i++) {
                        if (subpod.states[i].states) {
                            for (let j = 0; j < subpod.states[i].states.length; j++) {
                                subpodStatesArray.push(subpod.states[i].states[j]);
                            }
                        } else {
                            subpodStatesArray.push(subpod.states[i]);
                        }
                    }

                    renderSubpodStates = subpodStatesArray.map((state_, index) => {
                        const subpodStateInput = state_.input;
                        const subpodStateName = state_.name;
                        return (
                            <span>
                                {index > 0 && ", "}
                                <Link
                                    onClick={() => {
                                        sendQueryToBackGround(query,
                                            state.currentAssumption,
                                            true, subpodStateInput)
                                    }
                                    }
                                >{subpodStateName}</Link></span>
                        )
                    })
                }
                return (

                    <Grid>

                        <Row>
                            <Col>
                                <Row><H4 key={index}>
                                    {subpodTitle}
                                </H4></Row>
                                {subpod.states && <Text>Other states: {renderSubpodStates}</Text>}
                                {/*TODO make those image ease in out*/}
                                <Row><Img src={subpodImage}
                                          height={height}
                                          width={width}
                                          key={subpodImage}
                                          loader={<Loader/>}
                                          unloader={<Text>Image not found</Text>}
                                          style={{animation: "slideIn 1s forwards"}}
                                /></Row>
                            </Col>
                            <Col xs={12}>
                                <Row end={"xs"}>
                                    <Col xs={6}><ImageActions subpod={subpod}/></Col>
                                </Row>
                            </Col>
                        </Row></Grid>
                )
            })
            return (
                <Panel
                    key={index}>
                    <H3>
                        <Text>{pod.title}</Text>
                    </H3>
                    {pod.states && <Text>Other states: {renderStates}</Text>}
                    {subpodRender}
                </Panel>
            )
        })
        return renderPods;


    }

    /*

     */
    /**
     * @function
     */
    function renderAssumptions() {
        const queryResult = state.queryResult;
        // console.log("query result", queryResult)
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
                assumptionRender = assumptionArray.map((assumptions, index) => {
                    const type = assumptions.type;
                    // console.log(assumptions)
                    if (simpleTypes.includes(type)) {
                        const descriptions = assumptions.values.map((assumption) => assumption.desc);
                        const inputs = assumptions.values.map((assumption) => assumption.input);
                        const selectedData = descriptions.map((description, index) => ({
                                label: description,
                                input: inputs[index],
                                key: index,
                            })
                        )
                        const menuItemRender = selectedData.splice(1).map((data) => {
                            return (
                                <MenuItem key={data.key}
                                          onClick={() => {
                                              sendQueryToBackGround(query, data.input)
                                          }}>
                                    {data.label}
                                </MenuItem>
                            )
                        })
                        return (
                            <p>
                                Assuming <Link>{selectedData[0].label}</Link>, other assumptions
                                <Menu
                                    closeOnClick={true}
                                >
                                    <SubMenu label={type}>
                                        {menuItemRender}
                                    </SubMenu>

                                </Menu>
                            </p>
                        )


                    }
                })
            } else if (queryResult.assumptions.values !== undefined) {
                const assumptions = queryResult.assumptions.values;
                const assumptionsType = queryResult.assumptions.type;
                const descriptions = assumptions.map((assumption) => assumption.desc);
                const inputs = assumptions.map((assumption) => assumption.input);
                const selectedData = descriptions.map((description, index) => ({
                    label: description,
                    input: inputs[index],
                    key: index,
                }))
                const menuItemRender = selectedData.splice(1).map((data) => {
                    return (
                        <MenuItem

                            key={data.key}
                            onClick={() => {
                                sendQueryToBackGround(query, data.input)
                            }}>
                            {data.label}
                        </MenuItem>
                    )
                })
                assumptionRender = (
                    <p>
                        Assuming <Link>{selectedData[0].label}</Link>, other assumptions
                        <Menu
                            closeOnClick={true}
                        >

                            {menuItemRender}

                        </Menu></p>)


            }
        }
        return (
            <Panel>
                {assumptionRender}
            </Panel>
        )


    }


    /**
     *
     * @type {number}
     */
    const windowHeight = window.innerHeight;
    /**
     *
     * @type {number}
     */
    const sidebarHeightWithoutHeader = windowHeight - 64;

    return (
        <div>
            <DraggableButton
                title={"Wisdoom!!!!!"}
                onStart={onDragStart} onStop={onDragStop} state={state}/>
            {/*TODO make the header in sidebar sticky*/}
            <Sidebar
                defaultCollapsed={true}
                collapsedWidth={0}
                width={"50%"}
                // white
                backgroundColor={"#ffffff"}
                style={{
                    position: "fixed",
                    bottom: 0,
                    right: 0,
                    height: sidebarHeightWithoutHeader,
                    // set right border visible
                    border: "1px solid #e0e0e0",
                }}>
                <Island
                    style={{
                        position: "sticky",
                        border: "none", boxShadow: "none",
                    }}
                >
                    {/*How to make this header sticky*/}
                    <KnowledgeDashBoardHeader onClick={() => {
                        toggleSideBar()
                    }} state={state} onClick1={() => {
                        setState({...state, currentView: "WolframAlpha"})
                    }} onClick2={(e) => {
                        setState({...state, currentView: "Settings"});
                    }}/>

                    {isUsingDemoApi && <Panel><Text>
                        Using demo api. Only some queries like "Weather" work!. Go to <Link
                        onClick={() => {
                            setState({...state, currentView: "Settings"})
                        }
                        }
                        active={false}>settings</Link> to add your own api key. Get your api key
                        from <Link
                        href={"https://developer.wolframalpha.com/portal/myapps/"}>here</Link>
                    </Text></Panel>
                    }
                    {/*Setting view*/}
                    {state.currentView === "Settings" &&
                        <SettingsView
                        />
                    }

                    {state.currentView === "WolframAlpha" &&
                        <div
                            style={{
                                marginLeft: "5%",
                                marginRight: "5%",
                                marginBottom: "5%",
                                backgroundColor: "rgb(0,0,0,0)", border: "none", boxShadow: "none"

                            }}
                        >
                            <WolframAlphaSearchArea onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    sendQueryToBackGround(e.target.value, "", true, "")
                                }
                            }} onClick={() => {
                                sendQueryToBackGround(document.getElementById("wolframQueryInput").value,
                                    "", true, "")

                            }}


                            />
                            {/*{state.loadingResult === false ?
                                renderAssumptions() : <LoaderScreen
                                    message={"Inject Wis-doom everywhere"}/>}*/}
                            {currentPageReadability &&
                                <Panel>
                                    {renderEntities()}

                                </Panel>
                            }
                            {renderAssumptions()}
                            {renderPods()}

                        </div>
                    }
                </Island>
            </Sidebar>


        </div>
    )
}


