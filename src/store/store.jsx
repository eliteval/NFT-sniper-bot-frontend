 import { reducer } from "./reducers/index";
 import { createStore, compose } from 'redux';
 import { persistStore, persistReducer } from 'redux-persist';
 import storage from 'redux-persist/lib/storage';


 const expireReducer = require('redux-persist-expire');
 // configure Persist
 const persistConfig = {
   key: 'bot',
   storage,
   blacklist: [
   ],
   transforms: [
     expireReducer('LoginReducer', {
       expireSeconds: 3600 * 24,
       autoExpire: true,
     }),
   ],
 };
 const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
 // Persist Reducers with config
 const persistedReducer = persistReducer(persistConfig, reducer);
 // Configure store
 const configureStore = () => {
   // Create Store
   const store = createStore(
     persistedReducer,
   );
   // Persist Store
   const persistor = persistStore(store);
   // Apply middleware (saga)
   const storePersist = {
     store,
     persistor,
   };
   return storePersist;
 };
 export default configureStore();
 