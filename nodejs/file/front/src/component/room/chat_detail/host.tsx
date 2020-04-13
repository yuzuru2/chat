/**
 * コアモジュール
 */
import * as React from 'react';
import styled from 'styled-components';

/**
 * store history
 */
import { store } from 'src';

/**
 * event
 */
import { e_chat_detail } from 'src/event/e_room/e_chat_detail';

/**
 * util
 */
import { Container } from 'src/component/util';

const NameInput = styled.input`
  width: 250px;
  height: 35px;
  font-size: 14px;
  border-radius: 3px;
  padding: 5px;
  margin: 10px;
`;

const NameChangeButton = styled.div`
  color: white;
  background-color: #d9534f;
  border: 1px solid #d9534f;
  width: 70px;
  height: 25px;
  border-radius: 6px;
  text-align: center;
  margin-bottom: 15px;
`;

const PullDown = styled.select`
  width: 75px;
  height: 30px;
  font-size: 18px;
`;

const HostChangeButton = styled.button`
  color: white;
  width: 150px;
  height: 30px;
  border-radius: 6px;
  margin: 15px;
  background-color: #d9534f;
  border: 1px solid #d9534f;
`;

const KickButton = styled.button`
  color: white;
  width: 150px;
  height: 30px;
  border-radius: 6px;
  margin: 15px;
  background-color: #146d96;
  border: 1px solid #146d96;
`;

/**
 * ホスト権限
 */
export const host = () => {
  return React.useMemo(() => {
    const _room_name = store.getState().r_chat_detail.chat_detail_room_name;
    const _upper = store.getState().r_room.room_member[0].upper;

    return (
      <>
        <Container key={1}>
          <NameInput
            type="text"
            placeholder="新しい部屋名"
            id="room_detail_name_text"
            onChange={e => e_chat_detail.set_room_name(e.target.value)}
            onKeyDown={e =>
              e.keyCode === 13 ? e_chat_detail.submit_room_name() : ''
            }
            value={_room_name}
          />
        </Container>

        <Container>
          <NameChangeButton onClick={() => e_chat_detail.submit_room_name()}>
            変更
          </NameChangeButton>
        </Container>

        <Container>
          <PullDown
            value={_upper}
            onChange={e => e_chat_detail.set_upper(Number(e.target.value))}
          >
            {[...Array(14)].map((_, i) => (
              <option value={i + 2} key={i}>
                {i + 2}
              </option>
            ))}
          </PullDown>
        </Container>

        <br />

        <Container>
          <HostChangeButton onClick={() => e_chat_detail.change_host()}>
            権限移譲
          </HostChangeButton>

          <KickButton onClick={() => e_chat_detail.kick()}>キック</KickButton>
        </Container>
      </>
    );
  }, [
    JSON.stringify(store.getState().r_room.room_member),
    JSON.stringify(store.getState().r_chat_detail)
  ]);
};
