/*global define */
define(
	['jquery','cartodb', 'mustache', 'leaflet','mapbox', 'cookiebar'],
	function ($, cartodb, mustache, leaflet, mapbox, cookiebar) {

		var DCAC = {
			map : null,
			carto : null,
			mode: 0
		}

		$(document).ready(function(){
			$.cookieBar({
				message: 'Estamos usando cookies para mejorar el servicio',
				acceptButton: true,
				acceptText: 'Adelante'
			});
		});


     	if($.cookieBar('cookies')){

            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

            ga('create', 'UA-55199339-1', 'auto');
            ga('send', 'pageview');
        }

		$('#typepublic').click(function(e){
			if(!$('#typepublic').hasClass('btn-primary')){
				$('#typepublic').siblings().removeClass('btn-primary').addClass('btn-default');
				$('#typepublic').removeClass('btn-default').addClass('btn-primary');
			}
		})
		$('#typeprivate').click(function(e){
			if(!$('#typeprivate').hasClass('btn-primary')){
				$('#typeprivate').siblings().removeClass('btn-primary').addClass('btn-default');
				$('#typeprivate').removeClass('btn-default').addClass('btn-primary');
			}
		})
		$('#typeall').click(function(e){
			if(!$('#typeall').hasClass('btn-primary')){
				$('#typeall').siblings().removeClass('btn-primary').addClass('btn-default');
				$('#typeall').removeClass('btn-default').addClass('btn-primary');
			}
		})
		$('#btnlist').click(function(e){
			if(!$('#btnlist').hasClass('btn-primary')){
				$('#btnlist').siblings().removeClass('btn-primary').addClass('btn-default');
				$('#btnlist').removeClass('btn-default').addClass('btn-primary');
				$('#list').removeClass('hidden');
				$('#map').addClass('hidden');
			}
		})
		$('#btnmap').click(function(e){
			if(!$('#btnmap').hasClass('btn-primary')){
				$('#btnmap').siblings().removeClass('btn-primary').addClass('btn-default');
				$('#btnmap').removeClass('btn-default').addClass('btn-primary');
				$('#map').removeClass('hidden');
				$('#list').addClass('hidden');
			}
		})
		$('#btnbackabout').click(function(e){
			window.history.back();
		})
		$('#btnback').click(function(e){
			showSearchPanel();
			DCAC.mode = 0;
		})
		$('#typeinfantil').click(function(e){
			if($('#typeinfantil').hasClass('btn-primary')){
				$('#typeinfantil').removeClass('btn-primary').addClass('btn-default');
			}else{
				$('#typeinfantil').removeClass('btn-default').addClass('btn-primary');
			}
		})
		$('#typeprimaria').click(function(e){
			if($('#typeprimaria').hasClass('btn-primary')){
				$('#typeprimaria').removeClass('btn-primary').addClass('btn-default');
			}else{
				$('#typeprimaria').removeClass('btn-default').addClass('btn-primary');
			}
		})
		$('#typeespecial').click(function(e){
			if($('#typeespecial').hasClass('btn-primary')){
				$('#typeespecial').removeClass('btn-primary').addClass('btn-default');
			}else{
				$('#typeespecial').removeClass('btn-default').addClass('btn-primary');
			}
		})
		$('#typeeso').click(function(e){
			if($('#typeeso').hasClass('btn-primary')){
				$('#typeeso').removeClass('btn-primary').addClass('btn-default');
			}else{
				$('#typeeso').removeClass('btn-default').addClass('btn-primary');
			}
		})
		$('#typebachiller').click(function(e){
			if($('#typebachiller').hasClass('btn-primary')){
				$('#typebachiller').removeClass('btn-primary').addClass('btn-default');
			}else{
				$('#typebachiller').removeClass('btn-default').addClass('btn-primary');
			}
		})
		$('#typefp').click(function(e){
			if($('#typefp').hasClass('btn-primary')){
				$('#typefp').removeClass('btn-primary').addClass('btn-default');
			}else{
				$('#typefp').removeClass('btn-default').addClass('btn-primary');
			}
		})
		$('#typeadultos').click(function(e){
			if($('#typeadultos').hasClass('btn-primary')){
				$('#typeadultos').removeClass('btn-primary').addClass('btn-default');
			}else{
				$('#typeadultos').removeClass('btn-default').addClass('btn-primary');
			}
		})

		$('#btn-search').click(function(e){
			var cp = $('#cpvalue').val();
			if(cp.length == 4){
				cp = '0'+cp;
			}
			var filter = {
				cp: cp,
				regimen: null,
				tipo: null,
				maxtime: null
			}
			if(cp !== ''){
				loadingInfo(true);
				filter.regimen = getRegimen();
				//filter.tipo = getTypeSchool(); //FIXME
				createMap();
				createCartoDB();
				var url = getListUrl(filter);
				getDataList(url);
				DCAC.carto.getLeafletLayer(filter,DCAC.map);
				DCAC.carto.showCpLocation(cp,DCAC.map);
				addLegend();
			}else{
				showAlertMessage('Introduce el código postal donde resides');
			}
		})

		var opts3 = {
			lines: 6, // The number of lines to draw
			length: 6, // The length of each line
			width: 4, // The line thickness
			radius: 4, // The radius of the inner circle
			corners: 0, // Corner roundness (0..1)
			rotate: 0, // The rotation offset
			direction: 1, // 1: clockwise, -1: counterclockwise
			color: '#fff', // #rgb or #rrggbb or array of colors
			speed: 0.8, // Rounds per second
			trail: 38, // Afterglow percentage
			shadow: false, // Whether to render a shadow
			hwaccel: false, // Whether to use hardware acceleration
			className: 'spinner', // The CSS class to assign to the spinner
			zIndex: 2e9, // The z-index (defaults to 2000000000)
			top: '50%', // Top position relative to parent
			left: '50%' // Left position relative to parent
		};
		var target3 = document.getElementById('spin');
		var spinner = new Spinner(opts3).spin(target3);
		$('.spinner').hide();

		var hackShowMap = function(){
			setTimeout(function(){

				$('#map').width($('#results').width()-5);
				$('#map').width($('#results').width()-6);
				$('#map').height($('#results').height()-5);
				$('#map').height($('#results').height()-6);
				$('#content').width($('#content').width()+1);
				$('#content').width($('#content').width()-1);
				$('#content').height($('#content').height()+1);
				$('#content').height($('#content').height()-1);
				$(window).width(100);
			},2000)
		}

		var getTypeSchool = function(){
			var type = '';
			if($('#typeadultos').hasClass('btn-primary')){
					type += 'A'; 							
			}
			if($('#typefp').hasClass('btn-primary')){
					type += 'A';			
			}
			if($('#typebachiller').hasClass('btn-primary')){
					type += 'A';			
			}
			if($('#typeeso').hasClass('btn-primary')){
					type += 'A'; 				
			}
			if($('#typeespecial').hasClass('btn-primary')){
					type += 'B'; 				
			}
			if($('#typeprimaria').hasClass('btn-primary')){
					type += 'C';				
			}
			if($('#typeinfantil').hasClass('btn-primary')){
					type += 'A';				
			}
			if(type === ''){
				type = null;
			}
			return type;
		}

		var getRegimen = function(){
			if($('#typepublic').hasClass('btn-primary')){
				return '0';
			} else if($('#typeprivate').hasClass('btn-primary')){
				return '1';
			} else {
				return null;
			}
		}

		var showResultsPanel = function(){
			DCAC.mode = 1;
			$('#formbase').addClass('hidden');
			$('#btnback').removeClass('hidden');
			$('#results').removeClass('hidden');
			heightUpdate();

			$('#btnmap').on('click',function(){
				DCAC.map.invalidateSize();
			})
		}

		var addLegend = function(){
			var html = '<div clas="legElem"><div class="icon icon30"></div><div class="legElem">hasta 30 min</div></div>';
			html += '<div clas="legElem"><div class="icon icon60"></div><div class="legElem">hasta 60 min</div></div>';
			html += '<div clas="legElem"><div class="icon icon90"></div><div class="legElem">hasta 90 min</div></div>';
			html += '<div clas="legElem"><div class="icon icon120"></div><div class="legElem">hasta 120 min</div></div>';
			html += '<div clas="legElem"><div class="icon icon150"></div><div class="legElem">hasta 150 min</div></div>';
			html += '<div clas="legElem"><div class="icon icon180"></div><div class="legElem">m&aacute;s de 150 min</div></div>';
			$('#legend').html(html);
		}

		var showSearchPanel = function(){
			DCAC.mode = 0;
			$('#formbase').removeClass('hidden');
			$('#results').addClass('hidden');
			$('#btnback').addClass('hidden');
			$('#btnback').addClass('hidden');
			heightUpdate();
		}

		var getListUrl = function(filter){

			var url = DCAC.carto.getAPIURL(filter);
			return url;
		}

		var getDataList = function (url){
			$.ajax({
				url: url,
				dataType: 'json',
				success: function(data){
					createDataList(data);
					loadingInfo(false);
					showResultsPanel();
				}
			})
		}

		var loadingInfo = function(show){
			if(show){
				$('.spinner').show();
				$('#btn-search-spintext').removeClass('hidden');
				$('#btn-search .glyphicon').hide();
				$('#btn-search-text').hide();


			}else{
				$('.spinner').hide();
				$('#btn-search-spintext').addClass('hidden');
				$('#btn-search .glyphicon').show();
				$('#btn-search-text').show();
			}
		}

		var createCartoDB = function(){
			if(DCAC.carto === null){
				DCAC.carto = new cartodb({});
			}
		}

		var createMap = function(){
			if(DCAC.map === null){
				//DCAC.map = L.map('map').setView([39.25, 0], 7);
				DCAC.map = L.mapbox.map('map');
				L.mapbox.accessToken = 'pk.eyJ1IjoieHVyeG9zYW56IiwiYSI6Ii1ObkhtWkUifQ.BK7TVbrk0v0-1NVn_ndWZw';

				// add an OpenStreetMap tile layer
				//L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				//attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				//}).addTo(DCAC.map);
				L.mapbox.tileLayer('xurxosanz.jj47g6i7').addTo(DCAC.map);
				DCAC.map.setView([39.25, 0], 7);
			}
		}

		var showAlertMessage = function(text){
			var info = $('#infoMessage').html();
			var alert = '<span class="glyphicon glyphicon-warning-sign"></span>'+text;
			$('#infoMessage').removeClass('alert-info').addClass('alert-danger').html(alert);
			setTimeout(function(){
				$('#infoMessage').removeClass('alert-danger').addClass('alert-info').html(info);
			},4000);
		}

		var createDataList = function(data){

			var opts = {
				rows: data.rows
			}
			for(var i = 0; i < opts.rows.length; i++){
				var reg = opts.rows[i].regimen;
				if(reg === true){
					opts.rows[i].reg2 = 'Priv';
				}else{
					opts.rows[i].reg2 = 'Pub';
				}

			}
			var tpl = '<table class="table table-striped"><thead><tr>';
			//tpl += '<th>Tiempo</th><th>R&eacute;gimen</th><th>Id</th><th>Centro</th><th>Municipio</th><th>Direcci&oacute;n</th><th>Mapa</th>';
			tpl += '<th>Tiempo</th><th>R&eacute;gimen</th><th>Id</th><th>Centro</th><th>Municipio</th><th>Direcci&oacute;n</th>';
			tpl += '</tr></thead><tbody>';
			tpl += '{{#rows}}';
			tpl += '<tr>';
			tpl += '<td>{{minutes}} min</td>';
			tpl += '<td><span class="label label-info {{#regimen}}label-danger{{/regimen}}">{{reg2}}</span></td>';
			tpl += '<td>{{codigo}}</td>';
			tpl += '<td><a href="http://www.cece.gva.es/ocd/areacd/es/centro.asp?codi={{codigo}}" target="_blank">{{despecific}}</a></td>';
			tpl += '<td>{{localidad}}</td>';
			tpl += '<td>{{tipocalle}} {{direccion}} - {{numero}}</td>';
			//tpl += '<td><button id="btngomap" class="btn btn-primary btn-xs" data-loc="{{location}}"><span class="glyphicon glyphicon-map-marker"></span></button></td>';
			tpl += '</tr>';
			tpl += '{{/rows}}';
			tpl += '</tbody></table>';
			var html = mustache.to_html(tpl,opts);

			$('#list').html(html);
		}

		var heightUpdate = function(){
			if(DCAC.mode === 0){
				$('header').height(250);
				$('footer').height(30);
				var h = $(window).height()-250-30-40;
				if(h < 290){
					h = 290;
				}
				$('#content').height(h);
				$('#about').height(h);
				$('#headerLogo').show();
				$('#headerMessage').show();
				$('#headerTitleLogo').addClass('hidden');

			}else{
				$('header').height(50);
				$('footer').height(30);
				var h = $(window).height()-50-30-40;
				if(h < 290){
					h = 290;
				}
				$('#content').height(h);
				$('#about').height(h);
				$('#results').height(h-30);
				var ww = $('#content').width()
				$('#map').height(h-70).width(ww);
				$('#headerLogo').hide();
				$('#headerMessage').hide();
				$('#headerTitleLogo').removeClass('hidden');
			}
		}
		heightUpdate();
		$('#cpvalue').focus();

		window.onresize = function() {
			heightUpdate();
		};



		//INIT CONFIG




    	return 'de Casa al Cole';
});
