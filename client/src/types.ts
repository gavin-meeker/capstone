export type Ioc = {
  key: string;
  threat: {
    indicator: {
      ip: string;
      type: string;
      description: string;
    };
  };
};
