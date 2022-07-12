//都府県の選択肢
var arr = [
	{cd:"Shinkoiwa", label:"新小岩"},
	{cd:"Koiwa", label:"小岩"},
	{cd:"Motoyawata", label:"本八幡"}
];

// 飲食店の選択
// 【cdについて】:カンマ区切りで"ホットペッパーのクーポンページ, ぐるなびのクーポンページ"と表示している
// 【iframeの構文について】:<iframe src="url"></ iframe>で好きなURLに飛べるが、
// 										<iframe src="url#id"></ iframe>とすることで、好きな位置へ自動スクロールしてページを開いてくれる
// 【iframeのidについて】:ホットペッパーのクーポン項目のidは「#gourmetCoupon」
//										 ぐるなびのクーポン項目のidは「#coupon-list」
//										なので、iframeのsrc属性にホットペッパーとぐるなびのURLを指定した後、それぞれのidを付け加える
//										※ただし、中には	idが組み込まれていないページがある
//										(その場合は、idを指定してもページは開くがスクロールはしてくれない。
//										この場合にも、いずれidがつくことを願ってid指定を付けておく)
var arrShinkoiwa = [
	{cd:"https://www.hotpepper.jp/strJ001010262/map/#gourmetCoupon, " +
			"", label:"温野菜"},
	{cd:"https://www.hotpepper.jp/strJ001077434/map/#gourmetCoupon, " +
			"", label:"牛角"},
	{cd:"https://www.hotpepper.jp/strJ001264586/map/#gourmetCoupon, " +
			"https://r.gnavi.co.jp/35kf9z0y0000/coupon/#coupon-list", label:"とりいちず"},
	{cd:"https://www.hotpepper.jp/strJ000048564/map/#gourmetCoupon, " +
					"https://r.gnavi.co.jp/e686594/coupon/#coupon-list", label:"はなの舞"}
];
var arrKoiwa = [
	{cd:"https://www.hotpepper.jp/strJ001110857/map/#gourmetCoupon, " +
			"https://r.gnavi.co.jp/5e988z5f0000/coupon/#coupon-list", label:"CONA"}
];
var arrMotoyawata = [
	{cd:"https://www.hotpepper.jp/strJ000804558/map/#gourmetCoupon, " +
			"https://r.gnavi.co.jp/e363414/coupon/#coupon-list", label:"忍屋"},
	{cd:"https://www.hotpepper.jp/strJ000195534/map/#gourmetCoupon, " +
			"https://r.gnavi.co.jp/7m2gwy380000/coupon/#coupon-list", label:"牛繁"},
	{cd:"https://www.hotpepper.jp/strJ000018072/map/#gourmetCoupon, " +
			"", label:"牛角"} /*,
	{cd:"http://city-bear.com/coupon/#container, " +
			"", label:"カラオケシティベア"} */
];

// 起動時に飲食店のコンボボックスの生成
window.onload=function(){
	for(var i=0;i<arr.length;i++){
		let op = document.createElement("option");
		op.value = arr[i].cd;
		op.text = arr[i].label;
		document.getElementById("selPref").appendChild(op);
	}
	// 最寄り駅のコンボボックスの実行
	$('#selPref').change();
}

//最寄り駅が選択された時に呼び出される処理
function selPref(obj){
	var targetArr;
	if(obj.value == "Shinkoiwa"){
		targetArr = arrShinkoiwa;
	}else if(obj.value == "Koiwa"){
		targetArr = arrKoiwa;
	}else if(obj.value == "Motoyawata"){
		targetArr = arrMotoyawata;
	}else{
		targetArr = new Array();
	}
	var selObj = document.getElementById('selRestaurant');
	while(selObj.lastChild){
		selObj.removeChild(selObj.lastChild);
	}
	for(var i=0;i<targetArr.length;i++){
		let op = document.createElement("option");
		op.value = targetArr[i].cd;
		op.text = targetArr[i].label;
		selObj.appendChild(op);
	}

	// 飲食店のコンボボックスの実行
	$('#selRestaurant').change();
}

// プルダウンで選択した値に応じたiframeを開く方法	参考：https://oshiete.goo.ne.jp/qa/1099623.html
// 飲食店が選択されたときに動くイベント
function ifrm_change(){
	// id指定した要素のvalueを取得する方法	参考：https://www.sejuku.net/blog/45297
	var couponURL = $('#selRestaurant').val();

	// valueの値をカンマ区切りで配列に入れる方法(split)	参考：https://www.flatflag.nir87.com/split-2178
	var aryCouponURL = couponURL.split(', ');

	// 配列の中を回す	aryCouponURL[0]はホットペッパー、aryCouponURL[1]はぐるなび
	$.each(aryCouponURL, function(index, value) {
		// URLが格納されていない場合、クーポンページが存在しないので、その旨を表示する
		if (value == "") {
			// window.openの構文の参考：https://developer.mozilla.org/ja/docs/Web/API/Window/open
			window.open("./404.html","ifrm" + (index + 1));
		} else {
			window.open(value,"ifrm" + (index + 1));
			//fncIframeResize("#ifrm2");	// うまくいかないので一時的に消す
		}
	})
}


// iframeのガワと中身の部分の縮小をする	参考：https://qiita.com/tomgoodsun/items/4b7a35876d7afc8f94c8
function fncIframeResize(iframeId) {
	// iframeのwidthを縮小する
	let iframe = $(iframeId);
	console.log(`Ratio: ` + iframe);
	iframe.css({'cssText': 'width: 125% !important;'});
	let wrapper = iframe.parent();
	let width = wrapper.width() * 0.8;	// たけるページ使用にするため、「 * 0.8」を追加
	let ratio = width / iframe.width();
	console.log(`Ratio: ${ratio}`);

	// IFRAME自体は読み込みページの大きさにCSSで適用している。
	// それを#wrapperのサイズにスケールインする。
	// https://stackoverflow.com/questions/166160/how-can-i-scale-the-content-of-an-iframe
	iframe
		.css('-ms-transform',		 `scale(${ratio})`)
		.css('-moz-transform',		`scale(${ratio})`)
		.css('-webkit-transform', `scale(${ratio})`)
		.css('transform',				 `scale(${ratio})`)
		.css('-ms-transform-origin',		 '0 0')
		.css('-moz-transform-origin',		'0 0')
		.css('-o-transform-origin',			'0 0')
		.css('-webkit-transform-origin', '0 0')
		.css('transform-origin',				 '0 0');

	// #iframeのひとつ上のラッパー#wrapperの高さを同じ倍率で変更する。
	// これをしないとうまくもともとのIFRAMEの高さのままになる。
	wrapper.height(wrapper.height() * ratio);
}
