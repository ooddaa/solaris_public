export type Node = {
  labels: string[];
  properties: {
    [key: string]: string | boolean | (string[] | number[] | boolean[]);
  };
  identity: { low: number; high: number };
  relationships?: {
    inbound: any[];
    oubound: any[];
  };
};
export interface EnhancedNode extends Node {
  relationships?: {
    inbound: any[];
    oubound: any[];
  };
  getAllRelationshipsAsArray: () => any[]
  getHash: () => string;
};

export type SimplifiedNode = {
  labels: string[],
  properties: Object,
}

export type SimplifiedRelationship = {
  labels: string[],
  properties?: Object,
  necessity?: "required" | "optional",
  direction?: "outbound" | ">" | "inbound" | "<",
  partnerNode: SimplifiedNode, 
}

export type Result = { 
  success: boolean,
  reason?: string,
  parameters?: Object,
  data: (EnhancedNode|any)[],
}