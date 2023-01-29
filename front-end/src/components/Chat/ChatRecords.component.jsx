import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import styled from "styled-components";
import { GET } from "../../utils/API";
import dayjs from "dayjs";


const Records = styled.section`
  section + section {
    margin-top: 25px;
  }
`

const DateGroup = styled.section`

  .date {
    font-size: 16px;
    font-weight: 700;
    line-height: 1.2;
    padding: 10px 0;
    border-bottom: 1px solid #e0e0e0;
  }
`

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 25px;

  .other-avatar {
    background-color: #285E4D;
  }

  .content {
    margin-left: 12px;

    .user-name {
      font-size: 15px;
      font-weight: 700;
    }

    time {
      margin-left: 8px;
      color: #808080;
      font-size: small;
    }
  }
`

const ChatRecords = ({ socket, theOtherUserId, currentUserId }) => {
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

      const formattedChatRecords = chat_records.reduce((result, record) => {
        const dateGroup = dayjs(record.send_at).format('MMM D, YYYY');
        if (dateGroup in result) {
          result[dateGroup] = [...result[dateGroup], record];
        } else {
          result[dateGroup] = [record];
        }
        return result;
      }, {});

      setHistoryList(formattedChatRecords);
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
    <Records>
      <div className="history">
        {Object.keys(historyList).length > 0 && Object.keys(historyList).map(group => {
          return (
            <DateGroup>
              <p className="date">{group}</p>
              {historyList[group].length > 0 && historyList[group].map((item, index) => {
                return (<Row key={index} className="user">
                  <div className="avatar">
                    <Avatar className={item.sender_id === currentUserId ? 'my-avatar' : 'other-avatar'} sx={{ bgcolor: "#6218fa", width: 30, height: 30 }}></Avatar>
                  </div>
                  <div className="content">
                    <span className="user-name">{getSenderName(item.sender_id)}</span>
                    <time>{dayjs(item.send_at).format('HH:mm A')}</time>
                    <p className="messages">{item.message}</p>
                  </div>
                </Row>)
              })}
            </DateGroup>
          )
        })
        }
      </div>

      <div className="current">
        {msgList.length > 0 && msgList.map((item, index) => {
          return (<Row key={index} className="user">
            <div className="avatar">
              <Avatar className={item.sender_id === currentUserId ? 'my-avatar' : 'other-avatar'} sx={{ bgcolor: "#6218fa", width: 30, height: 30 }}></Avatar>
            </div>
            <div className="content">
              <span className="user-name">{getSenderName(item.sender_id)}</span>
              <p className="messages">{item.message}</p>
            </div>
          </Row>)
        })
        }
      </div>
    </Records>
  )
};

export default ChatRecords;