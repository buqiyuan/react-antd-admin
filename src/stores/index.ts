import { createContext, useContext } from 'react';

import { tagsViewStore } from './tags-view';
import { userStore } from './user';
import { wsStore } from './ws';

export const stores = { userStore, wsStore, tagsViewStore };

export const RootStoreContext = createContext(stores);

export const useStores = () => useContext(RootStoreContext);
