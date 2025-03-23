export type ThreatLevel = "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";

export type IocType =
  | "ipv4-addr"
  | "ipv6-addr"
  | "domain-name"
  | "url"
  | "file"
  | "email-addr"
  | "user-account";

export type IocDirection = "inbound" | "outbound" | "default";

export type IocContext = {
  threatLevel: ThreatLevel;
  direction: IocDirection;
  description: string;
  securityLogCount: number;
};

export type Ioc = {
  threat: {
    indicator: {
      ip?: string;
      type: IocType;
      description: string;
      extensions?: {
        internal?: boolean;
      };
    };
  };
  context?: IocContext;
};

export type SecurityLog = {
  source: string;
  timestamp: string;
  details: Record<string, unknown>;
};
