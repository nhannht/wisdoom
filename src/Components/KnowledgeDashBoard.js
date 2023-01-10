/* global chrome */
// BOOKMARK import here
import Button from '@jetbrains/ring-ui/dist/button/button';
import {Sidebar, useProSidebar} from "react-pro-sidebar";
import Island from "@jetbrains/ring-ui/dist/island/island";
import Header from "@jetbrains/ring-ui/dist/header/header";
import Content from "@jetbrains/ring-ui/dist/island/content";
import {H3, H4} from "@jetbrains/ring-ui/dist/heading/heading";
import {Input, Size} from "@jetbrains/ring-ui/dist/input/input";
import {useState} from "react";
import Img from 'react-image';
import Loader from '@jetbrains/ring-ui/dist/loader/loader';
import Tray from "@jetbrains/ring-ui/dist/header/tray";
import TrayIcon from '@jetbrains/ring-ui/dist/header/tray-icon';
import settingIcon from '@jetbrains/icons/settings';
import collapseIcon from '@jetbrains/icons/collapse';
import starIcon from '@jetbrains/icons/star-empty';
import likeIcon from '@jetbrains/icons/vote-empty';
import Text from '@jetbrains/ring-ui/dist/text/text';
import '@jetbrains/icons/file-js'
import alertService from '@jetbrains/ring-ui/dist/alert-service/alert-service';
import checkmarkIcon from '@jetbrains/icons/checkmark';
import Panel from "@jetbrains/ring-ui/dist/panel/panel";
import ImageActions from "./ImageActions";
import DraggableButton from "./KnowledgeDashBoard/DraggableButton";
import 'rc-dropdown/assets/index.css';
import {Menu, MenuItem, SubMenu} from 'react-pro-sidebar';
import Link from "@jetbrains/ring-ui/dist/link/link";
import {Grid, Row, Col} from '@jetbrains/ring-ui/dist/grid/grid';
import SearchIcon from '@jetbrains/icons/search';
import WolframIcon from '@jetbrains/icons/asterisk';
import ButtonGroup from '@jetbrains/ring-ui/dist/button-group/button-group';
import ReactTooltip from "react-tooltip";
import LoaderInline from "@jetbrains/ring-ui/dist/loader-inline/loader-inline";
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
// };
/**
 * @desc This is Knowledge Dashboard
 * @module KnowledgeDashBoard
 * @returns {JSX.Element}
 * @constructor
 * @export module:KnowledgeDashBoard
 * @todo How to design a program
 */
export default function KnowledgeDashBoard() {
// BOOKMARK state of this file
    const [state, setState] = useState({
        currentQuery: "",
        currentAssumption: "",
        queryResult: [],
        dashBoardHidden: true,
        buttonPosition: {x: 0, y: 0},
        settingHidden: true,
        currentView: 'WolframAlpha',
        loadingDraggableButton: false,
        loadingResult: false,
    });

    const {collapseSidebar, toggleSidebar, collapsed} = useProSidebar();

    /**
     * @module KnowledgeDashBoard
     * @function toggleSideBar
     * Toggle sidebar
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
     * @module Components/KnowledgeDashBoard
     * @function sendQueryToBackGround
     * @param query
     * @param assumption
     * @param reinterpret
     * @param podstate
     */
    function sendQueryToBackGround(query,
                                   assumption ,
                                   reinterpret ,
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
     *
     * @method onDragStart
     * @param e
     */
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
            toggleSideBar();
        }

    }

    /**
     * Set wolfram key
     * @param key
     */
    function setWolframKey(key) {
        chrome.storage.sync.set({apiKey: key}, function () {
            // console.log('Wolfram is set to ' + key);
        })
        alertService.successMessage('Wolfram is set to ' + key);
    }

    // DONE render podstate
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

                    <Grid><Row>
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

    const windowHeight = window.innerHeight;
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
                    <Header
                        style={{
                            position: "fixed", top: 0,
                            width: "50%",
                            display: "flex",
                            zIndex: 1000000
                        }}
                    >
                        <ButtonGroup
                            split={true}
                        >
                            <Button
                                id={"closeButton"}
                                data-tip={"Collapse"}
                                data-for={"collapse-tooltip"}
                                style={{
                                    paddingTop: "4px",
                                    paddingLeft: "8px",
                                    paddingRight: "8px",
                                    height: "61px",
                                }}
                                icon={collapseIcon} onClick={() => {
                                toggleSideBar()
                            }}></Button>
                            <ReactTooltip id={"collapse-tooltip"} place={"bottom"} effect={"solid"}></ReactTooltip>
                            {/*<div style={{display: state.loadingResult ? "block" : "none",}}>*/}
                            {/*    <div className="ring-loader-inline"/>*/}
                            {/*</div>*/}
                        </ButtonGroup>
                        <Text><LoaderInline
                            style={{
                                display: state.loadingResult ? "inline-block" : "none",
                                top: "4px"

                            }}
                        /></Text>
                        <Tray>


                            <TrayIcon
                                icon={WolframIcon}
                                data-tip={"Wolfram Alpha"}
                                data-for={"wolfram-alpha-tooltip"}
                                onClick={() => {
                                    setState({...state, currentView: "WolframAlpha"})
                                }
                                }/>
                            <ReactTooltip id={"wolfram-alpha-tooltip"} place={"bottom"} effect={"solid"}></ReactTooltip>

                            <TrayIcon
                                icon={settingIcon}
                                data-tip={"Settings"}
                                data-for={"settings-tooltip"}
                                onClick={(e) => {
                                    setState({...state, currentView: "Settings"});
                                }}
                                id={"settingButton"}
                            >
                            </TrayIcon>
                            <ReactTooltip id={"settings-tooltip"} place={"bottom"} effect={"solid"}></ReactTooltip>
                            <TrayIcon
                                data-tip={"Source code"}
                                data-for={"source-code-tooltip"}
                                icon={starIcon}></TrayIcon>
                            <ReactTooltip id={"source-code-tooltip"} place={"bottom"} effect={"solid"}></ReactTooltip>
                            <TrayIcon
                                data-tip={"Vote"}
                                data-for={"vote-tooltip"}
                                icon={likeIcon}
                            ></TrayIcon>

                            <ReactTooltip id={"vote-tooltip"} place={"bottom"} effect={"solid"}></ReactTooltip>
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
                        <div
                            style={{
                                marginLeft: "5%",
                                marginRight: "5%",
                                marginBottom: "5%",
                                backgroundColor: "rgb(0,0,0,0)", border: "none", boxShadow: "none"

                            }}
                        >
                            <div><Grid><Row>
                                <Col>
                                    <Row start={"xs"}>
                                        {/* DONE add button and icon for this input query*/}
                                        {/*TODO quick answer when user typing*/}
                                        {/*TODO render what you mean*/}
                                        <Col><Input
                                            id={"wolframQueryInput"}
                                            placeholder={"Press Enter to start searching knowledge"} size={Size.L}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    sendQueryToBackGround(e.target.value,"",true,"")
                                                }
                                            }}
                                        /></Col>
                                        <Col>
                                            <ButtonGroup split={true}
                                                         id={"wisdoom-wolfram-search-button"}>
                                                <div>
                                                    <Button
                                                        id={"wisdoom-wolfram-search-button"}
                                                        data-for={"wisdoom-wolfram-search-button-tooltip"}
                                                        data-tip={"Search"}
                                                        icon={SearchIcon} onClick={() => {
                                                        sendQueryToBackGround(document.getElementById("wolframQueryInput").value,
                                                        "",true,"")

                                                    }}> </Button>
                                                    <ReactTooltip
                                                        id={"wisdoom-wolfram-search-button-tooltip"}
                                                        place={"top"} effect={"solid"}/>
                                                </div>


                                            </ButtonGroup></Col>
                                    </Row></Col>
                                {/*DONE Add a inline loader that remind user that the query is being processed*/}

                            </Row></Grid></div>
                            {/*{state.loadingResult === false ?
                                renderAssumptions() : <LoaderScreen
                                    message={"Inject Wis-doom everywhere"}/>}*/}
                            {renderAssumptions()}
                            {renderPods()}

                        </div>
                    }
                </Island>
            </Sidebar>


        </div>
    )
}


