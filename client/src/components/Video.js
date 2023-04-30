import { useRef, useEffect } from "react"
import styled from "styled-components";

const Video = styled.video`
  width : 180px;
  height : 130px;
  display : flex;
  margin : 10px;
  
  border-radius : 30px;
`
  
export default ({stream, id}) => {
    const refvideo = useRef(null)
    useEffect(() => {
        if(stream){
          refvideo.current.srcObject = stream
        }
    },[stream])
    return(
      <Video ref={refvideo} id={id} autoPlay muted playsInline />
    );
  }