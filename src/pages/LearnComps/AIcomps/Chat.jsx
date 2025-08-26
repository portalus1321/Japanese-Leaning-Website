import { useEffect, useRef , useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'
import OpenAI from 'openai';

import {
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
// import chatWithAssistant from '../../../moduletests/example.mjs';
import { supabase } from '../../../utils/supabaseClient';
// ----------------------------- AI 

const messageHistory = [
  {
    "role": "system",
    "content": "give user answer in japanese dont write think process"
  },
];
const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

const people = [
  { id: 1, name: 'Neighbour', online: true },
  { id: 2, name: 'Taxi Driver', online: true },
  { id: 3, name: 'Teacher', online: true },
  { id: 4, name: 'Gym Friend', online: true },
  { id: 5, name: 'Grilfriend', online: true },
  { id: 6, name: 'Boyfriend', online: true },
  { id: 7, name: 'Sister', online: true },
  { id: 8, name: 'Brother', online: true },
  { id: 9, name: 'Old lady', online: true },
  { id: 10, name: 'Enemy', online: true },
  // i can add more assistants here
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const client = new OpenAI({
  apiKey,
  baseURL: 'https://api.studio.nebius.com/v1/',
  dangerouslyAllowBrowser: true,
});



async function chatfetcher(usmsg) {
  // Push user message
  messageHistory.push({ "role": "user", "content": [{"type": "text", "text": usmsg.content}]});
  console.log(messageHistory);
  const response = await client.chat.completions.create({
    "model": "Qwen/Qwen3-235B-A22B",
    "messages": messageHistory
    });
  // Get assistant message
  console.log(messageHistory);
  
  const asmsg = response.choices[0].message;
  console.log("asmg",asmsg.content.replace(/<think>[\s\S]*?<\/think>/g, ""));
  
  // Push assistant reply to memory
  messageHistory.push(asmsg);

  console.log("chat log so far:", messageHistory);

  return asmsg;
}










function messagereader(msgs) {
  console.log(msgs);

}

const AIChat = ({ token }) => {

  // ------------------- use states
  const [query, setQuery] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
                        //--configuration and creation part
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null)
 

  
  const [chatName, setChatName] = useState("");
  const [chatAsistName, setChatAsistName] = useState("");
  const [chatAge, setChatAge] = useState("");
  const [chatDescription, setChatDescription] = useState("");
  const [chatRole, setChatRole] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const filteredPeople =
    query === ''
      ? people
      : people.filter((person) => {
        return person.name.toLowerCase().includes(query.toLowerCase())
      })
  
  // ----------------visual functions-- 
  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  const containerRef = useRef(null);
  const scrollToBottom = () => {

    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  // ---------------------------^^^^ 
  const [systemMessage, setSystemMessage] = useState({
    role: "system",
    content: "answer in Japanese and its translated version in English",
  });

//-----------------database connectors---  
  useEffect(() => {
    if (id) {
      loadChatConfig(id);
    }
  }, [id]);
  useEffect(() => {
    if (!token || !token.user) {
      console.log('Waiting for token...');
      return;
    }

    function setdatamessages(data) {
      if (!data || !Array.isArray(data)) {
        return;
      }

      const newMessages = [];
      data.forEach((entry) => {
        if (entry.chat && typeof entry.chat === "object") {
          for (const key in entry.chat) {
            scrollToBottom();
            if (entry.chat[key].role && entry.chat[key].content) {
              const userMessage = {
                role: entry.chat[key].role,
                content: entry.chat[key].content,
              };
              newMessages.push(userMessage);
            }
          }
        }
      });

      // Update messages state all at once
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
    }





    async function getChats() {
      if (id === "New") {
        console.log("no need to load when chat is New");
        
      }else
      { try {
        console.log(id,'loadedchatid is this');
        
        console.log(token.user.id);

        const { data, error } = await supabase
          .from('AI_Chat')
          .select('chat, config')
          .eq('Chat_ID', id);

        if (error) {
          throw error;
        }

        console.log(data, "this is actual data", id);
        setdatamessages(data);

      } catch (error) {
        console.error('Error fetching chats:', error);
        alert('Failed to load chats. Please try again later.');
        setLoading(false);
      }}
     
    }

    getChats();

  }, [token, id]);
  const updateChatMessages = async (chatId, updatedChat) => {
    try {
      
      const { data, error } = await supabase
        .from('AI_Chat')
        .select('chat')
        .eq('Chat_ID', chatId)
        .single();

      if (error) {
        throw error;
      }

    
      let existingChat = data ? data.chat : [];

      
      const { error: updateError } = await supabase
        .from('AI_Chat')
        .update({ chat: updatedChat }) 
        .eq('Chat_ID', chatId);

      if (updateError) {
        throw updateError;
      }

      console.log('Chat updated successfully!');
    } catch (error) {
      console.error('Error updating chat:', error);
    }
  };

//-----------------generators and helpers


  const generateSystemMessage = () => {
    return {
      role: "system",
      content: `You are ${name}, a ${age}-year-old ${selectedPerson}. You must act as a human not AI never tel user that you are an AI, and your personality is described as: ${description}. 
      Always respond in Japanese`,
    };
  };
  useEffect(() => {
    if (name && age && description && selectedPerson) {
      setSystemMessage({
        role: "system",
        content: `You are ${name}, a ${age}-year-old ${selectedPerson}. Your personality is described as: ${description}. 
        Always respond in Japanese and provide the English translation below.`,
      });
    }
  }, [name, age, description, selectedPerson]);


  // Loading state and render UI







  const loadChatConfig = async (chatId) => {
    if (id === "New") {
      console.log("chatconfig message");
      
    } else {
      try {
        const { data, error } = await supabase
          .from('AI_Chat')
          .select('config')
          .eq('Chat_ID', chatId)
          .single(); // Ensure we get one result
    
        if (error) {
          throw error;
        }
    
        if (data && data.config) {
          // Set state with loaded values
          setName(data.config.Name || "");
          setAge(data.config.Age || "");
          setDescription(data.config.Description || "");
          setSelectedPerson(data.config.Role || null);
        }
    
        console.log("Chat config loaded:", data.config);
      } catch (error) {
        console.error("Error loading chat config:", error);
      }
    }

  };
  
  const handleSave = () => {
    updateChatConfig(id, name, age, description, selectedPerson);
    toggleMenu();
  };

  const updateChatConfig = async (chatId, name, age, description, selectedPerson) => {
    try {
      const newConfig = {
        Name: name,
        Age: age,
        Description: description,
        Role: selectedPerson,
      };
  
      // Update the 'config' field in the database
      const { error } = await supabase
        .from('AI_Chat')
        .update({ config: newConfig }) // Ensure it's an object
        .eq('Chat_ID', chatId);
      messageHistory[0] = generateSystemMessage();
      if (error) {
        throw error;
      }
  
      console.log('Chat config updated successfully!');
      console.log(messages)
    } catch (error) {
      console.error('Error updating chat config:', error);
    }
  };
  
  const createNewChat = async (name,asist,age, description, selectedPerson) => {
    try {
        const newConfig = {
            Name: asist,
            Age: age,
            Description: description,
            Role: selectedPerson,
        };

        const { data, error } = await supabase
            .from('AI_Chat')
            .insert([{ 
                chat: [],
                config: newConfig ,
                User_id:"2b7944d0-ecfc-4a74-9d12-bca645be00e2",
                Chat_name:name,
            }])
            .select();

        if (error) {
            throw error;
        }

        console.log('New chat created successfully!', data);
        return data; // Returning the newly created chat if needed
    } catch (error) {
        console.error('Error creating new chat:', error);
    }
};
const handleCreateChat = () => {
  console.log({
    name: chatName,
    age: chatAge,
    description: chatDescription,
    role: chatRole,
  });
  createNewChat(chatName,chatAsistName,chatAge,chatDescription,chatRole)
  // Add logic to send data to backend or state management
};


  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage = { role: 'user', content: inputMessage };
    const newMessages = [...messages, userMessage]; // Add the user's message to a copy of the state

    setMessages(newMessages); // Update the state immediately
    setInputMessage(''); // Clear the input

    try {
      // Call the chat fetcher
      const usmsgtranslated = { role: userMessage.role, content: userMessage.content };
      const response = await chatfetcher(usmsgtranslated);

      const botMessage = { role: response.role, content: response.content };
      const updatedMessages = [...newMessages, botMessage]; // Include the bot's response

      setMessages(updatedMessages); // Update state with both user and bot messages

      // Log the final updated messages
      console.log('Updated messages:', updatedMessages);

      // Call the update function with the latest messages
      updateChatMessages(id, updatedMessages);
    } catch (error) {
      console.error('Error handling message:', error);
    }

    scrollToBottom();
  };

  return (
    <div className='h-[90vh] pb-[50px] pl-[50px] pr-[50px] pt-0'>
    
      {id === 'New' ? <div className="newchatcreationform border-2 h-calc-90-30px absolute w-calc-90-30px top-0 rounded border-gray-300">
      <div className="flex min-h-full flex-1 flex-col px-6 py-12 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Chat Name
              </label>
              <div className="mt-2">
                <input
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Assistant Name
              </label>
              <div className="mt-2">
                <input
                  value={chatAsistName}
                  onChange={(e) => setChatAsistName(e.target.value)}
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Age
              </label>
              <div className="mt-2">
                <input
                  value={chatAge}
                  onChange={(e) => setChatAge(e.target.value)}
                  type="number"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900">
                Description
              </label>
              <div className="mt-2">
                <input
                  value={chatDescription}
                  onChange={(e) => setChatDescription(e.target.value)}
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>
            <Combobox as="div" value={chatRole} onChange={setChatRole}>
              <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">Role</Combobox.Label>
              <div className="relative mt-2">
                <Combobox.Input
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  onChange={(event) => setQuery(event.target.value)}
                  displayValue={(person) => person?.name || ""}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </Combobox.Button>

                {filteredPeople.length > 0 && (
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredPeople.map((person) => (
                      <Combobox.Option
                        key={person.id}
                        value={person}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-3 pr-9 ${
                            active ? "bg-indigo-600 text-white" : "text-gray-900"
                          }`
                        }
                      >
                        {({ active, selected }) => (
                          <>
                            <div className="flex items-center">
                              <span
                                className={`inline-block h-2 w-2 flex-shrink-0 rounded-full ${
                                  person.online ? "bg-green-400" : "bg-gray-200"
                                }`}
                                aria-hidden="true"
                              />
                              <span className={`ml-3 truncate ${selected ? "font-semibold" : ""}`}>
                                {person.name}
                                <span className="sr-only"> is {person.online ? "online" : "offline"}</span>
                              </span>
                            </div>

                            {selected && (
                              <span
                                className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                  active ? "text-white" : "text-indigo-600"
                                }`}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
            </Combobox>

            <div>
              <button
                onClick={handleCreateChat}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
              >
                Create Chat
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>: <>
      <div onClick={toggleMenu} className='absolute top-[0px] w-[40px] h-[40px] left-[5px] bg-gray-300  rounded-[3px] z-1'>
      <Cog6ToothIcon className=' scale-75 stroke-gray-500'></Cog6ToothIcon>
    </div>
    {isMenuOpen && (<div className="absolute w-[400px] h-[600px] bg-gray-400 z-10 top-[10px] left-[60px] rounded-br-[10px] rounded-tl-[3px]">
      <>
        <div className="flex min-h-full flex-1 flex-col px-6 py-12 lg:px-8">
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={(e) => e.preventDefault()} action="#" method="POST" className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                    Name
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    value={name}
                    id="configname"
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                    Age
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    id="configage"
                    type="Number"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                    description
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    id="configdesc"
                    type="text"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <Combobox as="div" value={selectedPerson} onChange={setSelectedPerson}>
                <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">Role</Combobox.Label>
                <div className="relative mt-2">
                  <Combobox.Input
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(person) => person?.name}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </Combobox.Button>

                  {filteredPeople.length > 0 && (
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-l-[10px] bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {filteredPeople.map((person) => (
                        <Combobox.Option
                          key={person.id}
                          value={person}
                          className={({ active }) =>
                            classNames(
                              'relative cursor-default select-none py-2 pl-3 pr-9',
                              active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                            )
                          }
                        >
                          {({ active, selected }) => (
                            <>
                              <div className="flex items-center">
                                <span
                                  className={classNames(
                                    'inline-block h-2 w-2 flex-shrink-0 rounded-full',
                                    person.online ? 'bg-green-400' : 'bg-gray-200'
                                  )}
                                  aria-hidden="true"
                                />
                                <span className={classNames('ml-3 truncate', selected && 'font-semibold')}>
                                  {person.name}
                                  <span className="sr-only"> is {person.online ? 'online' : 'offline'}</span>
                                </span>
                              </div>

                              {selected && (
                                <span
                                  className={classNames(
                                    'absolute inset-y-0 right-0 flex items-center pr-4',
                                    active ? 'text-white' : 'text-indigo-600'
                                  )}
                                >
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              )}
                            </>
                          )}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  )}
                </div>
              </Combobox>
              <div>
                <button
                  onClick={() => console.log(handleSave())}

                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    </div>)}

    <div className='border-2 h-full relative rounded border-gray-300'
      id="scrollcontainer"
      ref={containerRef}>
      <h2>AI Chat ID: {id}</h2>


      <div className='chat-messages p-4'
        ref={chatContainerRef}
        style={{
          height: "80%",
          overflowY: "auto",  
          display: "flex",
          flexDirection: "column"
      }}>
        {messages.map((msg, index) => (
          msg.role === 'user' ? (

            <div
              key={index}
              className='message right p-2 my-2 rounded-lg bg-green-100'
              style={{ textAlign: 'right' }}
            >
              <span>{msg.content}</span>
            </div>
          ) : (
            <div
              key={index}
              className='message left p-2 my-2 rounded-lg bg-red-100'
              style={{ textAlign: 'left' }}
            >
              <span>{msg.content}</span>
            </div>
          )
        ))}
      </div>

      <div className='chat-input absolute bottom-0 w-full p-4'>
        <input
          type='text'
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className='w-[calc(100%-100px)] p-2 border-2 border-gray-300 rounded'
          placeholder='Type a message...'
        />
        <button
          onClick={handleSendMessage}
          className='ml-2 p-2 bg-blue-500 text-white rounded'
        >
          Send
        </button>
      </div>

    </div></>}
    </div>
  );
  
}

export default AIChat;
