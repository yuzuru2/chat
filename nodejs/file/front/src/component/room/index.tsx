/**
 * コアモジュール
 */
import * as React from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

/**
 * 定数
 */
import { constant } from 'src/constant';

/**
 * util
 */
import { u_componentDidMount } from 'src/util/u_componentDidMount';
import { u_shouldComponentUpdate } from 'src/util/u_shouldComponentUpdate';

/**
 * action_reducer
 */
import { Props } from 'src/action_reducer';
import { a_room } from 'src/action_reducer/r_room';

/**
 * 子コンポーネント
 */
import Chat from 'src/component/room/chat/index';
import Chat_detail from 'src/component/room/chat_detail/index';

const api_name = constant.URL_CREATE_KIDOKU;
const reducer_name = 'r_room';

import { LoadingContainer, LoadingImg } from 'src/component/util';

/**
 * 部屋画面
 */
const room = React.memo(
  (p: Props) => {
    /**
     * componentDidMount
     */
    React.useEffect(() => {
      u_componentDidMount(api_name, p.r_global.first);
    }, []);

    /**
     * componentWillUnmount
     */
    React.useEffect(() => {
      return () => {
        p.dispatch(a_room.room_display(false));
      };
    }, []);

    if (!p.r_room.display) {
      return (
        <LoadingContainer>
          <LoadingImg src="img/loading.gif" />
        </LoadingContainer>
      );
    }

    return (
      <Tabs defaultIndex={0}>
        <TabList className={'react-tabs__tab-list＿under'}>
          <Tab>チャット</Tab>
          <Tab>詳細</Tab>
        </TabList>

        <TabPanel>
          <Chat {...this.props} />
        </TabPanel>

        <TabPanel>
          <Chat_detail {...this.props} />
        </TabPanel>
      </Tabs>
    );
  },
  (prevProps: Props, nextProps: Props) => {
    return u_shouldComponentUpdate(
      prevProps,
      nextProps,
      api_name,
      prevProps[reducer_name].display,
      nextProps[reducer_name].display,
      reducer_name
    );
  }
);

export default connect(store => store)(room);
