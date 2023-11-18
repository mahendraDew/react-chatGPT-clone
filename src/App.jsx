import { useState, useEffect } from 'react';
import './App.css';

import { IoIosArrowForward } from "react-icons/io";

const App = () => {

  const [ value, setValue ] = useState('');
  const [ message, setMessage ] = useState(null);
  const [ previousChats, setPreviousChats ] = useState([]);
  const [ currentTitle, setCurrentTitle ] = useState(null);

  const createNewChat = () => {
    setMessage(null);
    setValue('');
    setCurrentTitle(null);

  }

  const handleClick = (uniqueTitle) =>{
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue('');
  }

  const getMessages = async () => {
    console.log(value , "value at getMessages")
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json",
      }
    }
    try {
      const response = await fetch('http://localhost:8080/completions', options);
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log(currentTitle, value, message);
    if(!currentTitle && value && message){
      setCurrentTitle(value);
    }
    if(currentTitle && value && message){
      setPreviousChats(prevChats => (
        [...prevChats, {
          title: currentTitle,
          role: "user",
          content: value
        },{
          title: currentTitle,
          role: message.role,
          content: message.content
        }]
      ))
    }
  }, [message, currentTitle])

  console.log(previousChats, "previousChats")

  const currentChat = previousChats.filter(previousChats => previousChats.title === currentTitle);
  const uniqueTittle = Array.from(new Set(previousChats.map(previousChats => previousChats.title)));
  console.log(uniqueTittle, "uniqueTittle")

  return (
    <div className="App">
      <section className='side-bar'>
        <button onClick={createNewChat}> + New Chat</button>
        <ul className='history'>
          {uniqueTittle?.map((uniqeTitle, index) => <li key={index} onClick={()=>handleClick(uniqeTitle)}>{uniqeTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Mahendra</p>
        </nav>
      </section>
      <section className='main'>
        { !currentTitle && <h1>CodeX</h1>}
        <ul className='feed'>
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <p className='role'>{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
            </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input  value={value} onChange={(e)=>setValue(e.target.value)}/>
            <div id="submit" onClick={getMessages}>
              <IoIosArrowForward />
            </div>
          </div>
          <p className="info">
            Chat GPT Mar 14 version. Free Rsearch Preview. Our goal is to make Ai systems more natural and safe to ineract wih. Your feedback will help us improve.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
