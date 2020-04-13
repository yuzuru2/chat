import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

/**
 * event
 */
import { e_chat } from 'src/event/e_room/e_chat';

/**
 * action_reducer
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

const ChatTextArea = styled.textarea`
  width: 280px;
  height: 80px;
  font-size: 17px;
  vertical-align: top;
  white-space: pre-wrap;
  border-radius: 12px;
`;

const SendUploadContainer = styled.div`
  text-align: center;
`;
const SendButton = styled.button`
  color: white;
  background-color: #d9534f;
  border: 1px solid #d9534f;
  width: 85px;
  height: 30px;
  border-radius: 6px;
`;

const UploadLabel = styled.label`
  color: white;
  background-color: #006dd9;
  padding: 5px;
  border: double 1px #aaaaaa;
  height: 10px;
`;

const UploadInput = styled.input`
  display: none;
`;

/**
 * util
 */
import { Container } from 'src/component/util';

/**
 * 子コンポーネント
 */
import { talk_list } from 'src/component/room/chat/talk_list';

/**
 * チャット画面
 */
const chat = React.memo(
  (p: Props) => {
    const _list = talk_list();

    return (
      <>
        <Container>
          <ExitButtonContainer>
            <ExitButton onClick={() => e_chat.exit_room()}>退室</ExitButton>
          </ExitButtonContainer>
        </Container>

        <Container>
          <ChatTextArea
            placeholder="メッセージ(150文字以内)"
            id="chat_textarea"
            onChange={e => e_chat.set_message(e.target.value)}
            value={p.r_chat.chat_message}
            onKeyDown={e =>
              e.keyCode === 13 ? e_chat.submit(p.r_chat.chat_message) : ''
            }
          />
        </Container>

        <Container>
          <SendUploadContainer>
            <SendButton onClick={() => e_chat.submit(p.r_chat.chat_message)}>
              送信
            </SendButton>

            <UploadLabel htmlFor="file_upload">
              画像アップ
              <UploadInput
                type="file"
                accept="image/*"
                id="file_upload"
                onChange={e => e_chat.file_upload(e.target.files)}
              />
            </UploadLabel>
          </SendUploadContainer>
        </Container>

        <br />

        {_list}
      </>
    );
  },
  (prevProps: Props, nextProps: Props) => {
    if (0 === Object.keys(prevProps).length) {
      return false;
    }
    
    if (
      JSON.stringify(prevProps.r_room.talk_list) !==
      JSON.stringify(nextProps.r_room.talk_list)
    ) {
      return false;
    }

    if (JSON.stringify(prevProps.r_chat) !== JSON.stringify(nextProps.r_chat)) {
      return false;
    }

    return true;
  }
);

export default connect(store => store)(chat);
