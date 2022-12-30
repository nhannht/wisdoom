import '@jetbrains/ring-ui/dist/style.css';

import alertService from '@jetbrains/ring-ui/dist/alert-service/alert-service';
import Button from '@jetbrains/ring-ui/dist/button/button';

export const Demo = () => {
  return (
    <Button onClick={() => alertService.successMessage('Hello world')}>
      Click me
    </Button>
  );
};