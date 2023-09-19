import React, { useEffect } from "react";
import ChatHeader from "../fragments/chatheader";
import ChatContent from "../fragments/chatcontent";
import ChatInputBox from "../fragments/chatinputbox";
import { Post, Message } from "../../types";
import { useCeramicContext } from "../../context";

type ChatProps = { address: string };

const Chat = ({ address }: ChatProps) => {
  const [chatMessages, setChatMessages] = React.useState<Message[]>([]);
  const clients = useCeramicContext();
  const { composeClient } = clients;


  const getMessages = async () => {
    const posts: any = await composeClient.executeQuery(`
    query {
        postsIndex (last:20) {
          edges {
            node {
              id
              author{
                id
              }
              body
              to
              created
              symKey
              chain
              accessControlConditions
              accessControlConditionType
            }
          }
        }
      }
    `);
    const messageArray: Message[] = [];
    console.log(posts.data.postsIndex.edges);
    posts.data.postsIndex.edges.forEach((el: { node: Post }) => {
      messageArray.push({
        text: el.node.body,
        sentBy: el.node.author.id.split(':')[4]!!,
        sentAt: new Date(el.node.created),
        isChatOwner: address === el.node.author.id.split(':')[4]!!,
        ...el.node
      });
    });
    setChatMessages(messageArray);
    // console.log(messages)
  };

  /** State to control new messages */

  /**
   *
   * @param message
   * "Create" a new message
   */
  const sendANewMessage = (message: Message) => {
    if(chatMessages){
      setChatMessages((chatMessages) => [...chatMessages, message]);
    }
    
  };

  /**
   * Reset chat to the default messages
   */

  useEffect(() => {
    if (localStorage.getItem("did")) {
      getMessages();
    }
  }, []);

  return (
    <div className="max-w-xxl mx-auto mt-32 w-5/6 min-h-200">
      <div className="flex flex-row justify-between items-center py-2"></div>
      <div className="bg-white border border-gray-200 rounded-lg shadow relative">
        <ChatHeader
          name={address}
          numberOfMessages={chatMessages ? chatMessages.length : 0}
        />
        {chatMessages && <ChatContent messages={chatMessages} />}
        <ChatInputBox sendANewMessage={sendANewMessage} address={address} />
      </div>
    </div>
  );
};

export default Chat;
