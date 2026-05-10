import NodeCache from 'node-cache';

export const apiCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });
export const feedCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });
