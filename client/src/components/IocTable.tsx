import { Typography, Tabs, TabsHeader, Tab, TabsBody, TabPanel, Chip } from "@material-tailwind/react";
import { useState } from "react";
import { Ioc, IocType } from "../types";
import IocDrawer from "./IocDrawer";
import IocTableRow from "./IocTableRow";

type IocTableProps = {
  iocArray: Ioc[];
};

const IocTable = ({ iocArray }: IocTableProps) => {
  const [currentIoc, setCurrentIoc] = useState<Ioc | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  // Skip if no IOCs
  if (!iocArray || iocArray.length === 0) {
    return (
      <div className="mx-auto my-8 w-5/6 text-center p-8 bg-gray-50 rounded-lg">
        <Typography variant="h5" color="blue-gray" className="mb-2">
          No Indicators of Compromise Found
        </Typography>
        <Typography color="gray" className="text-sm">
          Try adjusting your search or entering different text to extract IOCs.
        </Typography>
      </div>
    );
  }

  // Group IOCs by type for the tabs
  const iocsByType = iocArray.reduce((acc, ioc) => {
    const type = ioc.threat.indicator.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(ioc);
    return acc;
  }, {} as Record<string, Ioc[]>);

  // Get counts by type
  const ipCount = (iocsByType["ipv4-addr"]?.length || 0) + (iocsByType["ipv6-addr"]?.length || 0);
  const domainCount = iocsByType["domain-name"]?.length || 0;
  const fileCount = iocsByType["file"]?.length || 0;
  const emailCount = iocsByType["email-addr"]?.length || 0;
  const urlCount = iocsByType["url"]?.length || 0;
  const userCount = iocsByType["user-account"]?.length || 0;

  // Create tab data with counts
  const tabData = [
    { value: "all", label: `All (${iocArray.length})` },
    ...(ipCount > 0 ? [{ value: "ip", label: `IPs (${ipCount})` }] : []),
    ...(domainCount > 0 ? [{ value: "domain", label: `Domains (${domainCount})` }] : []),
    ...(fileCount > 0 ? [{ value: "file", label: `Files (${fileCount})` }] : []),
    ...(urlCount > 0 ? [{ value: "url", label: `URLs (${urlCount})` }] : []),
    ...(emailCount > 0 ? [{ value: "email", label: `Emails (${emailCount})` }] : []),
    ...(userCount > 0 ? [{ value: "user", label: `Users (${userCount})` }] : [])
  ];

  // Filter IOCs based on active tab
  const getFilteredIocs = (tabValue: string): Ioc[] => {
    if (tabValue === "all") return iocArray;
    if (tabValue === "ip") return [
      ...(iocsByType["ipv4-addr"] || []),
      ...(iocsByType["ipv6-addr"] || [])
    ];
    if (tabValue === "domain") return iocsByType["domain-name"] || [];
    if (tabValue === "file") return iocsByType["file"] || [];
    if (tabValue === "url") return iocsByType["url"] || [];
    if (tabValue === "email") return iocsByType["email-addr"] || [];
    if (tabValue === "user") return iocsByType["user-account"] || [];
    return [];
  };

  return (
    <>
      <div className="mx-auto h-full w-5/6">
        <div className="mb-4 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray" className="flex-grow">
            Indicators of Compromise
            <span className="ml-2 text-sm font-normal text-gray-600">
              ({iocArray.length} total)
            </span>
          </Typography>
          
          <div className="flex items-center space-x-3 text-sm">
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
              <span>High Risk</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-amber-500"></div>
              <span>Medium Risk</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
              <span>Low Risk</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onChange={(value) => setActiveTab(value as string)}>
          <TabsHeader>
            {tabData.map(({ value, label }) => (
              <Tab key={value} value={value}>
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            {tabData.map(({ value }) => (
              <TabPanel key={value} value={value} className="p-0">
                <div className="bg-white rounded-b-lg shadow overflow-hidden">
                  <table className="w-full min-w-max table-auto text-left">
                    <thead>
                      <tr>
                        <th className="border-b border-gray-100 bg-gray-50 p-4">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold leading-none"
                          >
                            Indicators ({getFilteredIocs(value).length})
                          </Typography>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredIocs(value).map((ioc) => (
                        <IocTableRow
                          key={ioc.threat.indicator.description}
                          ioc={ioc}
                          setCurrentIoc={setCurrentIoc}
                          openDrawer={openDrawer}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
        
        {currentIoc && (
          <IocDrawer 
            closeDrawer={closeDrawer} 
            ioc={currentIoc} 
            isOpen={open} 
          />
        )}
      </div>
    </>
  );
};

export default IocTable;