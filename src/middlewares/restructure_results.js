// This bundle restructures the response of the ReordmatchRun endpoint. When
// responses from this endpoint contain match results, they are nested deeply
// in FHIR bundles, and may span multiple FHIR bundles. This middleware
// flattens things out into something that should be easier for components to
// use.
import {
  REQUEST_MATCH_RUN_FULFILLED,
  REQUEST_MATCH_RUNS_BY_CONTEXT_FULFILLED
} from '../actions/types';

function restructure(payload) {
  let newPayload = {
    id: payload.id,
    meta: payload.meta,
    note: payload.note,
    recordMatchContextId: payload.recordMatchContextId,
    metrics: payload.metrics,
    status: payload.status,
    recordMatchSystemInterfaceId: payload.recordMatchSystemInterfaceId,
    masterRecordSetId: payload.masterRecordSetId
  };
  let matchResponses = payload.responses.filter((resp) => {
    let resourceEntries = resp.message.entry.filter((e) => e.resource !== undefined);
    let matchEvent = resourceEntries.find((e) => e.resource.event !== undefined && e.resource.event.code === "record-match");
    return matchEvent !== undefined;
  });
  let allEntries = matchResponses.reduce((acc, currentValue) => acc.concat(...currentValue.message.entry), []);
  let links = allEntries.filter((e) => e.link !== undefined);
  newPayload.links = links.map((l) => {
    const source = l.fullUrl;
    const target = l.link.find((nl) => nl.relation === "related").url;
    const score = l.search.score;
    return {source, target, score};
  });

  return newPayload;
}

export default function() {
  return next => action => {
    if (action.type === REQUEST_MATCH_RUN_FULFILLED &&
        action.payload.responses !== undefined) {
      action.payload = restructure(action.payload);
    }

    if (action.type === REQUEST_MATCH_RUNS_BY_CONTEXT_FULFILLED) {
      const restructuredArray = action.payload.map((p) => restructure(p));
      action.payload = restructuredArray;
    }

    return next(action);
  };
}