/* global chrome */
import copyIcon from '@jetbrains/icons/copy'
import Button from '@jetbrains/ring-ui/dist/button/button';
import ButtonGroup from '@jetbrains/ring-ui/dist/button-group/button-group';
import DownloadIcon from '@jetbrains/icons/download';
import IssueIcon from '@jetbrains/icons/issue';
import ReactTooltip from 'react-tooltip';
// DONE change drop down to button group in image action
/**
 * @module
 * @component
 * @param subpod
 * @returns {JSX.Element}
 * @constructor
 */
export default  function ImageActions({subpod}){
    const subpodId = "subpod-" + subpod.img.src + "-image-actions"
    const subpodTooltipId = "subpod-" + subpod.img.src + "-image-actions"+"-tooltip"
    return (
        <p><ButtonGroup id={subpodId}
            split={true}
        >
            <Button data-tip={"Download image"} data-for={subpodTooltipId}
                    icon={DownloadIcon} onClick={async () => {
                await chrome.runtime.sendMessage({urlDownload: subpod.img.src})
            }}></Button>
            <Button data-tip={"Copy image link"} data-for={subpodTooltipId}
                    icon={copyIcon} onClick={async () => {
                await navigator.clipboard.writeText(subpod.img.src)
            }}></Button>
            <Button data-tip={"Copy image plain text"} data-for={subpodTooltipId}
                    icon={IssueIcon} onClick={async () => {
                await navigator.clipboard.writeText(subpod.plaintext)
            }}> </Button>
        </ButtonGroup>
        <ReactTooltip
            id={subpodTooltipId}
            type={"dark"}
            place={"right"}
            effect={"solid"}
        />
        </p>


    )


}