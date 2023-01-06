import Draggable from "react-draggable";
import Button from "@jetbrains/ring-ui/dist/button/button";
import Icon from "@jetbrains/ring-ui/dist/icon/icon";
import experimentIcon from '@jetbrains/icons/experiment-20px';
import ReactTooltip from 'react-tooltip'
import {ThemeProvider} from '@jetbrains/ring-ui/dist/global/theme'
import Theme from "@jetbrains/ring-ui/dist/global/theme";
import LoaderInline from '@jetbrains/ring-ui/dist/loader-inline/loader-inline';

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
                    style={{
                        position: "fixed",
                        display: props.state.dashBoardHidden ? "block" : "none"
                    }}
                    icon={experimentIcon}
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
                <ReactTooltip place={"top"} effect={"solid"}/>
                </div>

        </Draggable>)
        ;
}
