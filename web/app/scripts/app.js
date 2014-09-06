/*global define */
define(
	['jquery'], 
	function ($) {

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
			var resultsHeight = $('#formbase').height();
			$('#results').height(resultsHeight).removeClass('hidden');
		}

		var showSearchPanel = function(){
			$('#formbase').removeClass('hidden');
			$('#btnback').addClass('hidden');
			$('#btnback').addClass('hidden');
		}

		var resultsHeight = $(window).height() - $('header').height() - $('footer').height() - 30;
		$('#formbase').height(resultsHeight).removeClass('hidden');;




    	return 'de Casa al Cole';
});
