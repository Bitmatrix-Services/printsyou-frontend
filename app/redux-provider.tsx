'use client';

import React, {FC, PropsWithChildren} from 'react';
import {Provider} from 'react-redux';
import {store} from '../store/store';

interface IReduxProvider {}

export const ReduxProvider: FC<PropsWithChildren<IReduxProvider>> = ({children}) => {
  return <Provider store={store}>{children}</Provider>;
};
