import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import "./NodeHover.css";

export const NodeHover = () => {
// useDispatch the trace data to display content when hovering 
  const dispatch = useDispatch();
  const [hoverBox, setHoverBox] = useState({ x: 0, y: 0, content: '' });

  const updateHoverBox = (x, y, content) => {
    setHoverBox({ x, y, content });
  };

  return (
    <div
      className="hoverBox"
      style={{ left: hoverBox.x, top: hoverBox.y }}
    >
      {hoverBox.content}
    </div>
  );
};
