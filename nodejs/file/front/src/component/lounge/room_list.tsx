/**
 * コアモジュール
 */
import * as React from 'react';
import * as _ from 'lodash';
import styled from 'styled-components';

/**
 * store
 */
import { store } from 'src';

/**
 * event
 */
import { e_lounge } from 'src/event/e_lounge';

/**
 * interface
 */
import { i_q_room_member } from 'src/interface';

/**
 * 定数
 */
import { png } from 'src/constant/png';

/**
 * util
 */
import { Container } from 'src/component/util';

const RoomContainer = styled.div`
  width: 280px;
  color: black;
  background-color: white;
  border: 1px solid white;
  border-color: white;
  border-radius: 6px;
  margin: 10px;
`;

const RoomName = styled.h2`
  font-size: 17px;
  text-align: center;
  margin: 0;
`;

const RoomUpper = styled.p`
  text-align: center;
  margin: 2px;
`;

const RoomMemberContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 280px;
  margin-left: 10px;
`;

/**
 * entering_button
 */
const EnteringContainer = styled.div`
  text-align: center;
`;

const EnteringButton = styled.button`
  color: white;
  background-color: #d9534f;
  border: 1px solid #d9534f;
  width: 100px;
  height: 30px;
  border-radius: 6px;
`;

/**
 * user_list
 */
const PersonContainer = styled.div`
  width: 45px;
  margin: 2px;
`;

const PersonName = styled.p`
  word-wrap: break-word;
  text-align: center;
  font-size: 8px;
`;

const get_img = (color: string) => {
  return styled.img`
    width: 45px;
    background: ${color};
  `;
};

/**
 * 部屋一覧
 */
export const RoomList = () => {
  return React.useMemo(() => {
    const _room_list: i_q_room_member[][] = _.sortBy(
      _.groupBy(store.getState().r_lounge.room_list, 'roomId'),
      item => -item[0]['roomId']
    );

    return _room_list.map((m, i) => {
      return (
        <Container key={i}>
          <RoomContainer>
            <RoomName>{_room_list[i][0].roomName}</RoomName>
            <RoomUpper>
              {`${_room_list[i].length}/${_room_list[i][0].upper}`}
            </RoomUpper>
            {entering_button(_room_list[i])}
            <RoomMemberContainer>
              {user_list(_room_list[i])}
            </RoomMemberContainer>
          </RoomContainer>
        </Container>
      );
    });
  }, [JSON.stringify(store.getState().r_lounge.room_list)]);
};

const entering_button = (room_list: i_q_room_member[]) => {
  if (room_list.length < room_list[0].upper) {
    return (
      <EnteringContainer>
        <EnteringButton
          onClick={() => e_lounge.entering_room(room_list[0].roomId)}
        >
          入室
        </EnteringButton>
      </EnteringContainer>
    );
  }

  return [];
};

const user_list = (room_list: i_q_room_member[]) => {
  return room_list.map((m, i) => {
    const Img = get_img(png[room_list[i].iconId]);

    return (
      <PersonContainer key={i}>
        <Img src={`img/${room_list[i].iconId}.png`} />
        <PersonName>{room_list[i].userName}</PersonName>
      </PersonContainer>
    );
  });
};
