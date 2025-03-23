import { Ioc, IocType, ThreatLevel, IocDirection, IocContext } from "../types";
import { api } from "./api";

// IOC context descriptions by type and direction
const IOC_CONTEXT_DESCRIPTIONS = {
  "ipv4-addr": {
    inbound: "Malicious login source - Check authentication logs",
    outbound: "Possible C2 communication - Check network traffic",
    default: "Suspicious IP address",
  },
  "ipv6-addr": {
    inbound: "Malicious login source - Check authentication logs",
    outbound: "Possible C2 communication - Check network traffic",
    default: "Suspicious IP address",
  },
  "domain-name": {
    inbound: "Malicious domain contact",
    outbound: "Communication with suspicious domain - Check DNS logs",
    default: "Suspicious domain",
  },
  url: {
    outbound: "User accessed malicious URL",
    default: "Malicious web resource",
  },
  file: {
    default: "Malicious file detected",
  },
  "email-addr": {
    inbound: "Mail from suspicious sender",
    outbound: "Mail to suspicious recipient",
    default: "Suspicious email address",
  },
  "user-account": {
    default: "Potentially compromised account",
  },
  default: {
    default: "Unknown indicator",
  },
};

/**
 * Analyzes an IOC to determine its context based on type and security logs
 * @param ioc The IOC to analyze
 * @returns Context information including threat level, direction and description
 */
export async function analyzeIocContext(ioc: Ioc): Promise<IocContext> {
  try {
    // Get the IOC type and value
    const iocType = ioc.threat.indicator.type as IocType;
    const iocValue = ioc.threat.indicator.description;

    // Check if this IOC appears in security logs
    const securityLogResults = await checkSecurityLogs(iocValue, iocType);

    // Determine direction based on log analysis
    const direction = determineDirection(iocType, securityLogResults);

    // Calculate threat level
    const threatLevel = determineThreatLevel(iocType, securityLogResults);

    // Get appropriate description
    const contextDescriptions =
      IOC_CONTEXT_DESCRIPTIONS[iocType] || IOC_CONTEXT_DESCRIPTIONS.default;
    const description =
      contextDescriptions[direction] || contextDescriptions.default;

    return {
      threatLevel,
      direction,
      description,
      securityLogCount: securityLogResults.logCount,
    };
  } catch (error) {
    console.error("Error analyzing IOC context:", error);
    return {
      threatLevel: "UNKNOWN",
      direction: "default",
      description: "Unable to analyze context",
      securityLogCount: 0,
    };
  }
}

/**
 * Checks if an IOC appears in security logs
 */
async function checkSecurityLogs(iocValue: string, iocType: IocType) {
  try {
    // In production, this would be an actual API call:
    // const { data } = await api.post("/oil", iocValue);

    // For demonstration, we're simulating the response
    // This should be replaced with actual API calls to Count-fakeula's OIL API

    // Simplified simulation
    let logCount = 0;
    let logTypes = [];

    // Simulate some matches based on IOC characteristics
    if (iocValue.includes("1.2.3.4")) {
      logCount = 5;
      logTypes = ["azure", "okta"]; // Authentication logs
    } else if (iocType === "domain-name" && iocValue.includes("domain")) {
      logCount = 3;
      logTypes = ["netflow", "dns"];
    } else if (iocType === "file" && iocValue.length > 50) {
      logCount = 2;
      logTypes = ["antivirus"];
    }

    return {
      logCount,
      logTypes,
      inboundCount: logTypes.filter((t) =>
        ["azure", "okta", "email"].includes(t),
      ).length,
      outboundCount: logTypes.filter((t) => ["netflow", "dns"].includes(t))
        .length,
    };
  } catch (error) {
    console.error("Error checking security logs:", error);
    return { logCount: 0, logTypes: [], inboundCount: 0, outboundCount: 0 };
  }
}

/**
 * Determines IOC direction (inbound/outbound) based on type and log analysis
 */
function determineDirection(type: IocType, logResults: any): IocDirection {
  // For IP addresses and domains, we can determine direction based on log types
  if (
    (type === "ipv4-addr" || type === "ipv6-addr" || type === "domain-name") &&
    logResults.logCount > 0
  ) {
    // If we have more inbound logs than outbound, it's likely inbound
    if (logResults.inboundCount > logResults.outboundCount) {
      return "inbound";
    }
    // If we have more outbound logs than inbound, it's likely outbound
    else if (logResults.outboundCount > logResults.inboundCount) {
      return "outbound";
    }
  }

  // Default directions based on IOC type
  if (type === "file") {
    return "default"; // Files don't have direction
  } else if (type === "url") {
    return "outbound"; // URLs are typically outbound connections
  }

  return "default";
}

/**
 * Determines threat level based on IOC type and security log presence
 */
function determineThreatLevel(type: IocType, logResults: any): ThreatLevel {
  // If we have security logs for this IOC, it's a confirmed threat
  if (logResults.logCount > 0) {
    return "HIGH";
  }

  // Assign default threat levels based on IOC type
  switch (type) {
    case "file":
      return "MEDIUM"; // File hashes are medium threat by default
    case "ipv4-addr":
    case "ipv6-addr":
      return "MEDIUM"; // IP addresses are medium threat by default
    case "domain-name":
    case "url":
      return "LOW"; // Domains and URLs are low threat by default
    case "email-addr":
    case "user-account":
      return "LOW"; // Email addresses and user accounts are low threat by default
    default:
      return "UNKNOWN";
  }
}
