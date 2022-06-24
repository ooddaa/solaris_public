export type EnhancedNode = {
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