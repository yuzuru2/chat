import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

/**
 * event
 */
import { e_chat_detail } from 'src/event/e_room/e_chat_detail';

/**
 * reducer
 */
import { Props } from 'src/action_reducer';

const ExitButtonContainer = styled.div`
  margin-top: 8px;
  margin-bottom: 3px;
  width: 280px;
  text-align: right;
`;

const ExitButton = styled.button`
  color: white;
  background-color: #d9534f;
  border: 1px solid #d9534f;
  width: 70px;
  height: 30px;
  border-radius: 6px;
`;

const Upper = styled.div`
  text-align: center;
`;

const MemberContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 280px;
`;

import { Container } from 'src/component/util';

/**
 * 子コンポーネント
 */
import { room_info } from 'src/component/room/chat_detail/room_info';
import { host } from 'src/component/room/chat_detail/host';

/**
 * チャット詳細画面
 */
const chat_detail = React.memo(
  (p: Props) => {
    const _room_info = room_info();
    const _host = host();

    return (
      <>
        <Container>
          <ExitButtonContainer>
            <ExitButton onClick={() => e_chat_detail.exit_room()}>
              退室
            </ExitButton>
          </ExitButtonContainer>
        </Container>

        <Container>
          <div>
            <h2>{`${p.r_room.room_member[0].roomName}`}</h2>
            <Upper>
              {`${p.r_room.room_member.length}/${p.r_room.room_member[0].upper}`}
            </Upper>
          </div>
        </Container>

        <Container>
          <MemberContainer>{_room_info}</MemberContainer>
        </Container>

        {p.r_room.user_id === p.r_room.room_member[0].hostId ? _host : ''}
      </>
    );
  },
  (prevProps: Props, nextProps: Props) => {
    if (0 === Object.keys(prevProps).length) {
      return false;
    }
    
    if (
      JSON.stringify(prevProps.r_room.room_member) !==
      JSON.stringify(nextProps.r_room.room_member)
    ) {
      return false;
    }

    if (
      JSON.stringify(prevProps.r_chat_detail) !==
      JSON.stringify(nextProps.r_chat_detail)
    ) {
      return false;
    }

    return true;
  }
);

export default connect(store => store)(chat_detail);
