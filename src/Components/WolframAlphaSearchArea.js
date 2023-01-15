/* global chrome */
import SearchIcon from "@jetbrains/icons/search";
import ReactTooltip from "react-tooltip";
import {Grid, Row, Col} from "@jetbrains/ring-ui/dist/grid/grid";
import ButtonGroup from "@jetbrains/ring-ui/dist/button-group/button-group";
import Button from "@jetbrains/ring-ui/dist/button/button";
import Input, {Size} from "@jetbrains/ring-ui/dist/input/input";
import {useEffect, useState} from "react";
import Text from "@jetbrains/ring-ui/dist/text/text";

function sendQueryForShortAnswerToBackGround(query, target) {


}

export function WolframAlphaSearchArea(props) {
    const [query, setQuery] = useState("");
    const [quickAnswer, setQuickAnswer] = useState(undefined);

    useEffect(() => {
        // after 3s
        const delayDebounceFn = setTimeout(() => {
            if (query.length > 0) {
                chrome.runtime.sendMessage({shortAnswerWolframQuery: query}, (result) => {
                    setQuickAnswer(result)
                });
            }
            // Send Axios request here
        }, 1000)

        return () => clearTimeout(delayDebounceFn)


    }, [query])
    return <div><Grid>
        <Row start={"xs"}>
            <Col>
                <Input
                    id={"wolframQueryInput"}
                    placeholder={"Eg Weather and press Enter"} size={Size.L}
                    onKeyDown={props.onKeyDown}
                    onChange={e => setQuery(e.target.value)}

                /></Col>
            <Col>
                <ButtonGroup split={true}
                             id={"wisdoom-wolfram-search-button"}>
                    <div>
                        <Button
                            id={"wisdoom-wolfram-search-button"}
                            data-for={"wisdoom-wolfram-search-button-tooltip"}
                            data-tip={"Search"}
                            icon={SearchIcon} onClick={props.onClick}> </Button>
                        <ReactTooltip
                            id={"wisdoom-wolfram-search-button-tooltip"}
                            place={"top"} effect={"solid"}/>
                    </div>


                </ButtonGroup></Col>
        </Row>
        <Row>
            {quickAnswer &&
                <Text info={true}>{quickAnswer}</Text>}
        </Row>

    </Grid></div>;
}