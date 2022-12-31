// import island, content
import '@jetbrains/ring-ui/dist/style.css';
import Island from "@jetbrains/ring-ui/dist/island/island";
import Content from "@jetbrains/ring-ui/dist/island/content";
import alertService from '@jetbrains/ring-ui/dist/alert-service/alert-service';
import Button from '@jetbrains/ring-ui/dist/button/button';
import ContentLayout from '@jetbrains/ring-ui/dist/content-layout/content-layout';
import {useState} from "react";

export function Demo  ({content})  {
    const [text, setText] = useState(content);
  return (
    <Island>
        <ContentLayout>
            <Content>
            <Button onClick={() => alertService.successMessage(content)}>Click me</Button>

        </Content></ContentLayout>
    </Island>
  );
};