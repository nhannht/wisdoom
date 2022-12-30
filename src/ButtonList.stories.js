import React from "react";
import {ButtonList} from "./ButtonList";
export default {
    title: 'ButtonList',
    component: ButtonList,

};

const Template = (args) => <ButtonList {...args} />;
export const Primary = Template.bind({});
Primary.args = {
    number: 10,
}


