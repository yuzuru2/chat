/**
 * コアモジュール
 */
import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import createRootReducer from 'src/action_reducer';

/**
 * history
 */
export const history = createBrowserHistory();

/**
 * store
 */
export const store = createStore(
  createRootReducer(history),
  {},
  compose(applyMiddleware(routerMiddleware(history)))
);

/**
 * socket
 */
import { socket_empty } from 'src/socketio';

/**
 * 定数
 */
import { constant } from 'src/constant';

/**
 * component
 */
import login from 'src/component/login';
import lounge from 'src/component/lounge';
import create_room from 'src/component/create_room';
import room from 'src/component/room';

/**
 * render
 */
render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path={constant.URL_ROOT} component={login} />
        <Route exact path={constant.URL_LOUNGE} component={lounge} />
        <Route exact path={constant.URL_CREATE_ROOM} component={create_room} />
        <Route exact path={constant.URL_ROOM} component={room} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
);

/**
 * 戻るボタンでリロード
 * https://teratail.com/questions/61484
 */
window.addEventListener('popstate', e => {
  window.location.reload();
});

socket_empty();
