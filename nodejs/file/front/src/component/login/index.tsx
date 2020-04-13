import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

/**
 * event
 */
import { e_login } from 'src/event/e_login';

/**
 * reducer
 */
import { Props } from 'src/action_reducer';
import { a_login } from 'src/action_reducer/r_login';

/**
 * 定数
 */
import { constant } from 'src/constant';

/**
 * util
 */
import { u_componentDidMount } from 'src/util/u_componentDidMount';
import { u_shouldComponentUpdate } from 'src/util/u_shouldComponentUpdate';

const ImgContainer = styled.div`
  flex-wrap: wrap;
  max-width: 310px;
`;

const NameText = styled.input`
  width: 250px;
  height: 35px;
  font-size: 14px;
  border-radius: 3px;
  padding: 5px;
  margin: 10px;
`;

const LoginButton = styled.button`
  color: white;
  background-color: #d9534f;
  border: 1px solid #d9534f;
  width: 200px;
  height: 40px;
  border-radius: 6px;
`;

/**
 * util
 */
import { Container, LoadingContainer, LoadingImg } from 'src/component/util';

/**
 * 子コンポーネント
 */
import { IconList } from 'src/component/login/icon_list';

const api_name = constant.URL_ROOT;
const reducer_name = 'r_login';

/**
 * ログイン画面
 */
const login = React.memo(
  (p: Props) => {
    const icon = IconList();

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
        p.dispatch(a_login.login_display(false));
      };
    }, []);

    if (!p.r_login.display) {
      return (
        <LoadingContainer>
          <LoadingImg src="img/loading.gif" />
        </LoadingContainer>
      );
    }

    return (
      <>
        <Container>
          <h1>いつちゃ</h1>
        </Container>

        <Container>
          <ImgContainer>{icon}</ImgContainer>
        </Container>

        <Container>
          <NameText
            type="text"
            placeholder="名前を入れてね"
            onChange={e => e_login.set_name(e.target.value)}
            onKeyDown={e => (e.keyCode === 13 ? e_login.submit() : '')}
            value={p.r_login.login_name}
          />
        </Container>

        <Container>
          <LoginButton onClick={() => e_login.submit()}>
            チャットをはじめる
          </LoginButton>
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

export default connect(store => store)(login);
