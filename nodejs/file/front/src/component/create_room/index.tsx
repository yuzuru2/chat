import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

/**
 * 定数
 */
import { constant } from 'src/constant/';

/**
 * util
 */
import { u_componentDidMount } from 'src/util/u_componentDidMount';
import { u_shouldComponentUpdate } from 'src/util/u_shouldComponentUpdate';

/**
 * event
 */
import { e_create_room } from 'src/event/e_create_room';

/**
 * action_reducer
 */
import { Props } from 'src/action_reducer';
import { a_create_room } from 'src/action_reducer/r_create_room';

import { Container, LoadingContainer, LoadingImg } from 'src/component/util';

const NameText = styled.input`
  width: 250px;
  height: 35px;
  font-size: 14px;
  border-radius: 3px;
  padding: 5px;
  margin: 10px;
`;

const Upper = styled.select`
  width: 75px;
  height: 30px;
  font-size: 18px;
  margin-bottom: 10px;
`;

const RoomCreateButton = styled.button`
  color: white;
  width: 150px;
  height: 30px;
  border-radius: 6px;
  margin: 15px;
  background-color: #d9534f;
  border: 1px solid #d9534f;
`;

const BackButton = styled.button`
  color: white;
  width: 150px;
  height: 30px;
  border-radius: 6px;
  margin: 15px;
  background-color: #146d96;
  border: 1px solid #146d96;
`;

const api_name = constant.URL_LOUNGE;
const reducer_name = 'r_create_room';

/**
 * 部屋作成画面
 */
const create_room = React.memo(
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
        p.dispatch(a_create_room.create_room_display(false));
      };
    }, []);

    if (!p.r_create_room.display) {
      return (
        <LoadingContainer>
          <LoadingImg src="img/loading.gif" />
        </LoadingContainer>
      );
    }

    return (
      <>
        <Container>
          <NameText
            type="text"
            placeholder="部屋名"
            onChange={e => e_create_room.set_name(e.target.value)}
            value={p.r_create_room.create_room_name}
          />
        </Container>

        <Container>
          <p>人数</p>
        </Container>

        <Container>
          <Upper
            value={p.r_create_room.create_room_upper}
            onChange={e => e_create_room.set_upper(Number(e.target.value))}
          >
            {[...Array(14)].map((m, i) => {
              return (
                <option value={i + 2} key={i}>
                  {i + 2}
                </option>
              );
            })}
          </Upper>
        </Container>

        <Container>
          <RoomCreateButton
            onClick={() =>
              e_create_room.submit(
                p.r_create_room.create_room_name,
                p.r_create_room.create_room_upper
              )
            }
          >
            部屋をつくる
          </RoomCreateButton>
        </Container>

        <Container>
          <BackButton onClick={() => p.history.push(constant.URL_LOUNGE)}>
            もどる
          </BackButton>
        </Container>
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

export default connect(store => store)(create_room);
