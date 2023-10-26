import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux'


export const NodeHover = ({ x, y, content }) => {
    const [hoverBox, setHoverBox] = useState({ x: 0, y: 0, content: '' });
  
    const updateHoverBox = (x, y, content) => {
      setHoverBox({ x, y, content });
    };
  
    return (
      <div className="hoverBox" style={{ left: x, top: y }}>
        {content}
      </div>
    );
  };
