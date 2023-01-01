/* global chrome */
import Dropdown from '@jetbrains/ring-ui/dist/dropdown/dropdown';
import PopupMenu from '@jetbrains/ring-ui/dist/popup-menu/popup-menu';
import Header from '@jetbrains/ring-ui/dist/header/header';
import Text from '@jetbrains/ring-ui/dist/text/text';
import Button from '@jetbrains/ring-ui/dist/button/button';
import {useState} from "react";
import {Grid, Row, Col} from '@jetbrains/ring-ui/dist/grid/grid';
import Img from 'react-image';
import AdaptiveIsland from "@jetbrains/ring-ui/dist/island/island";
import Content from "@jetbrains/ring-ui/dist/island/content";
import Loader from '@jetbrains/ring-ui/dist/loader/loader';
import Tooltip from '@jetbrains/ring-ui/dist/tooltip/tooltip';
import Icon from '@jetbrains/ring-ui/dist/icon/icon';
import copyIcon from '@jetbrains/icons/copy';

export function GoogleTabs(props) {
    const json = props.data;

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

    const [selected, setSelected] = useState(listPods[0]);

    function findPodWithTitle(title) {
        return listPods.find(pod => pod.title === title);
    }

    function truncate(str, n) {
        return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
    }

    const podsTitle = listPods.map(pod => pod.title);
    // Render result from generateTabs
    return (
        <Grid data-test="alignment">
            <Row start="xs">
                <Col xs={2}>
                    <Dropdown anchor={
                        <Tooltip title={selected.title}>
                            <Button key='dropdown' data-test='button-dropdown' {...{['dropdown']: true}} >
                                {truncate(selected.title, 15)}
                            </Button>
                        </Tooltip>
                    }>
                        <PopupMenu closeOnSelect
                                   data={podsTitle.map(label => ({label}))}
                                   onSelect={event => {
                                       // console.log(event)
                                       const pod = findPodWithTitle(event.label);
                                       // console.log(pod)
                                       setSelected(pod);
                                       console.log(selected)
                                   }}
                        />
                    </Dropdown>
                </Col>
                <Col xs={6}>
                    <AdaptiveIsland>
                        <Header>
                            <Text>{selected.title}</Text>
                        </Header>
                        <Content>{selected.content.map((subpod, index) => {
                            return (

                                <div key={index} >
                                    <Img src={subpod.subpodUrl}
                                         loader={<Loader/>}
                                         key={subpod.subpodUrl}
                                    />
                                    <br></br>
                                    <Dropdown anchor={
                                        <Icon glyph={copyIcon} />
                                    } style={{float: 'right'}}>
                                        <PopupMenu closeOnSelect
                                                   data={[{label: 'Copy Image Url'},
                                                       {label: 'Copy Image'},
                                                       {label: 'Save Image'},
                                                       {label: 'Copy Text'},
                                                   ]}
                                                   onSelect={async event => {
                                                       if (event.label === 'Save Image') {
                                                              await chrome.runtime.sendMessage({urlDownload: subpod.subpodUrl})

                                                       }
                                                       if (event.label === 'Copy Text') {
                                                           await navigator.clipboard.writeText(subpod.subpodText);
                                                       }
                                                       if (event.label === 'Copy Image Url') {
                                                           await navigator.clipboard.writeText(subpod.subpodUrl);
                                                       }

                                                   }}

                                        />


                                    </Dropdown>

                                </div>
                            )
                        })}</Content>
                    </AdaptiveIsland>

                </Col>
            </Row>
        </Grid>
    )
        ;

}