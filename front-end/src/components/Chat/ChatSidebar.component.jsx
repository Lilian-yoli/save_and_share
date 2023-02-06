import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { useEffect, useState } from "react";
import { GET } from "../../utils/API";
import { useChatStore } from "../../stores/chatStore";


const ChatSidebar = ({ chattedUsers, currentUser, chatWith, setChatWith }) => {

  const [firstTimeChatUser, setFirstTimeChatUser] = useState({});
  const chatStore = useChatStore((state) => state.shareLauncher);
  const { shareLauncher } = chatStore;

  const chatList = chattedUsers.map(item => {
    if (item.sender_id === currentUser.id) {
      return { username: item.receiver_username, id: item.receiver_id };
    } else {
      return { username: item.sender_username, id: item.sender_id };
    }
  });

  const hasChatted = chattedUsers.some(item => item.sender_id === shareLauncher || item.receiver_id === shareLauncher);
  useEffect(() => {
    if (!hasChatted) {
      getFirstTimeChatUser();
    }

    async function getFirstTimeChatUser() {
      if (!chatWith) return;
      const { data: { data } } = await GET('/chat/get-chat-records', { params: { theOtherUserId: chatWith } });
      const firstTimeChatUser = getUserById(data, chatWith);
      setFirstTimeChatUser(firstTimeChatUser);
    }

    function getUserById(data, id) {
      const key = Object.keys(data).find(key => data[key] === id);
      const username = key === 'my_user_id' ? data['my_username'] : data['other_user_name'];
      return { username, id };
    };

  }, [])

  return (
    <Sidebar>
      {!hasChatted && shareLauncher !== undefined &&
        <div className={'user ' + (shareLauncher.id === chatWith ? 'clicked' : '')} onClick={() => setChatWith(firstTimeChatUser.id)}>
          <div className="user-avatar">
            <Avatar sx={{ bgcolor: "#285E4D" }}></Avatar>
          </div>
          <span className="user-name">{firstTimeChatUser.username}</span>
        </div>
      }

      {chatList.length > 0 &&
        chatList.map((chattedUser) => {
          return (
            <div className={'user ' + (chattedUser.id === chatWith ? 'clicked' : '')} key={chattedUser.username} onClick={() => setChatWith(chattedUser.id)}>
              <div className="user-avatar">
                <Avatar sx={{ bgcolor: "#285E4D" }}></Avatar>
              </div>
              <span className="user-name">{chattedUser.username}</span>
            </div>
          )
        })}
    </Sidebar >
  )
};


const Sidebar = styled.aside`
  width: 25%;
  height: calc(100vh - 81px);
  overflow-y: scroll;
  border-right: 2px solid #808080;

  .user{
    display: flex;
    align-items: center;
    padding: 15px 20px;
    background-color: #80d5d5;
    color: #272724;
    cursor: pointer;

    &-name {
      font-weight: 600;
      margin-left: 10px;
    }
  }

  .user.clicked {
    background-color: #ced9a9; 
  }
`

export default ChatSidebar;