// this is just an old copy of the catapult code that I first ported...basically a placeholder 
define(["controllers/physics/actors/ActorsController","easel","box2d","config/config"],function(e){var t=function(t,n,r,i,s,o,u,a,f,l,c,h,p,d){var v=Box2D.Common.Math.b2Vec2,m=Box2D.Dynamics.b2BodyDef,g=Box2D.Dynamics.b2Body,y=Box2D.Dynamics.b2FixtureDef,b=Box2D.Dynamics.b2Fixture,w=Box2D.Dynamics.b2World,E=Box2D.Collision.Shapes.b2PolygonShape,S=Box2D.Collision.Shapes.b2CircleShape,x=Box2D.Dynamics.b2DebugDraw,T=Box2D.Collision.Shapes.b2MassData,N=Box2D.Dynamics.Joints.b2RevoluteJointDef,C=Box2D.Dynamics.Joints.b2RevoluteJoint,k,L,A,O,M,_,D,P,H=!1,B=!1,j=!1,F=new e(u,a,s,o),I=function(){var e=new m;e.position.Set(c/o,h/o);e.type=g.b2_dynamicBody;var t=d+"imgs/vehicles/catapults/common/cannonball.png",n=53,r=44,s={x:c/o,y:h/o},u="ball",a=!1,f=null,l=F.createSkin(t,n,r,s,u,a,f);i.addChild(l);var p=20,v=.9,y=.5,b=20,w=20,E="teamB",S={shape:"circle",type:"dynamic"};k=F.createActor("cannonball",l,p,v,y,S,n,r,b,w,E)},q=function(){var e=new N;e.enableMotor=!0;e.Initialize(L,M,new v(0,0));e.localAnchorA=new v(80/o,0);e.localAnchorB=new v(0,0);D=s.CreateJoint(e);D.SetMaxMotorTorque(1e6);var t=new N;t.enableMotor=!0;t.Initialize(L,O,new v(0,0));t.localAnchorA=new v(-80/o,0);t.localAnchorB=new v(0,0);P=new N;P=s.CreateJoint(t);P.SetMaxMotorTorque(1e6)},R=function(){var e=new m;e.position.Set(250/o,200/o);e.type=g.b2_dynamicBody;var t=new S(40/o),n=new y;n.shape=t;n.friction=.9;n.density=30;n.restitution=.1;O=s.CreateBody(e);O.CreateFixture(n);var r=new m;r.position.Set(450/o,200/o);r.type=g.b2_dynamicBody;var i=new S(40/o),u=new y;u.shape=i;u.friction=.9;u.density=30;u.restitution=.1;M=s.CreateBody(r);M.CreateFixture(u)},U=function(){var e=new N;e.enableMotor=!0;e.enableLimit=!0;e.Initialize(L,A,new v(0,0));e.localAnchorA=new v(-80/o,-90/o);e.localAnchorB=new v(60/o,0);_=s.CreateJoint(e);_.SetMotorSpeed(1e3);_.SetLimits(-Math.PI,Math.PI/3);_.SetMaxMotorTorque(1)},z=function(){var e=new m;e.allowSleep=!1;e.position.Set(210/o,110/o);e.type=g.b2_dynamicBody;var t=new E;t.SetAsOrientedBox(150/o,10/o,new v(0,0),0);var n=new y;n.shape=t;n.friction=.9;n.density=5;n.restitution=.1;var r=new E;r.SetAsOrientedBox(10/o,20/o,new v(-140/o,-30/o),0);var i=new y;i.shape=r;i.friction=.9;i.density=10;i.restitution=.1;A=s.CreateBody(e);A.CreateFixture(n);A.CreateFixture(i)},W=function(){var e=new m;e.position.Set(c/f,h/l);e.type=g.b2_dynamicBody;var t=new E;t.SetAsOrientedBox(125/o,20/o,new v(0,0),0);var n=new y;n.shape=t;n.friction=.9;n.density=50;n.restitution=.1;var r=new E;r.SetAsOrientedBox(20/o,60/o,new v(-80/o,-40/o),0);var i=new y;i.shape=r;i.friction=.9;i.density=1;i.restitution=.1;L=s.CreateBody(e);L.CreateFixture(n);L.CreateFixture(i)},X=function(e){_.SetMaxMotorTorque(e);j=!1},V=function(){var e;B&&(e=1);H&&(e=-1);if(!B&&!H){e=P.GetMotorSpeed()*.9;Math.abs(e)<.1&&(e=0)}P.SetMotorSpeed(e);D.SetMotorSpeed(e)},$=function(e){if(e==="LEFT"){B=!1;H=!0}else{B=!0;H=!1}},J=function(){var e,t,r=0,i=0,s=n.width,u=n.height,a=2800,f=800,l=a-700,c=0,h=f/2,p=0;V();if(j){e=L.GetWorldCenter().x*o;t=L.GetWorldCenter().y*o}else{e=k.GetWorldCenter().x*o;t=k.GetWorldCenter().y*o}e=s/2-e;e<-l&&(e=-l);e>c&&(e=c);r=e;t=u/2-t;t<p&&(t=p);t>h&&(t=h);i=t;return{x:r,y:i}},K=function(){W();z();U();R();q();I()},Q=function(){K()},G="right",Y=function(e){G=e},Z=function(){return G};return{spawn:Q,setMaxMotorTorque:X,setKeyPressed:$,setMotorSpeed:V,getCameraFocus:J,setDirection:Y}};return t});