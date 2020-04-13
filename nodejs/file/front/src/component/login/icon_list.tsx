/**
 * コアモジュール
 */
import * as React from 'react';
import styled from 'styled-components';

/**
 * store
 */
import { store } from 'src';

/**
 * event
 */
import { e_login } from 'src/event/e_login';

/**
 * 定数
 */
import { png } from 'src/constant/png';

const get_img = (color: string, bol: boolean) => {
  return styled.img`
    width: 48px;
    height: 48px;
    margin: 3px;
    border: solid 2px white;
    background: ${color};
    opacity: ${bol === true ? 1 : 0.3};
  `;
};

/**
 * ログイン画面 アイコン
 */
export const IconList = () => {
  return React.useMemo(() => {
    return [...Array(26)].map((_, i) => {
      const Img = get_img(png[i], i === store.getState().r_login.login_icon_id);
      return (
        <Img
          src={`img/${i}.png`}
          key={i}
          onClick={() => e_login.set_icon_id(i)}
        />
      );
    });
  }, [store.getState().r_login.login_icon_id]);
};
