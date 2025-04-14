import { Ioc, IocType, ThreatLevel, IocDirection, IocContext } from "../types";
import { api } from "./api";

/**
 * Analyzes IOCs to determine threat level, context, and other metadata
 */
export class IocAnalyzer {
  /**
   * Analyzes an IOC to determine its context based on type and security logs
   */
  static async analyzeIoc(ioc: Ioc): Promise<Ioc> {
    // Clone the IOC to avoid modifying the original
    const enhancedIoc = { ...ioc };
    
    try {
      // Get the IOC type and value
      const iocType = ioc.threat.indicator.type as IocType;
      const iocValue = ioc.threat.indicator.description;
      
      // Determine known malicious indicators (could be a lookup to threat intelligence)
      const isMalicious = await this.checkMalicious(iocValue, iocType);
      
      // Check if this IOC appears in security logs
      const securityLogResults = await this.checkSecurityLogs(iocValue, iocType);
      
      // Determine direction based on log analysis
      const direction = this.determineDirection(iocType, securityLogResults);
      
      // Calculate threat level
      const threatLevel = this.determineThreatLevel(iocType, securityLogResults, isMalicious);
      
      // Generate context description
      const contextDescription = this.generateContextDescription(iocType, direction, threatLevel, securityLogResults);
      
      // Add context to the IOC
      enhancedIoc.context = {
        threatLevel,
        direction,
        description: contextDescription,
        securityLogCount: securityLogResults.logCount
      };
      
      return enhancedIoc;
    } catch (error) {
      console.error("Error analyzing IOC:", error);
      
      // Return default context if analysis fails
      enhancedIoc.context = {
        threatLevel: "UNKNOWN",
        direction: "default",
        description: "Unable to analyze indicator context",
        securityLogCount: 0
      };
      
      return enhancedIoc;
    }
  }
  
  /**
   * Check if an IOC is known to be malicious
   * In a real system, this would query threat intelligence
   */
  private static async checkMalicious(iocValue: string, iocType: IocType): Promise<boolean> {
    // This is a mock implementation - in production this would query threat intel
    // For demonstration, we'll mark some patterns as malicious
    
    // IPs that look like known bad patterns (for demonstration)
    if (iocType === "ipv4-addr" || iocType === "ipv6-addr") {
      // Example: Consider IPs ending in .99 as malicious for demo
      if (iocValue.endsWith(".99")) {
        return true;
      }
    }
    
    // Domains with suspicious patterns
    if (iocType === "domain-name") {
      // Check for algorithmically generated domain patterns
      if (/[a-z0-9]{15,}\.com/.test(iocValue)) {
        return true;
      }
      
      // Check for suspicious TLDs
      const suspiciousTLDs = [".xyz", ".top", ".club"];
      if (suspiciousTLDs.some(tld => iocValue.endsWith(tld))) {
        return true;
      }
    }
    
    // In a real implementation, this would query a threat intelligence API
    try {
      // Example of how a real implementation might look:
      // const response = await api.post('/threat-intel/check', { 
      //   value: iocValue, 
      //   type: iocType 
      // });
      // return response.data.isMalicious;
      
      return false; // Default to not malicious
    } catch (error) {
      console.error("Error checking threat intelligence:", error);
      return false;
    }
  }
  
  /**
   * Checks if an IOC appears in security logs
   */
  private static async checkSecurityLogs(iocValue: string, iocType: IocType) {
    try {
      // Query the OIL API for this IOC
      const response = await api.post(`/thecount/oil/${iocValue}`);
      const logs = response.data || [];
      
      // Count logs by type
      const logTypes = logs.map((log: any) => log.oil);
      const uniqueLogTypes = [...new Set(logTypes)];
      
      // Count inbound vs outbound indicators
      const inboundTypes = ["azure", "okta", "email"];
      const outboundTypes = ["netflow", "prisma", "helios", "suricata"];
      
      const inboundCount = logs.filter((log: any) => 
        inboundTypes.includes(log.oil)
      ).length;
      
      const outboundCount = logs.filter((log: any) => 
        outboundTypes.includes(log.oil)
      ).length;
      
      return {
        logCount: logs.length,
        logTypes: uniqueLogTypes,
        inboundCount,
        outboundCount
      };
    } catch (error) {
      console.error("Error checking security logs:", error);
      return { 
        logCount: 0, 
        logTypes: [], 
        inboundCount: 0, 
        outboundCount: 0 
      };
    }
  }
  
  /**
   * Determines IOC direction (inbound/outbound) based on type and log analysis
   */
  private static determineDirection(type: IocType, logResults: any): IocDirection {
    // For IP addresses and domains, we can determine direction based on log types
    if ((type === "ipv4-addr" || type === "ipv6-addr" || type === "domain-name") && 
        logResults.logCount > 0) {
      
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
    } else if (type === "email-addr") {
      return "inbound"; // Email addresses are typically for receiving
    }
    
    return "default";
  }
  
  /**
   * Determines threat level based on IOC type, security log presence, and malicious status
   */
  private static determineThreatLevel(
    type: IocType, 
    logResults: any, 
    isMalicious: boolean
  ): ThreatLevel {
    // If it's known malicious from threat intelligence, it's high risk
    if (isMalicious) {
      return "HIGH";
    }
    
    // If we have security logs for this IOC, it's at least medium threat
    if (logResults.logCount > 5) {
      return "HIGH";
    } else if (logResults.logCount > 0) {
      return "MEDIUM";
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
  
  /**
   * Generates a context description based on IOC analysis
   */
  private static generateContextDescription(
    type: IocType,
    direction: IocDirection,
    threatLevel: ThreatLevel,
    logResults: any
  ): string {
    // Base descriptions for different IOC types and directions
    const baseDescriptions: Record<IocType, Record<IocDirection, string>> = {
      "ipv4-addr": {
        "inbound": "Source of incoming connections",
        "outbound": "Destination of outgoing connections",
        "default": "IP address observed in network traffic"
      },
      "ipv6-addr": {
        "inbound": "Source of incoming connections",
        "outbound": "Destination of outgoing connections",
        "default": "IPv6 address observed in network traffic"
      },
      "domain-name": {
        "inbound": "Domain of incoming requests",
        "outbound": "Domain contacted by internal systems",
        "default": "Domain observed in network traffic"
      },
      "url": {
        "outbound": "URL accessed by internal systems",
        "inbound": "URL hosting incoming content",
        "default": "URL observed in network traffic"
      },
      "file": {
        "default": "File observed in the environment",
        "inbound": "File received from external source",
        "outbound": "File sent to external destination"
      },
      "email-addr": {
        "inbound": "Email sender contacting internal users",
        "outbound": "Email recipient receiving communications",
        "default": "Email address observed in communications"
      },
      "user-account": {
        "default": "User account observed in activity logs",
        "inbound": "User account authenticating to systems",
        "outbound": "User account initiating connections"
      }
    };
    
    // Get the base description
    let description = baseDescriptions[type]?.[direction] || 
                     baseDescriptions[type]?.["default"] || 
                     "Indicator observed in security data";
    
    // Add context about security log presence
    if (logResults.logCount > 0) {
      description += `. Observed in ${logResults.logCount} security logs`;
      
      // Add specific log types if available
      if (logResults.logTypes.length > 0) {
        const logTypeList = logResults.logTypes.join(", ");
        description += ` (${logTypeList})`;
      }
      
      description += ".";
    } else {
      description += ". No security logs found for this indicator.";
    }
    
    // Add threat level context
    switch (threatLevel) {
      case "HIGH":
        description += " This indicator presents a high risk and should be investigated immediately.";
        break;
      case "MEDIUM":
        description += " This indicator presents a moderate risk and should be monitored.";
        break;
      case "LOW":
        description += " This indicator presents a low risk but should be documented.";
        break;
      default:
        break;
    }
    
    return description;
  }
}