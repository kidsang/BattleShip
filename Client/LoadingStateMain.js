LoadingState = function() {
 	var layer = new Kinetic.Layer();
 	this.layer = layer;
 	stage.add(layer);

 	var loading = new HexLoading();
 	this.loading = loading;
 	loading.group.setX(Constants.stageWidth / 2);
 	loading.group.setY(Constants.stageHeight / 2 - 40);
 	layer.add(loading.group);

 	var text = new Kinetic.Text({
 		x:Constants.stageWidth / 2,
 		y:Constants.stageHeight / 2 + 60,
 		offset:[300, 0],
 		width:600,
 		align:'center',
 		text:'加载中...',
 		fontFamily:'黑体',
 		fill:'black',
 		fontSize:20,
 		opacity:0.8
 	});
 	layer.add(text);

 	this.done = 0;
 	this.total = Resource.jsurl.length + Resource.imgurl.length;
 	var that = this;

 	var index = 0;
 	function loadNext() {
 		var url = Resource.jsurl[index];
 		var script = document.createElement('script');
 		script.onload = function() {
 			that.increaseProgress();
 			++index;
 			if (index < Resource.jsurl.length)
 				loadNext()
 		}
 		script.src = url;
 		document.body.appendChild(script);
 	}
 	loadNext();

 	for (var i in Resource.imgurl) {
 		var url = Resource.imgurl[i];
 		var imgObject = new Image();
 		imgObject.onload = function() {
 			var name = this.src.substring(this.src.lastIndexOf('/')+1, this.src.lastIndexOf('.'));
 			Resource.imgs[name] = this;
 			that.increaseProgress();
 		}
 		imgObject.src = url;
 	}

};

LoadingState.prototype.finalize = function() {
	this.loading.finalize();
	this.layer.destroy();
};

LoadingState.prototype.step = function() {
	this.layer.draw();
};

LoadingState.prototype.increaseProgress = function() {
	++this.done;
	this.loading.setPercent(this.done / this.total);
	if (this.done >= this.total) {
		setTimeout("jumpTo(ConnectingState)", 1000);

		// global
		b2Vec2 = Box2D.Common.Math.b2Vec2;
		b2BodyDef = Box2D.Dynamics.b2BodyDef;
		b2Body = Box2D.Dynamics.b2Body;
		b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
		b2Fixture = Box2D.Dynamics.b2Fixture;
		b2World = Box2D.Dynamics.b2World;
		b2MassData = Box2D.Collision.Shapes.b2MassData;
		b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
		b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
		b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

	}
};