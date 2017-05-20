var json={
		server:{
			agentList:[{agent_id:1,ggport:'8888',objectList:[{objectid:1,objectname:'a',objecttype:'EXTRACT'},
			{objectid:2,objectname:'b',objecttype:'EXTRACT'}]},
			           {agent_id:2,ggport:'4433',objectList:[{objectid:3,objectname:'c',objecttype:'PUMP'},
			           {objectid:4,objectname:'d',objecttype:'REPLICAT'}]}],
			dbinfoList:[{id:1,sid:'l'},{id:2,sid:'j'}]
		}
};
$(function(){
	$("#top_server").css({"left":"5%","top":"50%"});
	$(document).on({
		mouseover:function(){$(this).css({"background-color":"#79deff","box-shadow":"#909090 0px 0px 10px",
			"-webkit-box-shadow": "#909090 0px 0px 10px","-moz-box-shadow": "#909090 0px 0px 10px"});},
		mouseout:function(){$(this).css({"background-color":"","box-shadow":"",
			"-webkit-box-shadow": "","-moz-box-shadow": ""});}
	},".instanceNode,.dbNode,.extNode,.pmpNode,.repNode,.trailNode");

			 var obj= json.server;
			 var instance=obj.agentList;
			 var dbInfo=obj.dbinfoList;
			 var nodeNumber=instance.length+dbInfo.length;
			 elementLocation(nodeNumber,instance,dbInfo);
			 jsPlumb.ready(function() {
				jsPlumb.draggable("top_server");
				var hoverPaintStyle = { lineWidth:2,strokeStyle:"#818AA3" };
				jsPlumb.importDefaults({  
				    DragOptions : { cursor: 'pointer'}, //拖动时鼠标停留在该元素上显示指针，通过css控制  
				    EndpointStyles : { width:10, height:10,cursor: 'pointer'},//连接点的默认颜色  
				    Connector : "Straight", //设置连线为直线  
				    Endpoint : "Rectangle",//连接点的默认形状  
				    Anchor : "Left",//连接点的默认位置  
				    MaxConnections:1000,//同上  
					ConnectionsDetachable:false,
					HoverPaintStyle:hoverPaintStyle
				});  
				var defaults = {  
				    paintStyle:{ fillStyle:"#B4B9C5" },//设置连接点的颜色  
				    connectorStyle:{ strokeStyle:"#B4B9C5", lineWidth:2 },//连线颜色、粗细  
				    connector:[ "Flowchart", { stub:[10, 20], gap:5, cornerRadius:2} ],
				    isSource:true,
				    isTarget:true,
				    endpoint:"Blank"
				};  
				var rootnode={
					endpoint:["Image", { src:"images/sub.png" }],//设置连接点的形状为圆形  
				    paintStyle:{ fillStyle:"#B4B9C5" },//设置连接点的颜色  
				    connectorStyle:{ strokeStyle:"#B4B9C5", lineWidth:2 },//连线颜色、粗细  
//				    connector:["Straight",{gap:5}],
				    connector:[ "Flowchart", { stub:[10, 20], gap:10, cornerRadius:2} ],
				    cssClass:"cursorEndpoint"
				};
				var s1=jsPlumb.addEndpoint("top_server", {anchor:"Right"},rootnode);//将exampleEndpoint1类型的点绑定到id为top_server的元素上  
				//添加gg拓扑关系
				for(var i=0;i<instance.length;i++){
					var objList=instance[i].objectList;
					jsPlumb.draggable("instance_"+instance[i].agent_id);
					var t1=jsPlumb.addEndpoint("instance_"+instance[i].agent_id,defaults);//将exampleEndpoint2类型的点绑定到id为state3的元素上  
					jsPlumb.connect({source:s1, target:t1});
					if(objList.length>0){
						var obj_root=jsPlumb.addEndpoint("instance_"+instance[i].agent_id, {anchor:"Right"},rootnode);
						//对instance绑定click事件
						obj_root.bind("click", function(endpoint) {
							if(endpoint.getParameter("img")&&endpoint.getParameter("img")=="add"){
								endpoint.setParameter("img","sub");
								endpoint.setImage("images/sub.png");
								for(var k=0;k<endpoint.connections.length;k++){
									endpoint.connections[k].setVisible(true);
									$("#"+endpoint.connections[k].targetId).show();
									jsPlumb.show(endpoint.connections[k].targetId);
									var oid=endpoint.connections[k].targetId.split("_")[1];
									$("div[id*=_"+oid+"_]").show();
								}
								//隐藏其他instance
								for(var m=0;m<instance.length;m++){
									if(endpoint.elementId!="instance_"+instance[m].agent_id){
										var conn=jsPlumb.select({source:"instance_"+instance[m].agent_id});
										for(var n=0;n<conn.length;n++){
											$("#"+conn.get(n).targetId).hide();
											jsPlumb.hide(conn.get(n).targetId,true);
											var oid=conn.get(n).targetId.split("_")[1];
											$("div[id*=_"+oid+"_]").hide();
										}
										conn.get(0).endpoints[0].setParameter("img","add");
										conn.get(0).endpoints[0].setImage("images/add.png");
										conn.setVisible(false);
									}
								}
							}else{
								endpoint.setParameter("img","add");
								endpoint.setImage("images/add.png");
								for(var k=0;k<endpoint.connections.length;k++){
									endpoint.connections[k].setVisible(false);
									$("#"+endpoint.connections[k].targetId).hide();
									jsPlumb.hide(endpoint.connections[k].targetId,true);
									var oid=endpoint.connections[k].targetId.split("_")[1];
									$("div[id*=_"+oid+"_]").hide();
								}
							}
						    if (window.navigator.userAgent.indexOf('MSIE') > -1) {
						    	jsPlumb.repaintEverything();
						    }
						});
						//添加object拓扑关系
						for(var j=0;j<objList.length;j++){
							var objInfo=objList[j];
							jsPlumb.draggable("obj_"+objList[j].objectid);
							var o1=jsPlumb.addEndpoint("obj_"+objList[j].objectid,defaults);//将exampleEndpoint2类型的点绑定到id为state3的元素上  
							jsPlumb.connect({source:obj_root, target:o1});
							var trail_root=jsPlumb.addEndpoint("obj_"+objInfo.objectid,{anchor:"Right"}, defaults);
							var exttrail=$.trim(objInfo.exttrail),rmttrail=$.trim(objInfo.rmttrail),exttrailname="",rmttrailname="",t1="",t2="";
							if(exttrail&&rmttrail){
								exttrailname= exttrail.substring(exttrail.length-2);
								rmttrailname= rmttrail.substring(rmttrail.length-2);
								t1=jsPlumb.addEndpoint("exttrail_"+objInfo.objectid+"_"+exttrailname,defaults);
								t2=jsPlumb.addEndpoint("rmttrail_"+objInfo.objectid+"_"+rmttrailname,defaults);
							}else if(exttrail){
								exttrailname= exttrail.substring(exttrail.length-2);
								t1=jsPlumb.addEndpoint("exttrail_"+objInfo.objectid+"_"+exttrailname,defaults);
							}else if(rmttrail){
								rmttrailname= rmttrail.substring(rmttrail.length-2);
								t2=jsPlumb.addEndpoint("rmttrail_"+objInfo.objectid+"_"+rmttrailname,defaults);
							}
							if(t1){
								jsPlumb.connect({source:trail_root, target:t1});
								jsPlumb.draggable("exttrail_"+objInfo.objectid+"_"+exttrailname);
							}
							if(t2){
								jsPlumb.connect({source:trail_root, target:t2});
								jsPlumb.draggable("rmttrail_"+objInfo.objectid+"_"+rmttrailname);
							}
							if(i!=0)
								$("#obj_"+objList[j].objectid).hide();
						}
						if(i!=0){//不是第一个instance，先隐藏object
							var conn=jsPlumb.select({source:"instance_"+instance[i].agent_id});
							conn.get(0).endpoints[0].setParameter("img","add");
							conn.get(0).endpoints[0].setImage("images/add.png");
							conn.setVisible(false);
							for(var j=0;j<objList.length;j++){
								var con=jsPlumb.select({source:"obj_"+objList[j].objectid});
								if(con.length!=0){
									con.setVisible(false);
									con.get(0).endpoints[0].setVisible(false);
									var exttrail=$.trim(objList[j].exttrail),rmttrail=$.trim(objList[j].rmttrail);
									if(exttrail){
										exttrailname= exttrail.substring(exttrail.length-2);
										$("#exttrail_"+objList[j].objectid+"_"+exttrailname).hide();
									}
									if(rmttrail){
										rmttrailname= rmttrail.substring(rmttrail.length-2);
										$("#rmttrail_"+objList[j].objectid+"_"+rmttrailname).hide();
									}
								}
							}
						}
					}
				}
				//添加db拓扑关系
				for(var j=0;j<dbInfo.length;j++){
					jsPlumb.draggable("database_"+dbInfo[j].id);
					var t1=jsPlumb.addEndpoint("database_"+dbInfo[j].id,defaults);//将exampleEndpoint2类型的点绑定到id为state3的元素上  
					var c1=jsPlumb.connect({source:s1, target:t1});
				}
				s1.bind("click", function(endpoint) {
					if(endpoint.getParameter("img")&&endpoint.getParameter("img")=="add"){
						endpoint.setParameter("img","sub");
						endpoint.setImage("images/sub.png");
						jsPlumb.select({source:"top_server"}).setVisible(true);
						for(var i=0;i<instance.length;i++){
							jsPlumb.show("instance_"+instance[i].agent_id,true);
							$("#instance_"+instance[i].agent_id).show();
							var objList=instance[i].objectList;
							if(objList.length>0){
								jsPlumb.select({source:"instance_"+instance[i].agent_id}).setVisible(false);
								jsPlumb.select({source:"instance_"+instance[i].agent_id}).get(0).endpoints[0].setParameter("img","add");
								jsPlumb.select({source:"instance_"+instance[i].agent_id}).get(0).endpoints[0].setImage("images/add.png");
							}
						}
						for(var j=0;j<dbInfo.length;j++){
							$("#database_"+dbInfo[j].id).show();
						}
					}else{
						endpoint.setParameter("img","add");
						endpoint.setImage("images/add.png");
						jsPlumb.hide("top_server");
						for(var i=0;i<instance.length;i++){
							var objList=instance[i].objectList;
							jsPlumb.hide("instance_"+instance[i].agent_id,true);
							for(var j=0;j<objList.length;j++){
								jsPlumb.hide("obj_"+objList[j].objectid,true);
							}
						}
						$(".nodeWord").parent().hide();
					}
					if (window.navigator.userAgent.indexOf('MSIE') > -1) {
			    		jsPlumb.repaintEverything();
			    	}
				});
				$(window).resize(function(){
					jsPlumb.repaintEverything();
				});
			 });
//		 }
//	});
});
/*
 * 元素摆放位置--对称分布
 */
function elementLocation(nodeNumber,instance,dbinfo){
	if(nodeNumber%2==1){//总节点数是奇数
		if(instance.length<=parseInt(nodeNumber/2)){//instance数量小于等于总量的一半
			var num=dbinfo.length-parseInt(nodeNumber/2);
			for(var i=0;i<instance.length;i++){
				var html="<div id='instance_"+instance[i].agent_id+"' class=\"instanceNode\" style='left:20%;top:"+parseInt(50-15*(num+i))+"%'><div class='nodeWord'>"+instance[i].ggport+"</div></div>";
				$("body").append(html);
				var instanceLoc=50-15*(num+i);
				var objList=instance[i].objectList;
				calcTopLoc(instanceLoc,objList);
			}
			for(var j=0;j<dbinfo.length;j++){
				var html="<div id='database_"+dbinfo[j].id+"' class=\"dbNode\" style='left:20%;top:"+parseInt(50-15*(num-1)+15*j)+"%'><div class='nodeWord'>"+dbinfo[j].sid+"</div></div>";
				$("body").append(html);
			}
		}else if(instance.length>parseInt(nodeNumber/2)){//instance数量大于总量的一半
			var num=instance.length-parseInt(nodeNumber/2);
			for(var i=0;i<instance.length;i++){
				var instanceLoc=50+15*(num-1)-15*i;
				var html="<div id='instance_"+instance[i].agent_id+"' class=\"instanceNode\" style='left:20%;top:"+parseInt(instanceLoc)+"%'><div class='nodeWord'>"+instance[i].ggport+"</div></div>";
				$("body").append(html);
				var objList=instance[i].objectList;
				calcTopLoc(instanceLoc,objList);
			}
			for(var j=0;j<dbinfo.length;j++){
				var html="<div id='database_"+dbinfo[j].id+"' class=\"dbNode\" style='left:20%;top:"+parseInt(50+15*num+15*j)+"%'><div class='nodeWord'>"+dbinfo[j].sid+"</div></div>";
				$("body").append(html);
			}
		}
	}else if(nodeNumber%2==0){//总节点数是偶数
		if(instance.length<=parseInt(nodeNumber/2)){//instance数量小于等于总量的一半
			var num=dbinfo.length-parseInt(nodeNumber/2);
			for(var i=0;i<instance.length;i++){
				var html="<div id='instance_"+instance[i].agent_id+"' class=\"instanceNode\" style='left:20%;top:"+parseInt(50-10-20*(num+i))+"%'><div class='nodeWord'>"+instance[i].ggport+"</div></div>";
				$("body").append(html);
				var instanceLoc=50-10-20*(num+i);
				var objList=instance[i].objectList;
				calcTopLoc(instanceLoc,objList);
			}
			for(var j=0;j<dbinfo.length;j++){
				var html="<div id='database_"+dbinfo[j].id+"' class=\"dbNode\" style='left:20%;top:"+parseInt(50-10-20*(num-1)+20*j)+"%'><div class='nodeWord'>"+dbinfo[j].sid+"</div></div>";
				$("body").append(html);
			}
		}else if(instance.length>parseInt(nodeNumber/2)){//instance数量大于总量的一半
			var num=instance.length-parseInt(nodeNumber/2);
			for(var i=0;i<instance.length;i++){
				var html="<div id='instance_"+instance[i].agent_id+"' class=\"instanceNode\" style='left:20%;top:"+parseInt(50-10+20*(num-1)-20*i)+"%'><div class='nodeWord'>"+instance[i].ggport+"</div></div>";
				$("body").append(html);
				var instanceLoc=50-10+20*(num-1)-20*i;
				var objList=instance[i].objectList;
				calcTopLoc(instanceLoc,objList);
			}
			for(var j=0;j<dbinfo.length;j++){
				var html="<div id='database_"+dbinfo[j].id+"' class=\"dbNode\" style='left:20%;top:"+parseInt(50-10+20*num+12*j)+"%'><div class='nodeWord'>"+dbinfo[j].sid+"</div></div>";
				$("body").append(html);
			}
		}
	}
}
/*
 * 添加object元素
 * objInfo--object对象，topLoc--元素距离顶部的百分比数值
 */
function manageObj(objInfo,topLoc){
	var imgInfo;
	if(objInfo.objecttype=='EXTRACT'){
		imgInfo="extNode";
	}else if(objInfo.objecttype=='PUMP'){
		imgInfo="pmpNode";
	}else if(objInfo.objecttype=='REPLICAT'){
		imgInfo="repNode";
	}
	var html="<div id='obj_"+objInfo.objectid+"' class='"+imgInfo+"' style='left:40%;top:"+parseInt(topLoc)+"%'><div class='nodeWord'>"+objInfo.objectname+"</div></div>";
	$("body").append(html);
	var exttrail=$.trim(objInfo.exttrail),rmttrail=$.trim(objInfo.rmttrail),htmltrail="",exttrailname="",rmttrailname="";
	if(exttrail&&rmttrail){
		exttrailname= exttrail.substring(exttrail.length-2);
		rmttrailname= rmttrail.substring(rmttrail.length-2);
		htmltrail+="<div id='exttrail_"+objInfo.objectid+"_"+exttrailname+"' class='trailNode' style='left:50%;top:"+parseInt(topLoc-4+1)+".3%'><div class='nodeWord'>"+exttrail+"</div></div>";
		htmltrail+="<div id='rmttrail_"+objInfo.objectid+"_"+rmttrailname+"' class='trailNode' style='left:50%;top:"+parseInt(topLoc+4+1)+".3%'><div class='nodeWord'>"+rmttrail+"</div></div>";
	}else if(exttrail){
		exttrailname= exttrail.substring(exttrail.length-2);
		htmltrail="<div id='exttrail_"+objInfo.objectid+"_"+exttrailname+"' class='trailNode' style='left:50%;top:"+parseInt(topLoc+1)+".3%'><div class='nodeWord'>"+exttrail+"</div></div>";
	}else if(rmttrail){
		rmttrailname= rmttrail.substring(rmttrail.length-2);
		htmltrail="<div id='rmttrail_"+objInfo.objectid+"_"+rmttrailname+"' class='trailNode' style='left:50%;top:"+parseInt(topLoc+1)+".3%'><div class='nodeWord'>"+rmttrail+"</div></div>";
	}
	if(htmltrail)
		$("body").append(htmltrail);
}
//计算top值
function calcTopLoc(instanceLoc,objList){
	if(objList.length%2==1){
		var flag=0;//标志从第flag对象开始已超出页面上边界，flag=0表示没有对象超出上边界
		for(var j=0;j<objList.length;j++){
			var objInfo=objList[j],topLoc;
			if(j<parseInt(objList.length/2)){
				topLoc=instanceLoc-15*(j+1);
				if(topLoc<0){//top属性是否是负值，若已是负值，则将该对象下移
					if(!flag)//判断flag是否已经有值
						flag=j;
					topLoc=instanceLoc+15*(j-flag);//将该对象下移
				}
			}else if(j>parseInt(objList.length/2)){
				if(flag){
					topLoc=instanceLoc+15*(j-flag);
				}else{
					topLoc=instanceLoc+15*(j-parseInt(objList.length/2));
				}
			}else{
				if(flag){
					topLoc=instanceLoc+15*(j-flag);
				}else{
					topLoc=instanceLoc;
				}
			}
			manageObj(objInfo,topLoc);
		}
	}else if(objList.length%2==0){
		var flag=0;
		for(var j=0;j<objList.length;j++){
			var objInfo=objList[j],topLoc;
			if(j+1<=parseInt(objList.length/2)){
				topLoc=instanceLoc-10-20*j;
				if(topLoc<0){
					if(!flag)
						flag=j;
					topLoc=instanceLoc+10+20*(j-flag);
				}
			}else if(j+1>parseInt(objList.length/2)){
				if(flag){
					topLoc=instanceLoc+10+20*(j-flag);
				}else{
					topLoc=instanceLoc+10+20*(j-parseInt(objList.length/2));
				}
			}
			manageObj(objInfo,topLoc);
		}
	}
}