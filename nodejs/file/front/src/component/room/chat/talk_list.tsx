/**
 * コアモジュール
 */
import * as React from 'react';
import styled from 'styled-components';
const reactStringReplace = require('react-string-replace');

/**
 * store history
 */
import { store } from 'src';

/**
 * 定数
 */
import { constant } from 'src/constant';
import { png } from 'src/constant/png';

/**
 * util
 */
import { Container } from 'src/component/util';

const LeftContainer = styled.div`
  flex-wrap: wrap;
`;

const Person = styled.div`
  width: 50px;
  margin: 2px;
`;

const PersonName = styled.p`
  text-align: center;
  font-size: 12px;
  word-break: break-all;
`;

const getImg = (color: string) => {
  return styled.img`
    width: 50px;
    background: ${color};
    border: 3px solid #fff;
  `;
};

const getHukidashi = (color: string) => {
  return styled.div`
    background: ${color};
    border: 3px solid #fff;
    width: 220px;
    color: black;
    word-break: break-all;
    border-radius: 12px;
    padding: 5px;
    font-size: 15px;
    text-align: left;
    word-break: break-all;
    margin: 0.5em;
    position: relative;
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: -10px;
      margin-top: -10px;
      display: block;
      width: 0px;
      height: 0px;
      border-style: solid;
      border-width: 10px 10px 10px 0;
      border-color: transparent ${color} transparent transparent;
    }
  `;
};

const HukidashiP = styled.p`
  margin: 0;
  line-height: 1.5;
`;

const Kidoku = styled.span`
  position: absolute;
  bottom: 0;
  right: 0;
`;

/**
 * 部屋(トーク履歴)
 */
export const talk_list = () => {
  return React.useMemo(() => {
    const _list = store.getState().r_room.talk_list;

    return _list.map((o, i) => {
      // システムメッセージ
      if (o.userId === null) {
        return (
          <Container key={i}>
            <p>{o.message}</p>
          </Container>
        );
      }

      // 左側
      const Img = getImg(png[o.iconId]);
      const _left = [
        <LeftContainer key={i}>
          <Person>
            <Img src={`img/${o.iconId}.png`} />
            <PersonName>{o.userName}</PersonName>
          </Person>
        </LeftContainer>
      ];

      const Hukidashi = getHukidashi(png[o.iconId]);
      // テキストなら
      if (o.kind === 0) {
        return (
          <Container key={i + 'a'}>
            {_left}
            <Hukidashi>
              <HukidashiP>
                {reactStringReplace(
                  o.message,
                  /(https?:\/\/\S+)/g,
                  (match, j) => (
                    <a
                      key={match + j}
                      href={match}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {match}
                    </a>
                  )
                )}
                <Kidoku>{`既読: ${o.kidokus.length}`}</Kidoku>
              </HukidashiP>
            </Hukidashi>
          </Container>
        );
      }

      // 画像なら
      return (
        <Container key={i + 'a'}>
          {_left}
          <Hukidashi>
            <a
              href={`${constant.THIS_URL[process.env.NODE_ENV]}/up/${
                o.message
              }`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={`up/${o.message}`} width="150" />
            </a>

            <Kidoku>{`既読: ${o.kidokus.length}`}</Kidoku>
          </Hukidashi>
        </Container>
      );
    });
  }, [store.getState().r_room.talk_list]);
};
