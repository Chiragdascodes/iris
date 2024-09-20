import { useState } from 'react'; // Import useState
import { Link } from 'react-router-dom';
import './homepage.css';
import { TypeAnimation } from 'react-type-animation';

const Homepage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");

  return (
    <div className='homepage'>
      <img src="/orbital.png" alt="Orbital" className="orbital" />
      <div className="left">
        <h1>IRIS AI</h1>
        <h2>Your ideas, amplified by intelligence.</h2>
        <h3>
        Unleash the power of Iris AI: the world’s most advanced and powerful artificial intelligence. Designed for unmatched precision and speed, Iris AI transforms challenges into effortless solutions with extraordinary excellence.
        </h3>
        <Link to="/dashboard">Get Started</Link>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="Bot" className="bot"/>
          <div className="chat">
            <img 
              src={typingStatus === "human1" ? "/human1.jpeg" 
                : typingStatus === "human2" ? "/human2.jpeg" 
                : "/bot.png"} 
              alt="Human or Bot"
            />
            <TypeAnimation
              sequence={[
                'Suggest 5 trending business ideas',
                2000, 
                () => setTypingStatus("bot"),
                'Plan a 3-month muscle gain workout',
                2000, 
                () => setTypingStatus("human2"),
                'Convert Python code to JavaScript',
                2000, 
                () => setTypingStatus("bot"),
                'Suggest 5 trending business ideas',
                2000, 
                () => setTypingStatus("human1"),
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        <img src="/logo.png" alt="" />
        <div className="links">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
