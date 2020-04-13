import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

/**
 * 定数
 */
import { constant } from 'src/constant';

import { u_componentDidMount } from 'src/util/u_componentDidMount';
import { u_shouldComponentUpdate } from 'src/util/u_shouldComponentUpdate';

/**
 * event
 */
import { e_lounge } from 'src/event/e_lounge';

/**
 * action_reducer
 */
import { Props } from 'src/action_reducer';
import { a_lounge } from 'src/action_reducer/r_lounge';

/**
 * util
 */
import { Container, LoadingContainer, LoadingImg } from 'src/component/util';

/**
 * 子コンポーネント
 */
import { RoomList } from 'src/component/lounge/room_list';

const RoomCreateButton = styled.button`
  color: white;
  background-color: #d9534f;
  border: 1px solid #d9534f;
  width: 200px;
  height: 35px;
  border-radius: 6px;
`;

const LogoutButton = styled.button`
  color: white;
  background-color: #146d96;
  border: 1px solid #146d96;
  width: 200px;
  height: 35px;
  border-radius: 6px;
`;

const api_name = constant.URL_LOUNGE;
const reducer_name = 'r_lounge';

/**
 * ラウンジ画面
 */
const lounge = React.memo(
  (p: Props) => {
    const room_list = RoomList();

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
        p.dispatch(a_lounge.lounge_display(false));
      };
    }, []);

    if (!p.r_lounge.display) {
      return (
        <LoadingContainer>
          <LoadingImg src="img/loading.gif" />
        </LoadingContainer>
      );
    }

    return (
      <>
        <Container>
          <RoomCreateButton onClick={() => e_lounge.create_room()}>
            部屋をつくる
          </RoomCreateButton>
        </Container>

        <br />

        <Container>
          <LogoutButton onClick={() => e_lounge.logout()}>
            ログアウト
          </LogoutButton>
        </Container>

        <br />

        {room_list}
      </>
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

export default connect(store => store)(lounge);
