import React from 'react';
import { Spin } from 'antd';

function Loader() {
  return (
    <div className="loader-parent">
      <Spin size="large" />
    </div>
  );
}

export default Loader;