
// @param name 玩家名称
// SET_PLAYER_NAME

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

// @param msg {
//  @param weapon 当前武器index
//  @param x 当前舰船x坐标
//  @param y 当前舰船y坐标
//  @param angle 当前舰船角度
// }
REQUEST_FIRE

// @param msg {
//  @param id 开火的玩家id
//  @param weapon 当前武器index
//  @param x 当前舰船x坐标
//  @param y 当前舰船y坐标
//  @param angle 当前舰船角度
// }
FIRE

// @param msg {
// 	@param x 
// 	@param y 
// 	@param vx 
// 	@param vy 
// 	@param angle 
// 	@param va 
// }
UPLOAD_POSITION

// @param shipList {
//	@param kinematics {
//	 @param x 
//	 @param y 
//	 @param vx 
//	 @param vy 
//	 @param angle 
//	 @param va 
//   }
// }
SYNC_POSITIONS