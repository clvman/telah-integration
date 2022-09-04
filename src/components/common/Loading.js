import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Loading = (props) => (
    <div className='loading d-flex justify-content-center align-items-center'>
        <Spin tip={props.text} className="loading-text" indicator={antIcon}>
        </Spin>
    </div>
);

export default Loading;

