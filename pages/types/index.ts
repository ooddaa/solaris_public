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

/** I don't want to be passing Relationship[] around, do I? */
export interface VerificationRequest {
  // endNode === 'VerificationRequest' // see addNaturalPersonVerificationRequest
  // _hash // verificationRequestHash: endNode.properties._hash,
  // who requested 
  // what is being requested
  // all ids of 
  // OWNER of the Attribute, 
  // Attribute
  // REQUESTER
}

// const { ATTRIBUTE_HASH, REQUESTER, VERIFIER, TIMELIMIT, otherConditions, _hash, _uuid, _label, _labels, _date_created, _template } = verificationEvent?.verificationRequest?.endNode.properties

export interface VerificationEvent {
  available: boolean;
  verificationRequestHash: string | null;
  verificationRequest?: Relationship; // well this should be VerificationRequest
  result: boolean | null;
  reason?: string;
  verifierCredentials: string; // lets sound smart, shall we. This needs to be a (User { _hash }), but for now it would be just a string mapped to (User { USER_ID: verifierCredentials }) of who actually provides the VerificationEvent. Not sure why I'm fucking up the names, but it's late and I'm tired.
}