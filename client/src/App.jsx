import { useState } from "react";

function App() {
  const [iocInput, setIocInput] = useState("");
  const [iocArray, setIocArray] = useState([]);
  const [fetchError, setFetchError] = useState("");

  const handleClick = async () => {
    try {
      const data = await fetch("http://localhost:8080/v1/extract", {
        method: "POST",
        body: iocInput,
        "Content-Type": "text/plain",
      });
      const iocData = await data.json();
      setIocArray(iocData);
    } catch (e) {
      setFetchError(e);
    }
  };

  // TODO: better error resolution here
  if (fetchError) {
    return <div>Could not fetch to get IOCs. Please refresh and try again</div>;
  }

  return (
    <>
      <div className="textbox">
        <textarea
          onChange={(e) => setIocInput(e.target.value)}
          value={iocInput}
        />
        <button onClick={handleClick}>Test</button>
      </div>
      {iocArray.length > 0 &&
        iocArray.map((ioc) => <p>{ioc.threat.indicator.ip}</p>)}
    </>
  );
}

export default App;
