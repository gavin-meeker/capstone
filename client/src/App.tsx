import { useState } from "react";
import { api } from "./utils/api";
import { Button, Textarea } from "@material-tailwind/react";
import IocTable from "./components/IocTable";
import { useQuery } from "@tanstack/react-query";
import { Ioc } from "./types";
import ExportCsvModal from "./components/ExportCsvModal.tsx";

let testData = `# IPs
1.2.3.4
4.5.6[.]7
2607:f8b0:400c:c05::65

# Domains
domain1.com
domain2[.]xyz
www.domain3[.]biz

# URLs
hxxps://www.domain3[.]org/bad/stuff

# Hashes
F88ADB10AB5313D4FA33416F6F5FB4FF
3B26493A5BADBA73D08DE156E13F5FD16D56B750585182605E81744247D2C5BD

# Usernames
This user is corp\test
a1ServiceAccount
p1PamAccount
c00024 b29509
This is an English sentence, and none of these words should be mistaken for usernames.
`;

function App() {
  // TODO: need to remove this testData
  const [iocInput, setIocInput] = useState(testData);
  const [isInputError, setIsInputError] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["iocs"],
    // TODO: refactor this to use tanstack best practices. See https://tanstack.com/query/v4/docs/framework/react/guides/query-functions#query-function-variables
    queryFn: () => extractIocs(iocInput, false),
    enabled: false,
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const handleClick = async () => {
    if (!iocInput) {
      setIsInputError(true);
      return;
    }
    setIsInputError(false);

    await refetch();
  };

  // TODO: better error resolution here
  // if (isPending) {
  //   return <div>Could not fetch to get IOCs. Please refresh and try again</div>;
  // }

  return (
    <>
      <div className="mx-auto mt-5 w-1/2">
        <Textarea
          label="Paste IOC"
          resize={true}
          onChange={() => setIocInput(testData)}
          value={testData}
          error={isInputError}
          className="h-1/3"
        />
        <div className="my-3 flex justify-center gap-5">
          <Button onClick={handleClick}>Extract IOC</Button>
          <Button disabled={!data} onClick={handleOpen}>
            Export IOC (.csv)
          </Button>
        </div>
        {data && (
          <ExportCsvModal
            open={open}
            handleOpen={handleOpen}
            iocInput={iocInput}
          />
        )}
      </div>
      {data && <IocTable iocArray={data.data} />}
    </>
  );
}

type ExtractionResult = Ioc[];

export const extractIocs = async (iocInput: string, shouldDefang = true) => {
  return await api.post<ExtractionResult>(
    `/extract?${shouldDefang ? "defang=true" : ""}`,
    iocInput,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    },
  );
};

export default App;
