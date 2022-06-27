export type Node = {
  labels: string[];
  properties: {
    _hash: string;
    [key: string]: string | boolean | (string[] | number[] | boolean[]);
  };
  identity: { low: number; high: number };
};
export interface EnhancedNode extends Node {
  relationships?: {
    inbound: any[];
    oubound: any[];
  };
  getAllRelationshipsAsArray: () => any[]
  getHash: () => string;
};

export interface Relationship extends Node {
  startNode: Node|EnhancedNode,
  endNode: Node|EnhancedNode,
}

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