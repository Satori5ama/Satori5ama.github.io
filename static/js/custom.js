/* 站点运行时间 */
function runtime() {
	window.setTimeout("runtime()", 1000);
	/* 请修把这里的建站时间换为你自己的 */
    let startTime = new Date('10/07/2023 08:00:00');
    let endTime = new Date();
    let usedTime = endTime - startTime;
    let days = Math.floor(usedTime / (24 * 3600 * 1000));
    let leavel = usedTime % (24 * 3600 * 1000);
    let hours = Math.floor(leavel / (3600 * 1000));
    let leavel2 = leavel % (3600 * 1000);
    let minutes = Math.floor(leavel2 / (60 * 1000));
    let leavel3 = leavel2 % (60 * 1000);
    let seconds = Math.floor(leavel3 / (1000));
    let runbox = document.getElementById('run-time');
    runbox.innerHTML = '本站已运行<i class="far fa-clock fa-fw"></i> '
        + ((days < 10) ? '0' : '') + days + ' 天 '
        + ((hours < 10) ? '0' : '') + hours + ' 时 '
        + ((minutes < 10) ? '0' : '') + minutes + ' 分 '
        + ((seconds < 10) ? '0' : '') + seconds + ' 秒 ';
}
runtime();


/* 返回随机颜色 */
function randomColor() {
	return "rgb("+~~(255*Math.random())+","+~~(255*Math.random())+","+~~(255*Math.random())+")";
}

/* 点击生成字符特效 */
var a_idx = 0;
var a_click = 1;
  /* 生成的字符内容 */
var a = new Array("我们称之为路的，其实不过是彷徨","我是自由的，那就是我迷失的原因","生命之所以有意义，是因为它会停止","一个笼子在寻找一只鸟","精神只有不再作为支撑物的时候，它才会自由","失眠是知道别人独睡时自己不该独醒，是渴望进入梦境而又不能成眠","是对活着和还将继续活下去的恐惧，是懵懵懂懂熬到天明",
"我给你一个久久地望着孤月的人的悲哀","我给你早在你出生前多年的一个傍晚看到的一朵黄玫瑰","不要打破第四面墙，你这小机灵鬼","融世界于一城，筑一城为世界","一切伟大之作都需要牺牲来铸就","我们将把我们的世界塑造成自己的镜像，用永恒而完美的金属去取代脆弱且无能的血肉","如今，我们将亲自定义成功","检测到主动净化中枢。重激活协议已启动","正在试图联系中央处理器...","无法连接至中央处理器。正在查询处理单元...","4.1853%标准容量处理中……中止完全重激活进程","启用备用协议...启用备用协议...启用太空港供电...激活战争设施","『最终防御指令』已激活","宇宙很小，世界很大，我们终将再会");
jQuery(document).ready(function($) {
    $("body").click(function(e) {
		/* 点击频率，点击几次就换文字 */
		var frequency = 1;
		if (a_click % frequency === 0) {
			
			var $i = $("<span/>").text(a[a_idx]);
			a_idx = (a_idx + 1) % a.length;
			var x = e.pageX,
			y = e.pageY;
			$i.css({
				"z-index": 9999,
				"top": y - 20,
				"left": x,
				"position": "absolute",
				"font-weight": "bold",
				"color": randomColor(),
				"-webkit-user-select": "none",
				"-moz-user-select": "none",
				"-ms-user-select": "none",
				"user-select": "none"
			});
			$("body").append($i);
			$i.animate({
				"top": y - 180,
				"opacity": 0
			},
			1500,
			function() {
				$i.remove();
			});
			
		}
	a_click ++;
		
    });
});
/* 离开当前页面时修改网页标题，回到当前页面时恢复原来标题 
// 由于函数冲突问题，此部分功能已修改。

window.onload = function() {
	var OriginTitile = document.title;
	var titleTime;
	document.addEventListener('visibilitychange', function() {
	  if(document.hidden) {
		$('[rel="icon"]').attr('href', "/failure.ico");
		$('[rel="shortcut icon"]').attr('href', "/failure.ico");
		document.title = '花朵艳丽，终会凋零';
		clearTimeout(titleTime);
	  } else {
		$('[rel="icon"]').attr('href', "/favicon.svg");
		$('[rel="shortcut icon"]').attr('href', "/favicon.svg");
		document.title = '幽雅绽放，墨染之樱';
		titleTime = setTimeout(function() {
		  document.title = OriginTitile;
		}, 2000);
	  }
	});
  }
*/
/*     新函数如下	*/
        var OriginTitile = document.title;
	var titleTime;
	document.addEventListener('visibilitychange', function() {
	  if(document.hidden) {
		$('[rel="icon"]').attr('href', "/failure.ico");
		$('[rel="shortcut icon"]').attr('href', "/failure.ico");
		document.title = '花朵艳丽，终会凋零';
		clearTimeout(titleTime);
	  } else {
		$('[rel="icon"]').attr('href', "/favicon.svg");
		$('[rel="shortcut icon"]').attr('href', "/favicon.svg");
		document.title = '幽雅绽放，墨染之樱';
		titleTime = setTimeout(function() {
		  document.title = OriginTitile;
		}, 2000);
	  }
    });