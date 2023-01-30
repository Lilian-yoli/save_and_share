import ChatSidebar from "../../components/Chat/ChatSidebar.component";
import ChatRecords from "../../components/Chat/ChatRecords.component";
import ChatInput from "../../components/Chat/ChatInput.component";
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { userContext } from "../../contexts/userContext";
import { GET } from "../../utils/API";
import { useChatStore } from "../../stores/chatStore";
import io from "socket.io-client";
const socket = io.connect("http://54.248.36.249");

const ChatPage = () => {
  const { currentUser, setCurrentUser } = useContext(userContext);
  const [chatList, setChatList] = useState([]);
  const chatStore = useChatStore((state) => state.shareLauncher);
  const [chatWith, setChatWith] = useState(chatStore.shareLauncher);

  useEffect(() => {
    console.log('heello', socket.id)
    connectSocket();

    async function connectSocket() {
      if (currentUser.id) {
        socket.emit('click-inbox', currentUser.id);
      } else {
        const user = await getUserInfo();
        setCurrentUser({ ...currentUser, id: user.id })
        socket.emit('click-inbox', user.id)
      }
    }

    async function getUserInfo() {
      const { data: { data } } = await GET('/user/get-my-info');
      return data;
    }
  }, [currentUser.id]);

  // sidebar 
  useEffect(() => {
    async function getChatList() {
      const { data: { data } } = await GET('/chat/get-chat-user-list');
      const { chatted_users } = data;
      setChatList(chatted_users);
    };

    getChatList();
  }, []);

  useEffect(() => {
    function getChatUser(chatList) {
      if (chatWith || !chatList.length) {
        return;
      };
      const { sender_id, receiver_id } = chatList[chatList.length - 1];
      if (sender_id === currentUser.id) {
        setChatWith(receiver_id)
      } else {
        setChatWith(sender_id);
      }
    };

    getChatUser(chatList);
  }, [chatList])




  return (
    <PageWrapper>
      <ChatSidebar chattedUsers={chatList} currentUser={currentUser} chatWith={chatWith} setChatWith={setChatWith} />
      <div style={{ width: '75%' }}>
        <MainContent>
          <ChatRecords socket={socket} theOtherUserId={chatWith} currentUserId={currentUser.id} />
        </MainContent>
        <ChatInput socket={socket} sender_id={currentUser.id} receiver_id={chatWith} />
      </div>
    </PageWrapper>
  )
}

const PageWrapper = styled.main`
  display: flex;
`

const MainContent = styled.div`
  height: calc(100vh - 131px);
  overflow-y: scroll;
  padding: 15px 25px;
`

export default ChatPage;