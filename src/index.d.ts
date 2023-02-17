declare const given: {
  <T = never>(key: string, callback: () => T): T
  [key: string]: never
};

export = given;
export as namespace given;
