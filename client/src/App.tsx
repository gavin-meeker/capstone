import { useState } from "react";
import { api } from "./utils/api";
import {
  Button,
  Textarea,
  Card,
  CardBody,
  Typography,
  Alert,
  Spinner,
} from "@material-tailwind/react";
import IocTable from "./components/IocTable";
import { useQuery } from "@tanstack/react-query";
import { Ioc } from "./types";

// Default example text for the IOC extraction
const DEFAULT_EXAMPLE_TEXT = `# Example IOCs

## IPs
1.2.3.4
4.5.6[.]7
2607:f8b0:400c:c05::65

## Domains
domain1.com
domain2[.]xyz
www.domain3[.]biz

## URLs
hxxps://www.domain3[.]org/bad/stuff

## Hashes
F88ADB10AB5313D4FA33416F6F5FB4FF
3B26493A5BADBA73D08DE156E13F5FD16D56B750585182605E81744247D2C5BD

## Usernames
This user is corp\\test
a1ServiceAccount
p1PamAccount
c00024 b29509
`;

function App() {
  // State for the textarea input
  const [iocInput, setIocInput] = useState(DEFAULT_EXAMPLE_TEXT);
  const [isInputError, setIsInputError] = useState(false);
  const [submitCount, setSubmitCount] = useState(0); // Used to trigger refetches
  
  // Query for IOC extraction
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["iocs", submitCount], // Include submitCount to force refetch
    queryFn: () => extractIocs(iocInput),
    enabled: submitCount > 0, // Don't run automatically on first render
    retry: 1, // Only retry once on failure
  });
  
  // Handle textarea input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIocInput(e.target.value);
    // Clear error state when user starts typing
    if (isInputError) {
      setIsInputError(false);
    }
  };
  
  // Handle extract button click
  const handleExtractClick = async () => {
    console.log("Extract IOC button clicked, input length:", iocInput?.length);
    
    // Validate input
    if (!iocInput || iocInput.trim().length === 0) {
      setIsInputError(true);
      return;
    }
    
    // Increment submit count to trigger refetch
    setSubmitCount(prev => prev + 1);
  };
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Card className="w-96 mx-auto">
          <CardBody className="flex flex-col items-center gap-4">
            <Spinner className="h-12 w-12" />
            <Typography variant="h6" color="blue-gray">
              Extracting IOCs...
            </Typography>
            <Typography variant="small" color="gray" className="text-center">
              Analyzing text and identifying indicators of compromise.
              This may take a few seconds.
            </Typography>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <Typography variant="h3" color="blue-gray" className="mb-2">
          SOC Investigation Tool
        </Typography>
        <Typography color="gray">
          Extract and analyze Indicators of Compromise (IOCs) from unstructured text.
        </Typography>
      </div>
      
      <Card className="mb-8">
        <CardBody>
          <div className="mb-4">
            <Typography variant="h5" color="blue-gray" className="mb-2">
              Input Text
            </Typography>
            <Typography color="gray" className="mb-4">
              Paste text containing potential IOCs such as IPs, domains, URLs, file hashes, and more.
            </Typography>
            
            <Textarea
              label="Paste text with IOCs"
              size="lg"
              rows={10}
              onChange={handleInputChange}
              value={iocInput}
              error={isInputError}
              className="font-mono text-sm"
            />
            
            {isInputError && (
              <Typography color="red" className="mt-1 text-sm">
                Please enter some text to extract IOCs.
              </Typography>
            )}
          </div>
          
          <div className="flex justify-center">
            <Button 
              size="lg"
              onClick={handleExtractClick}
              className="px-8"
            >
              Extract IOCs
            </Button>
          </div>
        </CardBody>
      </Card>
      
      {/* Error message if API call fails */}
      {isError && (
        <Alert 
          color="red" 
          className="mb-4"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          }
        >
          <Typography className="font-medium">
            Error extracting IOCs
          </Typography>
          <Typography className="mt-1 text-sm">
            {error instanceof Error ? error.message : "An unknown error occurred. Please try again."}
          </Typography>
        </Alert>
      )}
      
      {/* No IOCs found message */}
      {data && data.length === 0 && submitCount > 0 && (
        <Alert 
          color="amber" 
          className="mb-4"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          }
        >
          <Typography className="font-medium">
            No IOCs Found
          </Typography>
          <Typography className="mt-1 text-sm">
            No indicators of compromise were found in the provided text. 
            Try with different content or check your formatting.
          </Typography>
        </Alert>
      )}
      
      {/* Results table if we have data */}
      {data && data.length > 0 && (
        <IocTable iocArray={data} />
      )}
    </div>
  );
}

/**
 * Extract IOCs from text by calling the API
 */
async function extractIocs(iocInput: string): Promise<Ioc[]> {
  console.log("Extracting IOCs, input length:", iocInput.length);
  
  try {
    // Make the API call to extract IOCs
    const response = await api.post("/extract", iocInput, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
    
    console.log("API response received, found IOCs:", response.data?.length || 0);
    
    // Return the data or an empty array if no data
    return response.data || [];
  } catch (error) {
    console.error("Error in extractIocs:", error);
    throw error;
  }
}

export default App;