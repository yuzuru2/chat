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
 * 定数
 */
import { png } from 'src/constant/png';

const Person = styled.div`
  width: 45px;
  margin: 5px;
`;

const Name = styled.p`
  word-wrap: break-word;
  text-align: center;
  font-size: 12px;
`;

const get_img = (color: string, bol: boolean) => {
  return styled.img`
    width: 45px;
    background: ${color};
    opacity: ${bol === true ? 1.0 : 0.3};
  `;
};

/**
 * 部屋詳細(アイコン部分)
 */
export const room_info = () => {
  return React.useMemo(() => {
    const _choise_user_id = store.getState().r_chat_detail
      .chat_detail_choise_id;

    const _list = store.getState().r_room.room_member;
    const _user_id = store.getState().r_room.user_id;

    return _list.map((m, i) => {
      const Img = get_img(
        png[m.iconId],
        m.userId === _choise_user_id &&
          m.hostId === _user_id &&
          m.userId !== _user_id
      );
      return (
        <Person key={i}>
          <Img
            src={`img/${m.iconId}.png`}
            onClick={() => e_chat_detail.choise_user(m.userId)}
          />
          <Name>
            {m.userId === m.hostId ? `${m.userName}\n(host)` : m.userName}
          </Name>
        </Person>
      );
    });
  }, [
    JSON.stringify(store.getState().r_room.room_member),
    store.getState().r_chat_detail.chat_detail_choise_id
  ]);
};
