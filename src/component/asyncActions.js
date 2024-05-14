const redux = require("redux");
const createStore = redux.createStore;
const thunkMiddleware = require("redux-thunk").default;
const applyMiddleware = redux.applyMiddleware;
const axios = require("axios");

const intialState = {
  loading: false,
  users: [],
  error: "",
};

const FETCH_USERS_REQUESTED = "FETCH_USERS_REQUESTED";
const FETCH_USERS_SUCCEEDED = "FETCH_USERS_SUCCEEDED";
const FETCH_USERS_FAILED = "FETCH_USERS_FAILED";

const fetchUsersRequest = () => {
  return {
    type: FETCH_USERS_REQUESTED,
  };
};

const fetchUsersSuccess = (users) => {
  return {
    type: FETCH_USERS_SUCCEEDED,
    payload: users,
  };
};

const fetchUsersFailed = (error) => {
  return {
    type: FETCH_USERS_FAILED,
    payload: error,
  };
};

const fetchUsers = () => {
  return;
};

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
