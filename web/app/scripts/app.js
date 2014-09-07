/*global define */
define(
	['jquery','cartodb', 'mustache', 'leaflet'], 
	function ($, cartodb, mustache, leaflet) {

		var xmap = false;

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
				createMap();
				$('#btnmap').siblings().removeClass('btn-primary').addClass('btn-default');
				$('#btnmap').removeClass('btn-default').addClass('btn-primary');
				$('#map').removeClass('hidden');
				$('#list').addClass('hidden');
			}
		})
		$('#btnback').click(function(e){
			showSearchPanel();
		})

		$('#btn-search').click(function(e){
			var cp = $('#cpvalue').val();
			var filter = {
				cp: cp,
				regimen: null,
				tipo: null,
				maxtime: 15
			}
			if(cp !== ''){
				filter.regimen = getRegimen();
				var url = getListUrl(filter);
				var data = getDataList(url);
				getDataList();
				showResultsPanel();
			}else{

			}
		})

		var getRegimen = function(){
			if($('#typepublic').hasClass('btn-primary')){
				return 0;
			} else if($('#typeprivate').hasClass('btn-primary')){
				return 1;
			} else {
				return 0;
			}
		}

		var showResultsPanel = function(){
			$('#formbase').addClass('hidden');
			$('#btnback').removeClass('hidden');
			$('#results').removeClass('hidden');
			doHeaderSmall();
			doFooterSmall();
		}

		var showSearchPanel = function(){
			$('#formbase').removeClass('hidden');
			$('#results').addClass('hidden');
			$('#btnback').addClass('hidden');
			$('#btnback').addClass('hidden');
			doHeaderBig();
			doFooterBig();
		}

		var doFooterSmall= function(){
			$('footer').height(20);	
			var contentSize = $(window).height() - $('header').height() - $('footer').height() -65;
			$('#content').height(contentSize);	
		}
		var doFooterBig= function(){
			$('#content').height(300);	
			var footerSize = $(window).height() - $('header').height() - $('#content').height() -65;
			$('footer').height(footerSize);	
		}

		var doHeaderBig = function(){
			$('header').height(250);
			$('.headerlogo').show();			
			$('.headermessage').show();
		}

		var doHeaderSmall = function(){
			$('header').height(90);
			$('.headerlogo').hide();			
			$('.headermessage').hide();
		}

		var footerSize = $(window).height() - $('header').height() - $('#content').height() -65;
		$('footer').height(footerSize);	
	

		var getListUrl = function(filter){
			var cdb = new cartodb({});
			var url = cdb.getAPIURL(filter);
			return url;
		}

		var getDataList = function (url){
			$.ajax({
				url: url,
				dataType: 'json',
				success: function(data){
					createDataList(data);
					createDataMap(data);
				}
			})
		}

		var createMap = function(){
			if(!xmap){
				xmap = true;
				var wmap = $('#results').width() - 20;
				var hmap = $('#results').height() - 20;
				$('#map').height(hmap).width(wmap);

				var map = L.map('map').setView([39, 0], 7);

				// add an OpenStreetMap tile layer
				/*L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				}).addTo(map);*/

L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
          attribution: 'Stamen'
        }).addTo(map);
			}
		}

		var createDataMap = function(){

		}

		var createDataList = function(data){

			var opts = {
				rows: data.rows
			}

			var tpl = '<table class="table table-striped"><thead><tr>';
			tpl += '<th>Tiempo</th><th>Id</th><th>Centro</th><th>Municipio</th><th>Direcci&oacute;n</th><th>Enlace</th>';
			tpl += '</tr></thead><tbody>';
			tpl += '{{#rows}}';
			tpl += '<tr>';
			tpl += '<td>{{atime}} min</td>';
			tpl += '<td>{{codigo}}</td>';
			tpl += '<td><a href="www.google.com" target="_blank">{{despecific}}</a></td>';
			tpl += '<td>{{localidad}}</td>';
			tpl += '<td>{{direccion}}</td>';
			tpl += '<td>{{localidad}}</td>';
			tpl += '</tr>';     
			tpl += '{{/rows}}';
			tpl += '</tbody></table>';
			var html = mustache.to_html(tpl,opts);

			$('#list').html(html);
		}




    	return 'de Casa al Cole';
});
