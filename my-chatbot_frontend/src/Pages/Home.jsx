import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SiChatbot } from "react-icons/si";
import axios from "axios";
import Chatbot from "../Components/Chatbot";
import DestinationDropdown from "../Components/DestinationDropdown";
import "../Styles/drpdown.css";
import Contact from "./Contact";
import Navbar from "../Components/Navbar";
import Feedback from "./Feedback";
import About from "./About";

// Home Component
function Home() {
  const [showChat, setShowChat] = useState(false);
  const [topQuestions, setTopQuestions] = useState([]);
  const [hoveringIcon, setHoveringIcon] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState("");

  // Fetch top 5 searched questions on mount
  useEffect(() => {
    axios
      .get("http://localhost/AI_ChatBot/top-questions.php")
      .then((res) => {
        console.log("Top questions fetched:", res.data); // Debug the response
        setTopQuestions(res.data); // Assuming it's an array of questions
      })
      .catch((err) => console.error("Failed to load top questions:", err));
  }, []);

  const [selectedDestination, setSelectedDestination] = useState(null);
  const [packages, setPackages] = useState([]);

  const handleSelect = async (selectedId) => {
    try {
      // Fetch full destination object
      const destRes = await axios.get(
        `http://localhost/AI_ChatBot/api/get_destinations.php?destination_id=${selectedId}`
      );

      // Handle if your API returns a single object or array
      const destinationData = Array.isArray(destRes.data)
        ? destRes.data[0]
        : destRes.data;

      setSelectedDestination(destinationData);
      console.log("Fetched destination:", destinationData);
    } catch (err) {
      console.error("Error fetching destination:", err);
    }

    try {
      const pkgRes = await axios.get(
        `http://localhost/AI_ChatBot/api/get_packages.php?destination_id=${selectedId}`
      );
      setPackages(pkgRes.data);
      console.log("Fetched packages:", pkgRes.data);
    } catch (err) {
      console.error("Error fetching packages:", err);
    }
  };

  return (
    <>
      <Navbar />
      <HomeStyle>
        <div className="homeArea">
          <h1>Explore the Sri Lanka</h1>
          <img src="SriLanka.png" alt="" />
          <div
            onMouseEnter={() => setHoveringIcon(true)}
            onMouseLeave={() => setHoveringIcon(false)}
          >
            <SiChatbot
              className="chatbot-icon"
              onClick={() => setShowChat(true)}
            />
            {hoveringIcon && (
              <QuestionBox>
                <h4>Mostly Asked Questions</h4>
                {topQuestions.length > 0 ? (
                  topQuestions.map((q, index) => (
                    <p
                      key={index}
                      onClick={() => {
                        setSelectedQuestion(q);
                        setShowChat(true);
                        console.log(q);
                      }}
                    >
                      {q}
                    </p>
                  ))
                ) : (
                  <p>No questions available</p>
                )}
              </QuestionBox>
            )}
          </div>
          {showChat && (
            <ModalBackground
              onClick={() => {
                setShowChat(false);
                setSelectedQuestion(""); // Clear selected question
              }}
            >
              <ModalContent onClick={(e) => e.stopPropagation()}>
                <Chatbot initialMessage={selectedQuestion} />
                <CloseButton
                  onClick={() => {
                    setShowChat(false);
                    setSelectedQuestion(""); // Clear here too
                  }}
                >
                  X
                </CloseButton>
              </ModalContent>
            </ModalBackground>
          )}
        </div>
        {/* <img src="Wannago-Sri-Lanka.jpg" alt="sri lanka travel" /> */}
        <DestinationArea className="DestinationArea">
          <DestinationDropdown onSelect={handleSelect} />
          {selectedDestination && (
            <>
              <img
                src={selectedDestination.image_url}
                alt={selectedDestination.name}
              />

              <section>
                <div className="description">
                  <h2>{selectedDestination.name}</h2>
                  <p>{selectedDestination.description}</p>
                  <p>
                    <b>Location:</b> {selectedDestination.location}
                  </p>
                  <p>
                    <b>Category:</b> {selectedDestination.category}
                  </p>
                </div>{" "}
                <div className="packArea">
                  <h3>Available Package</h3>
                  {Array.isArray(packages) &&
                    packages.map((pkg) => (
                      <div key={pkg.package_id}>
                        <h4>{pkg.title}</h4>
                        <p>
                          <b>Price: </b> ${pkg.price}
                        </p>
                        <p>
                          <b>Duration:</b> {pkg.duration_days} days
                        </p>
                        <p>{pkg.inclusions}</p>
                        <button
                          onClick={() =>
                            handleBooking(pkg.package_id, pkg.price)
                          }
                        >
                          Book Now
                        </button>
                      </div>
                    ))}
                </div>
              </section>
            </>
          )}{" "}
        </DestinationArea>{" "}
        <About />
        <Feedback />
        <Contact />
      </HomeStyle>
    </>
  );
}

// Styled Components
const HomeStyle = styled.div`
  position: relative;
  color: #c4e5f3;
  width: 80vw;
  height: 95vh;
  border: solid black 5px;
  overflow: hidden;
  background-image: url(Wannago-Sri-Lanka.jpg);
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  opacity: 0.8;
  margin: 20px;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;

  .homeArea {
    height: 80vh;
    img {
      position: absolute;
      right: 10px;
      width: 400px;
      top: 50px;
    }

    h1 {
      position: absolute;
      top: 50%;
      left: 40%;
      transform: translate(-50%, -50%);
      z-index: 10;
      font-size: 6.5rem;
      color: rgba(0, 0, 0, 0.4);
      text-align: center;
      -webkit-text-stroke: 1px white;
      /* mix-blend-mode: overlay; */
      text-shadow: 0 0 8px rgba(0, 0, 0, 0.6);
    }

    .chatbot-icon {
      font-size: 3.8em;
      position: fixed;
      bottom: 80px;
      right: 40px;
      padding: 8px;
      border-radius: 50%;
      background-color: #c4e5f3;
      color: #52799f;
      z-index: 3;

      &:hover {
        cursor: pointer;
        color: #3374b6;
        border: solid 2px #345f88;
      }
    }
  }
`;

const QuestionBox = styled.div`
  position: fixed;
  bottom: 130px;
  right: 30px;
  width: 300px;
  /* background-color: #ffffff; */
  color: #c5e3f2;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 10px;
  z-index: 4;
  text-align: left;

  h4 {
    color: #11375f;
    margin-bottom: 20px;
    text-align: center;
  }

  p {
    margin: 8px 0;
    cursor: pointer;
    background-color: #0669de;
    padding: 2px 4px;
    border-radius: 5px;

    &:hover {
      background-color: #0c89dd;
    }
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 15px;
  max-width: 700px;
  width: 90%;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 12px;
  background: none;
  font-size: 1.2em;
  cursor: pointer;
  border-radius: 50px;
  background-color: #fff;
  border-color: #0f3757;
`;

const DestinationArea = styled.section`
  padding: 20px;
  width: 100%;
`;

export default Home;
