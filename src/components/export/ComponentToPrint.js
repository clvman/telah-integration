import React, { useState, useEffect, useRef } from 'react';
import { Table } from 'antd';
import 'antd/dist/antd.css';

export const ComponentToPrint = React.forwardRef((props, ref) => {
    // useEffect = (() => {
    //     console.log('pirnt column', props.column);
    //     console.log('print data', props.data);
    // }, [props]);

    return (
      <div ref={ref} style={{paddingTop: "30px"}} id="downloadTable">
        <Table 
            dataSource={props.data} 
            columns={props.column} 
            pagination={false}
        />
      </div>
    );
  });