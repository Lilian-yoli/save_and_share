import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import styled from "styled-components";
import { GET } from "../../utils/API";

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;

  .content {
    margin-left: 12px;

    .user-name {
      font-size: 13px;
      font-weight: 600;
    }
  }
`

const ChatRecords = ({ socket, theOtherUserId }) => {
  const [historyList, setHistoryList] = useState([]);
  const [msgList, setMsgList] = useState([]);
  const [data, setData] = useState({});

  socket.on('receiveMsg', newMsg => {
    setMsgList([...msgList, newMsg]);
  });

  useEffect(() => {
    async function getChatHistory() {
      if (!theOtherUserId) return;
      const { data: { data } } = await GET('/chat/get-chat-records', { params: { theOtherUserId } });
      const { chat_records } = data;
      setHistoryList(chat_records);
      setData(data);
    }
    setMsgList([]);
    getChatHistory();
  }, [theOtherUserId]);


  function getSenderName(value) {
    const key = Object.keys(data).find(key => data[key] === value);
    const senderName = key === 'my_user_id' ? data['my_username'] : data['other_user_name'];
    return senderName;
  }

  return (
    <section>
      <div className="history">
        {historyList.length > 0 && historyList.map((item, index) => {
          return (<Row key={index} className="user">
            <div className="avatar">
              <Avatar sx={{ bgcolor: "#6218fa", width: 30, height: 30 }}></Avatar>
            </div>
            <div className="content">
              <span className="user-name">{getSenderName(item.sender_id)}</span>
              <p className="messages">{item.message}</p>
            </div>
          </Row>)
        })}
      </div>

      <div className="current">
        {msgList.length > 0 && msgList.map((item, index) => {
          return (<Row key={index} className="user">
            <div className="avatar">
              <Avatar sx={{ bgcolor: "#6218fa", width: 30, height: 30 }}></Avatar>
            </div>
            <div className="content">
              <span className="user-name">{getSenderName(item.sender_id)}</span>
              <p className="messages">{item.message}</p>
            </div>
          </Row>)
        })
        }
      </div>
    </section>
  )
};

export default ChatRecords;