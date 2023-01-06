/* global chrome */
import Icon from '@jetbrains/ring-ui/dist/icon/icon';
import PopupMenu from '@jetbrains/ring-ui/dist/popup-menu/popup-menu';
import copyIcon from '@jetbrains/icons/copy'
import Dropdown from '@jetbrains/ring-ui/dist/dropdown/dropdown';
export default function ImageMenuDropDown({subpod}){
    return (<Dropdown anchor={
                                        <Icon glyph={copyIcon} />
                                    } style={{float: 'right'}}>
                                        <PopupMenu closeOnSelect
                                                   data={[{label: 'Copy Image Url'},
                                                       {label: 'Save Image'},
                                                       {label: 'Copy Text'},
                                                   ]}
                                                   onSelect={async event => {
                                                       console.log(subpod)
                                                       if (event.label === 'Save Image') {
                                                              await chrome.runtime.sendMessage({urlDownload: subpod.img.src})

                                                       }
                                                       if (event.label === 'Copy Text') {
                                                           await navigator.clipboard.writeText(subpod.plaintext);
                                                       }
                                                       if (event.label === 'Copy Image Url') {
                                                           await navigator.clipboard.writeText(subpod.img.src);
                                                       }

                                                   }}

                                        />


                                    </Dropdown>)

}