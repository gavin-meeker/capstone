// Basic IOC types
export type IocType = 
  | "ipv4-addr" 
  | "ipv6-addr" 
  | "domain-name" 
  | "url" 
  | "file"
  | "email-addr"
  | "user-account";

// Main IOC interface
export interface Ioc {
  key?: string;
  threat: {
    indicator: {
      ip?: string;
      type: IocType | string;
      description: string;
      file?: {
        hash?: {
          md5?: string;
          sha1?: string;
          sha256?: string;
        }
      };
      email?: {
        address?: string;
      };
      domain?: string;
      url?: string;
      extensions?: {
        internal?: boolean;
      };
    };
  };
}

// Security log sources
export type LogSource = 
  | "azure" 
  | "okta" 
  | "prisma" 
  | "helios" 
  | "email"
  | "suricata"
  | "netflow"
  | "coxsight";

// Simple security log format for display
export interface SecurityLog {
  timestamp: string;
  key: string;
  oil: LogSource;
}

// NetFlow data format
export interface NetFlowData {
  timestamp?: string;
  network: {
    transport: string;
    application?: string;
  };
  source: {
    ip: string;
    port: string;
  };
  destination: {
    ip: string;
    port: string;
  };
  event: {
    start: string;
    end?: string;
  };
  key?: string;
  oil?: string;
}

// Passive DNS Record
export interface PassiveDnsRecord {
  data: string;
  name: string;
  type: string;
  count: number;
  event: {
    start: string;
    end: string;
  };
}

// Passive DNS Response
export interface PassiveDnsResponse {
  dns: {
    answers: PassiveDnsRecord[];
  };
}