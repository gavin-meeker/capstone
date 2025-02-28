import { useState } from "react";

function App() {
  const [iocInput, setIocInput] = useState("");
  const handleClick = (e) => {
    fetch("http://localhost:8080/v1/extract", {
      method: "POST",
      body: iocInput,
      "Content-Type": "text/plain",
    }).then((r) => r.json().then((data) => console.log(data)));
  };

  return (
    <>
      <div className="textbox">
        <textarea
          onChange={(e) => setIocInput(e.target.value)}
          value={iocInput}
        />
        <button onClick={handleClick}>Test</button>
      </div>
    </>
  );
}

export default App;
