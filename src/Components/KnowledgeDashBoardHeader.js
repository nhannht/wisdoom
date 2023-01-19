import collapseIcon from "@jetbrains/icons/collapse";
import ReactTooltip from "react-tooltip";
import WolframIcon from "@jetbrains/icons/asterisk";
import settingIcon from "@jetbrains/icons/settings";
import starIcon from "@jetbrains/icons/star-empty";
import likeIcon from "@jetbrains/icons/vote-empty";
import Header, {Tray, TrayIcon} from "@jetbrains/ring-ui/dist/header/header";
import ButtonGroup from "@jetbrains/ring-ui/dist/button-group/button-group";
import Button from "@jetbrains/ring-ui/dist/button/button";
import LoaderInline from "@jetbrains/ring-ui/dist/loader-inline/loader-inline";
import Text from "@jetbrains/ring-ui/dist/text/text";
import warningIcon from "@jetbrains/icons/warning";
import gitIcon from "@jetbrains/icons/git";
import helpIcon from "@jetbrains/icons/help";
import newGithubIssueUrl from 'new-github-issue-url';

export function KnowledgeDashBoardHeader(props) {
    function createIssueUrl() {
        return newGithubIssueUrl({
                user: 'nhannht',
                repo: 'wisdoom',
                body: `I know wisdoom never get wrong, but:\n`,
                labels: ['bug'],
                title: `[BUG]: `
            }
        )
    }

    return <Header
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
                icon={collapseIcon} onClick={props.onClick}></Button>
            <ReactTooltip id={"collapse-tooltip"} place={"bottom"} effect={"solid"}></ReactTooltip>
        </ButtonGroup>
        <Text>
            <LoaderInline
                style={{
                    display: props.state.loadingResult ? "inline-block" : "none",
                    top: "4px"

                }}
            />
        </Text>
        <Tray>
            <TrayIcon
                icon={WolframIcon}
                data-tip={"Wolfram Alpha"}
                data-for={"wolfram-alpha-tooltip"}
                onClick={props.onClick1
                }/>
            <ReactTooltip id={"wolfram-alpha-tooltip"} place={"bottom"} effect={"solid"}></ReactTooltip>

            <TrayIcon
                icon={settingIcon}
                data-tip={"Settings"}
                data-for={"settings-tooltip"}
                onClick={props.onClick2}
                id={"settingButton"}
            >
            </TrayIcon>
            <ReactTooltip id={"settings-tooltip"} place={"bottom"} effect={"solid"}></ReactTooltip>
            <TrayIcon
                href={"https://github.com/nhannht/wisdoom"}
                data-tip={"Source code"}
                data-for={"source-code-tooltip"}
                icon={gitIcon}></TrayIcon>
            <ReactTooltip id={"source-code-tooltip"} place={"bottom"} effect={"solid"}></ReactTooltip>
            <TrayIcon
                href={createIssueUrl()}
                data-tip={"Issues Tooltip"}
                data-for={"create-issue-tooltip"}
                icon={warningIcon}
            ></TrayIcon>

            <ReactTooltip id={"create-issue-tooltip"} place={"bottom"} effect={"solid"}></ReactTooltip>
            <TrayIcon
                icon={helpIcon}
                data-tip={"Help"}
                data-for={"help-tooltip"}
                onClick={props.onClick3}
            ></TrayIcon>
            <ReactTooltip id={"help-tooltip"} place={"bottom"} effect={"solid"}></ReactTooltip>
        </Tray>

    </Header>;
}