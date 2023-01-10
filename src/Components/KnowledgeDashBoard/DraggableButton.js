import Draggable from "react-draggable";
import Button from "@jetbrains/ring-ui/dist/button/button";
import Icon from "@jetbrains/ring-ui/dist/icon/icon";
import ReactTooltip from 'react-tooltip'
import {ThemeProvider} from '@jetbrains/ring-ui/dist/global/theme'
import Theme from "@jetbrains/ring-ui/dist/global/theme";
import LoaderInline from '@jetbrains/ring-ui/dist/loader-inline/loader-inline';
import {ReactComponent as WisdoomIcon} from '../../icons/wisdoomIcon.svg';
/**
 * @desc DraggableButton is a React component that renders a draggable button with an icon, tooltip and loader.
 * @module
 * @category KnowledgeDashBoard
 * @param props
 * @returns {JSX.Element}
 */
export default function DraggableButton(props) {
    return (
        <Draggable

            onStart={props.onStart} onStop={props.onStop}>
            <div
                style={{
                    position: 'fixed',
                     bottom: "20%", right: "20%"
                }}
            >
                <ThemeProvider theme={Theme.DARK}>
                    <Button


                    data-tip={"Knowledge DashBoard"}
                    data-for={"KnowledgeDashBoard-tooltip"}
                    style={{
                        position: "fixed",
                        display: props.state.dashBoardHidden ? "block" : "none"
                    }}
                    icon={WisdoomIcon}
                    iconSize={Icon.Size.Size64}
                >
                    <LoaderInline
                        style={{
                            display: props.state.loading ? "block" : "none",
                            position: "absolute",
                            right: 0,
                        }}

                        margin={2}/>
                </Button>
                </ThemeProvider>
                <ReactTooltip id={"KnowledgeDashBoard-tooltip"} type={"dark"}
                    place={"top"} effect={"solid"}/>
                </div>

        </Draggable>)
        ;
}
