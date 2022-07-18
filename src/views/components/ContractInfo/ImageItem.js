import React, { useState, useEffect, useRef } from "react";

// props - size, style, src (array)
const ImageItem = (props) => {
  let { size, style, src } = props;
  const [index, setIndex] = useState(0);
  const onError = () => {
    // console.log("error", src[index]);
    if (index + 1 < src.length) setIndex(index + 1);
  };
  return (
    <img
      src={src[index]}
      onError={() => onError()}
      width={size}
      height={size}
      style={style}
    />
  );
};
export default ImageItem;
