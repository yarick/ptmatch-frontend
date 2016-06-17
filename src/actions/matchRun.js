import fetch from 'isomorphic-fetch';

import { retrieve } from './index';

import {
  REQUEST_METRICS,
  REQUEST_MATCH_RUN,
  REQUEST_MATCH_RUNS_BY_CONTEXT
} from './types';

export function fetchMetricsIfNeeded(recordSetId) {
  return {type: REQUEST_METRICS,
          payload: retrieve(`/RecordMatchRunMetrics?recordSetId=${recordSetId}`)};
}

export function fetchMatchRun(jobId) {
  return {type: REQUEST_MATCH_RUN,
          payload: retrieve(`/RecordMatchRun/${jobId}`)};
}

export function fetchMatchRunsByContext(contextId) {
  return {type: REQUEST_MATCH_RUNS_BY_CONTEXT,
          payload: retrieve(`/RecordMatchRun?recordMatchContextId=${contextId}`)};
}

export function createRun(recordMatchSystemInterfaceId, masterRecordSetId, recordMatchContextId, note) {
  fetch('/RecordMatchRun', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({recordMatchSystemInterfaceId, masterRecordSetId,
                          recordMatchContextId, note,
                          matchingMode: 'deduplication'})
  });
}