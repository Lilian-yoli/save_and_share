
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import styled from "styled-components";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const InputWrapper = styled.div`
  width: 100%;
  height: 50px;
  padding-left: 50px;
  position: relative;
  border-top: 1px solid #808080;


  input {
    width: 100%;
    height: 100%;
    border: none;
    font-size: 0.9em;


    &:focus {
      outline: none;
    }
  }


  button {
    position: absolute;
    left: 10px;
    top: 1px;
    bottom: 0;
    margin: auto;
    background-color: #fff;
    cursor: pointer;
  }
`


const ChatInput = ({ socket, sender_id, receiver_id }) => {
  const [message, setMessage] = useState('');

  const updateMsg = (e) => {
    setMessage(e.target.value);
  }

  const sendMsg = (e) => {
    e.preventDefault();

    const room = sender_id < receiver_id ? `${sender_id}&${receiver_id}room` : `${receiver_id}&${sender_id}room`;
    console.log(sender_id);

    socket.emit("sendMsg", {
      sender_id,
      receiver_id,
      message,
      room,
      send_at: dayjs.utc().format()
    })

    setMessage("");
  }

  return (
    <form onSubmit={sendMsg}>
      <InputWrapper>
        <input onChange={updateMsg} type="text" value={message} placeholder="Type..." />
        <button type="submit"><SendIcon /></button>
      </InputWrapper>
    </form>
  )
}

export default ChatInput;