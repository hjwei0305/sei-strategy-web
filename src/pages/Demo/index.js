import React from 'react';
import { Button } from 'antd';

const Demo = React.FC = () => (
    <span>
        <Button type="primary">Button</Button>
        <Button>Button</Button>
        <Button type="dashed">Button</Button>
        <Button type="danger">Button</Button>
    </span>
);

export default Demo;
