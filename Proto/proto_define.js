// @param msg {
//  @param room 房间名称
//  @param numPlayer 玩家人数上限
//  @param obstacle 障碍数量
//  @param mode 模式
// }
CREATE_BATTLE_FIELD

// @param id 战场id
CREATE_BATTLE_FIELD_DONE

REQUEST_BATTLE_FIELD_LIST

// @param bfList {
//  @param name 战场名字
//  @param numPlayer 战场当前玩家数
//  @param maxPlayer 战场最大玩家数
//  @param obstacle 战场障碍物
//  @param mode 战场模式
// }
RESPONSE_BATTLE_FIELD_LIST

// @param id 战场id
JOIN_BATTLE_FIELD

// @param playerId 玩家id
// @param mapSeed 地图种子
// @param numObstacle 障碍数量
NEW_JOIN

// @param name 玩家名称
PLAYER_JOIN

// @param playerList [{
//	@param color 玩家颜色
//	@param kinematics {
//	 @param x 
//	 @param y 
//	 @param vx 
//	 @param vy 
//	 @param angle 
//	 @param va 
//   }
// }]
SYNC_PLAYER_LIST

REQUEST_SYNC_TIME

// @servTime 服务器当前时间
RESPONSE_SYNC_TIME

// @param action
// @param isActive
REQUEST_MOVE

// // @param msg {
// //  @param weapon 当前武器index
// //  @param x 当前舰船x坐标
// //  @param y 当前舰船y坐标
// //  @param angle 当前舰船角度
// // }
// REQUEST_FIRE

// @param msg {
//  @param id 开火的玩家id
//  @param weapon 当前武器index
//  @param x 当前舰船x坐标
//  @param y 当前舰船y坐标
//  @param angle 当前舰船角度
// }
FIRE

// UPLOAD_POSITION

// // @param shipList {
// //	@param kinematics {
// //	 @param x 
// //	 @param y 
// //	 @param vx 
// //	 @param vy 
// //	 @param angle 
// //	 @param va 
// //   }
// // }
// SYNC_POSITIONS

// @param action
// @param isActive
UPLOAD_ACTION

// @param action
// @param isActive
// @param pkg {
// 	@param x 
// 	@param y 
// 	@param vx 
// 	@param vy 
// 	@param angle 
// 	@param va 
// }
UPLOAD_KINEMATICS

// @param id
// @param action
// @param isActive
// @param pkg {
// 	@param x 
// 	@param y 
// 	@param vx 
// 	@param vy 
// 	@param angle 
// 	@param va 
// }
SYNC_KINEMATICS
