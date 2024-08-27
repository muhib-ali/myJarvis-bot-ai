document.addEventListener("DOMContentLoaded", () => {
    let usermsg;
    let ind = 1;
    let typingform = document.querySelector(".typing-form");
    let chatlist = document.querySelector(".chat-list");
    let usermsgInput = typingform.querySelector(".typing-input");
    let header = document.querySelector(".header");
    let stop=document.querySelector("#stop")

    const ApiKey = "AIzaSyApwG2vCJR_5p5wk5B4dK_VYwkxnJ0Ed84";
    const ApiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${ApiKey}`;

    document.querySelector(".del").addEventListener("click", () => {
        if (confirm("Are you sure you want to delete chat?")) {
            localStorage.removeItem("savedchats");
            header.style.display = "block";
            localstoragedata();
        }
    });

    const localstoragedata = () => {
        const savedchats = localStorage.getItem("savedchats");
        chatlist.innerHTML = savedchats;
        if(chatlist.innerHTML!=""){
 header.style.display="none";
        }
    };
    localstoragedata();

    const createMessage = (content, classname) => {
        const div = document.createElement("div");
        div.classList.add("message", classname);
        div.innerHTML = content;
        return div;
    };

    function showTypingEffect(textElement, text, speed = 20, incomingMessage) {
        let index = 0; // To keep track of the current character index
        textElement.innerHTML = ''; // Clear the text element before typing
    
        // Identify and hide the icons initially
        const icons = incomingMessage.querySelector(".ico");
        if (icons) {
            icons.classList.add("hide");
            ind = null;
            stop.style.display = "block";
        }
    
        // Function to type the next character
        function typeNextCharacter() {
            if (index < text.length) {
                textElement.innerHTML += text[index]; // Add the next character
                index++;
               
                ind = null;
            } else {
                clearInterval(typingInterval); // Stop typing when the text is complete
                localStorage.setItem("savedchats", chatlist.innerHTML);
                // Show the icons after typing is complete
                if (icons) {
                    icons.classList.remove("hide");
                    ind = 1;
                    stop.style.display = "none"; // Hide the stop button after typing is complete
                } 
            }
        }
    
        // Start typing with the specified speed
        const typingInterval = setInterval(typeNextCharacter, speed);
        stop.addEventListener("click",()=>{
            clearInterval(typingInterval);
            stop.style.display = "none";
            ind = 1;
        })
    }
    function formatText(text) {
        // Remove bold formatting (surrounding **)
        let cleanedText = text.replace(/\*\*(.*?)\*\*/g, '$1');
        
        // Optionally, remove single asterisks if needed
        cleanedText = cleanedText.replace(/\*/g, '');
        
        // Preserve and format new lines
        cleanedText = cleanedText.replace(/^\s+|\s+$/g, ''); // Trim leading and trailing whitespace
        cleanedText = cleanedText.replace(/\n\s*\n/g, '\n\n'); // Ensure new lines are preserved
    
        return cleanedText;
    }
    

    const generateApiresponse = async (incomingMessage) => {
        const textElement = incomingMessage.querySelector(".text");

        try {
            const response = await fetch(ApiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        role: "user",
                        parts: [{ text: usermsg }]
                    }]
                })
            });

            const data = await response.json();
            console.log(data);

            const responseText = data.candidates[0].content.parts[0].text;
            let formattedText=formatText(responseText)
            showTypingEffect(textElement, formattedText, 20, incomingMessage); // Pass incomingMessage here
        } catch (err) {
            console.log(err);
        } finally {
            incomingMessage.classList.remove("load");
        }
    };

    const showLoadingAnimation = () => {
        const html = `       
            <div class="message-content">
                <img src="images/gemini.svg" alt="User Image" class="avatar">
                <p class="text"></p>
                <div class="loading">
                    <div class="ellipse"></div>
                    <div class="ellipse"></div>
                    <div class="ellipse"></div>
                </div>
            </div>
            <div class="ico">
                <span onclick="copyMessage(this)" class="material-symbols-outlined icon copy">
                    content_copy
                </span>
                <span onclick="thumbUp(this)" class="material-symbols-outlined icon thumbup">
                    thumb_up
                </span>
                <span onclick="thumbDown(this)" class="material-symbols-outlined icon thumdown">
                    thumb_down
                </span>
            </div>
        `;

        let incomingmessage = createMessage(html, "load");
        chatlist.appendChild(incomingmessage);
        generateApiresponse(incomingmessage);
        return 1;
    };

    const handleOutgoingChat = () => {
        if (!usermsgInput) {
            console.error("Typing input element not found");
            return;
        }

        usermsg = usermsgInput.value.trim(); // Trim to handle extra spaces

        if (!usermsg) return;

        console.log(usermsg);
        const html = `     
            <div class="message outgoing">
                <div class="message-content">
                    <img src="images/us.png" alt="User Image" class="avatar">
                    <p class="text"></p>
                </div>
            </div>`;
        let outgoingmessage = createMessage(html, "outgoing");

        header.style.display = "none";
        outgoingmessage.querySelector(".text").innerHTML = usermsg;
        chatlist.appendChild(outgoingmessage);
        typingform.reset();
        setTimeout(showLoadingAnimation, 1000);
    };

    let suggestions = document.querySelectorAll(".suggestion-list .suggestion");

    suggestions.forEach(e => {
        e.addEventListener("click", () => {
            usermsgInput.value = e.innerText; // Update input value with suggestion text
            handleOutgoingChat(); // Call function to send the chat
        });
    });

    typingform.addEventListener("submit", (e) => {
        e.preventDefault();
        handleOutgoingChat();
    });


if(ind===1){

    const micIcon = document.querySelector(".mic");
    
    if (!("webkitSpeechRecognition" in window)) {
        alert("Your browser does not support the Web Speech API. Please use Google Chrome or another supported browser.");
        return;
    }
    
    const recognition = new webkitSpeechRecognition(); // Initialize Speech Recognition
    recognition.lang = "en-US"; // Set language
    recognition.interimResults = false; // True if you want to get results as the user speaks
    recognition.maxAlternatives = 1; // Maximum number of alternatives to return
    
    recognition.onstart = () => {
        micIcon.style.color = "blue"; // Change mic icon color when recording
        console.log("Speech recognition started");
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Speech recognized: " + transcript);
        const typingInput = document.querySelector(".typing-input");
        typingInput.value = transcript; // Populate the input field with recognized speech
    };
    
    recognition.onerror = (event) => {
        console.error("Speech recognition error: " + event.error);
    };
    
    recognition.onend = () => {
        micIcon.style.color = "#E3E3E3"; // Revert mic icon color when stopped
        console.log("Speech recognition ended");
        handleOutgoingChat();
        
    };
    
    micIcon.addEventListener("click", () => {
        if (ind === 1 ) {
            // alert("hello")
            recognition.start(); // Start speech recognition on mic click
            
            
        } else {
            alert("Please wait until the current typing effect is complete.");
        }
    });
}
let messagecontent=document.querySelectorAll(".message-content")
messagecontent.forEach(e=>{
    e.style.marginBottom = "20px";
})

});