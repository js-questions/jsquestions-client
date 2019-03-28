export const api = BASE_URL => store => next => action => {
  const { _api } = action;
  if (!_api) return next(action);

  const defaultHeaders = {
    'Content-Type': 'application/json'
  };
  const authToken = store.getState().auth.accessToken;
  if (authToken) defaultHeaders['Authorization'] = `Bearer ${authToken}`;
  const headers = {
    ...defaultHeaders,
    ..._api.headers
  };
  const body = _api.body ? JSON.stringify(_api.body) : undefined;

  const method = action.method || 'GET';

  fetch(BASE_URL + _api.endpoint, {
    method,
    headers,
    body
  })
    .then(res => res.json())
    .then(data => {
      // if (_api.schema) data = normalizr(data, _api.schema)
      store.dispatch({
        type: action.type + '_SUCCESS',
        data
      });
    })
    .catch(error => {
      store.dispatch({
        type: action.type + '_FAILURE',
        error
      });
    });

  next({
    type: action.type + '_PENDING'
  });
};