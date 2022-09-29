/*
 * @Author: xulijie xulijie@piesat.cn
 * @Date: 2022-09-29 09:49:48
 * @LastEditors: xulijie xulijie@piesat.cn
 * @LastEditTime: 2022-09-29 10:12:51
 * @FilePath: \cesium-wind\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
var windy;
var started = false;
var viewer;

$(function(){

    function initMap(target){

        var viewer = new Cesium.Viewer(target, {
            homeButton:true,
            animation : false,
            timeline : false,
            infoBox : false,
            selectionIndicator : false,
            baseLayerPicker :true,
            terrainProviderViewModels : [],
            geocoder : false,
            vrButton : false,
            navigationHelpButton : false,
            mapProjection : new Cesium.WebMercatorProjection(),
            sceneMode : Cesium.SceneMode.SCENE3D,
        });

        return viewer;
    }

    viewer = initMap("cesiumContainer");
    window.cesiumGlobe = globe(viewer);
    viewer._cesiumWidget._creditContainer.style.display="none";
    debugger
    $('#wind')[0].width = parseInt(viewer.canvas.width);
    $('#wind')[0].height = parseInt(viewer.canvas.height);

    function Draw() {
        $.ajax({
            type: "get",
            url: "./data/test.json",
            dataType: "json",
            success: function (response) {
                console.log(response)
            	 windy = new Windy({ canvas: document.getElementById("wind"), data: response });
                 redraw();
            },
            error: function (errorMsg) {
                alert("请求数据失败1!");
            }
        });
    }
    Draw();


    function redraw(){
        var width = viewer.canvas.width;
        var height = viewer.canvas.height;
        $('#wind')[0].width = width;
        $('#wind')[0].height = height;
        windy.stop();
        setTimeout(function(){
            started = windy.start(
                [[0,0],[width, height]],
                width,
                height
            );
            $('#wind').show();
        },200);
    }
    
    
    viewer.camera.moveStart.addEventListener(function(){
    	console.log("move start...");
    	$('#wind').hide();
    	if(!!windy && started){
    		windy.stop();
    	}
    });
    viewer.camera.moveEnd.addEventListener(function(){
    	console.log("move end...");
    	$('#wind').hide();
    	if(!!windy && started){
    		redraw();
    	}
    });
});