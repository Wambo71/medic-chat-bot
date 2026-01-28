import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";

function Chat() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ChatSidebar />
      <ChatWindow />
    </div>
  );
}

export default Chat;
