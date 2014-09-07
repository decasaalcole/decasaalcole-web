/*global define */
define(
	['jquery','cartodb', 'mustache'], 
	function ($, cartodb, mustache) {

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
				//var url = getListUrl(filter);
				//var data = getDataList(url);
				//createDataList(data);
				createDataList();
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
			var cjs = new cartodb.cartojs();
			var url = cjs.getAPIURL(filter);
			return url;
		}

		var getDataList = function (url){
			var obj = this;
			$.ajax({
				url: url,
				dataType: 'json',
				success: function(data){
					obj.createDataList(data);
				}
			})
		}

		var createDataList = function(data){
			var data2 = [
				{
					a:'5min',
					b:'xxx',
					c:'xxx',
					d:'xxx',
					e:'xxx',
					f:'xxx'
				},
				{
					a:'7min',
					b:'xxx',
					c:'xxx',
					d:'xxx',
					e:'xxx',
					f:'xxx'
				},
				{
					a:'8min',
					b:'xxx',
					c:'xxx',
					d:'xxx',
					e:'xxx',
					f:'xxx'
				},
				{
					a:'5min',
					b:'xxx',
					c:'xxx',
					d:'xxx',
					e:'xxx',
					f:'xxx'
				},
				{
					a:'7min',
					b:'xxx',
					c:'xxx',
					d:'xxx',
					e:'xxx',
					f:'xxx'
				},
				{
					a:'8min',
					b:'xxx',
					c:'xxx',
					d:'xxx',
					e:'xxx',
					f:'xxx'
				},
				{
					a:'5min',
					b:'xxx',
					c:'xxx',
					d:'xxx',
					e:'xxx',
					f:'xxx'
				},
				{
					a:'7min',
					b:'xxx',
					c:'xxx',
					d:'xxx',
					e:'xxx',
					f:'xxx'
				},
				{
					a:'8min',
					b:'xxx',
					c:'xxx',
					d:'xxx',
					e:'xxx',
					f:'xxx'
				},
				{
					a:'5min',
					b:'xxx',
					c:'xxx',
					d:'xxx',
					e:'xxx',
					f:'xxx'
				},
				{
					a:'7min',
					b:'xxx',
					c:'xxx',
					d:'xxx',
					e:'xxx',
					f:'xxx'
				},
				{
					a:'8min',
					b:'xxx',
					c:'xxx',
					d:'xxx',
					e:'xxx',
					f:'xxx'
				},
				{
					a:'5min',
					b:'xxx',
					c:'xxx',
					d:'xxx',
					e:'xxx',
					f:'xxx'
				},
				{
					a:'7min',
					b:'xxx',
					c:'xxx',
					d:'xxx',
					e:'xxx',
					f:'xxx'
				},
				{
					a:'8min',
					b:'xxx',
					c:'xxx',
					d:'xxx',
					e:'xxx',
					f:'xxx'
				}
			];
			var opts = {
				rows: data2
			}

			var tpl = '<table class="table table-striped"><thead><tr>';
			tpl += '<th>Tiempo</th><th>Id</th><th>Centro</th><th>Municipio</th><th>Direcci&oacute;n</th><th>Enlace</th>';
			tpl += '</tr></thead><tbody>';
			tpl += '{{#rows}}';
			tpl += '<tr>';
			tpl += '<td>{{a}}</td>';
			tpl += '<td>{{b}}</td>';
			tpl += '<td><a href="www.google.com" target="_blank">{{c}}</a></td>';
			tpl += '<td>{{d}}</td>';
			tpl += '<td>{{e}}</td>';
			tpl += '<td>{{f}}</td>';
			tpl += '</tr>';     
			tpl += '{{/rows}}';
			tpl += '</tbody></table>';
			var html = mustache.to_html(tpl,opts);

			$('#list').html(html);


		}


    	return 'de Casa al Cole';
});
