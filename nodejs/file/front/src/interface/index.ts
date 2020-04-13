/**
 * トーク一覧
 */
export interface i_q_talk_list {
  talkId: string;
  userId: string;
  userName: string;
  iconId: number;
  message: string;
  kind: number;
  kidokus: string[];
  createdAt: Date;
}

/**
 * 部屋一覧
 */
export interface i_q_room_member {
  roomId: string;
  roomName: string;
  userId: string;
  userName: string;
  iconId: number;
  upper: number;
  hostId: string;
}
