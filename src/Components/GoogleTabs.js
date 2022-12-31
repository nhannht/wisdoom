// import Header from '@jetbrains/ring-ui/dist/header/header';
// import Text from '@jetbrains/ring-ui/dist/text/text';
import Dropdown from '@jetbrains/ring-ui/dist/dropdown/dropdown';
import PopupMenu from '@jetbrains/ring-ui/dist/popup-menu/popup-menu';
import Header from '@jetbrains/ring-ui/dist/header/header';
import Text from '@jetbrains/ring-ui/dist/text/text';
import Button from '@jetbrains/ring-ui/dist/button/button';
import {useState} from "react";
import {Grid, Row, Col} from '@jetbrains/ring-ui/dist/grid/grid';
import Img from 'react-image';
import Island from "@jetbrains/ring-ui/dist/island/island";
import AdaptiveIsland from "@jetbrains/ring-ui/dist/island/island";
import Content from "@jetbrains/ring-ui/dist/island/content";
import Loader from '@jetbrains/ring-ui/dist/loader/loader';


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
                    <Dropdown anchor={<Button key='dropdown' data-test='button-dropdown' {...{['dropdown']: true}} >
                        {truncate(selected.title, 15)}
                    </Button>}>
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
                <Col xs={8}>
                    <AdaptiveIsland>
                        <Header>
                            <Text>{selected.title}</Text>
                        </Header>
                        <Content>{selected.content.map((subpod, index) => {
                            return (
                                <div key={index}>
                                    <Img src={subpod.subpodUrl}
                                    loader={<Loader/>}
                                         key={subpod.subpodUrl}
                                    />
                                </div>
                            )
                        })}</Content>
                    </AdaptiveIsland>

                </Col>
            </Row>
        </Grid>
    );

}