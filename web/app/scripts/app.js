/*global define */
define(
	['jquery','mustache','municoles','cp_muni'], 
	function ($,mustache,municoles,cp_muni) {
    	'use strict';

    	var showButtonPanel = function(cp,muni){
			$('#btncalculate').removeClass('hidden');
			$('#btncalculate').click([cp,muni],function(e){
				var cp = e.handleObj.data[0];
				var muni = e.handleObj.data[1];
				showColeList(cp,muni);
			})
    	};

    	var showColeList = function(cp,muni){
			var list = getMuniList();
			var target = $('#resultList');
			target.empty();
			for(var i = 0; i < list.length; i++){
				var muniList = list[i];
				var elementList = creteElementList(muniList);
				target.append(elementList);
			}
			$('#infoPanel').addClass('hidden');
			$('#selectPanel').addClass('hidden');
			$('#resultPanel').removeClass('hidden');

			$('#btnback').click(function(){
				$('#infoPanel').removeClass('hidden');
				$('#selectPanel').removeClass('hidden');
				$('#resultList').addClass('hidden');

			})

    	};

    	var creteElementList = function(info){		

			var muniTemplate = '<a href="#" class="muniList list-group-item active">';
			muniTemplate += '<div class="muniListTimeIcon glyphicon glyphicon-time dinline"></div><div class="muniListTime dinline">{{time}}</div>';
			muniTemplate += '<div class="muniListNameIcon glyphicon glyphicon-globe dinline"></div><div class="muniListName dinline">{{muni}}</div>';
			muniTemplate += '</a>';
			var muniHtml =  mustache.to_html(muniTemplate, info);

			var coleTemplate = '<a href="#" class="coleList list-group-item">';
			coleTemplate += '<div class="coleListName glyphicon glyphicon-home">{{name}}</div>';
			coleTemplate += '<div class="coleListAddress glyphicon glyphicon-map-marker dinline">{{address}}</div>';
			coleTemplate += '</a>';
			var colesHtml = '';
			for(var i = 0; i < info.coles.length; i++){
				var infoCole = info.coles[i];
				colesHtml += mustache.to_html(coleTemplate, infoCole);
			};
			var groupHtml = '<div class="muni-list-group list-group">'+muniHtml+colesHtml+'</div>';
			return groupHtml;

    	};

    	var getMuniList = function(cp,muni){
    		//TODO Ajax request
    		return muni_coles.to;
    	};

    	var showTypeColePanel = function(cp,muni){
			var panel = $('#typecolepanel');
			panel.removeClass('hidden');
			$('#typegroup').children().click(
				[cp,muni],
				function(e){
					var cp = e.data[0];
					var muni = e.data[1];
					showButtonPanel(cp,muni);
				}
			);
    	};


		var showMunisPanel = function(cp,munis){
				var panel = $('#munispanel');
				panel.removeClass('hidden');
				if(munis.length == 1){
					panel.append('<h4>Municipio: <span class="label label-success">'+munis[0]+'</span></h4>');
					showTypeColePanel(cp,munis[0]);
					//showButtonPanel(cp,munis[0]);
				}else{
					panel.append('<div>Selecciona municipio</div>');
					panel.append('<div id=\"munigroup\" class=\"btn-group\">');					
					for(var i = 0; i < munis.length; i++){
						$('#munigroup').append('<div id=\"but'+munis[i]+'\" class=\"btn btn-default btn-xs btn_muni\">'+munis[i]+'</div>');
						var button = $('#but'+munis[i]);
						button.data('cp',cp);
						button.data('muni',munis[i]);
					}
					$('.btn_muni').click(function(e){
						var button = $('#'+this.id);
						clearMuniButtons();
						button.removeClass('btn-default');
						button.addClass('btn-primary');
						var cp = button.data('cp'); 
						var muni = button.data('muni');
						showTypeColePanel(cp,muni); 
						//showButtonPanel(cp,muni);
					})

				}
		};

		var clearMuniButtons = function(){
			$('.btn_muni').each(function(){
				if(this.className === 'btn btn-xs btn_muni btn-primary'){
					this.classList.remove('btn-primary');
					this.classList.add('btn-default');
				}
			})
		};


		$('#cpinput').keyup(function(event) {
			var cp_value = $('#cpinput').val();
			if(cp_value.length > 3){
				var munis = cp_munis[cp_value];
				if(munis !== undefined && munis.length > 0){
					showMunisPanel(cp_value,munis);
				} 
			}
		});




    	return 'de Casa al Cole';
});
