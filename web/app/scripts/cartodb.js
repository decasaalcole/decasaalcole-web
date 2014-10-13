define(
	['mustache','leaflet','cartodbjs'],
	function (mustache,leaflet,cartodbjs) {
		

		function cartojs(options){
			this.url = options.url || 'http://decasaalcole.cartodb.com';
		};

		function getWhere(filter){
			var conditions = [];
			if (filter.regimen && filter.regimen !== '2' ){
				var reg = filter.regimen === '0' ? 'true' : 'false';
				conditions.push("regimen = " + reg);
			}
			if (filter.maxtime){
				conditions.push("atime < " + filter.maxtime);
			}
			if (filter.tipo && filter.tipo.length > 0){
				if (filter.tipo.length == 1){					
					conditions.push("nived like '%"+filter.tipo[0]+"%'");
				}else if (filter.tipo.length > 1){
					var subconditions = "( nived like '%"+filter.tipo[0]+"%'";
					for(var i = 1; i < filter.tipo.length; i++){
						subconditions += " or nived like '%"+filter.tipo[i]+"%'";
					}
					subconditions += ' )';
					conditions.push(subconditions);
				}				
			}
			if (conditions.length>0){
				return "WHERE " + conditions.join(" AND ");
			} else {
				return "";
			}
		}

		cartojs.prototype = {
			sql : 'with ftimes as (select cp_to cp, from_dist dist, from_time atime from times where cp_from = \'{{cp}}\'), ttimes as (select cp_from cp, to_dist dist, to_time atime from times where cp_to = \'{{cp}}\'), totaltimes as (select * from ftimes union select * from ttimes union select \'{{cp}}\' cp, 0 dist, 0 atime) select c.cartodb_id, c.the_geom, ST_astext(c.the_geom) as tgeom, c.the_geom_webmercator, c.regimen, c.dgenerica, c.dabreviada, c.localidad, c.tipocalle, c.direccion, c.numero, c.codigo, ((t.atime)/60)::integer minutes, (t.dist/1000)::integer kms from coles_cp2 c join totaltimes t on c.cp = t.cp {{&where}} order by t.atime, t.dist',

			sqlcp : 'select st_astext(the_geom) pto from cp where cp = {{cp}}',

			sqlclosecp: 'select ST_Distance(ST_Transform(cp.the_geom,25830), ST_Transform(ST_GeomFromText(\'POINT({{lon}} {{lat}})\',\'4326\'),25830)) as dist,cp from cp order by dist asc limit 1',

			getURL : function() {
				return this.url;
			},

			getSQL:function(filter){
				var view = {
					cp: filter.cp,
					where: getWhere(filter)
				};
				return filter && filter.cp ? mustache.render(this.sql,view) : null;
			},
			getCpSQL:function(filter){
				var view = {
					cp: filter.cp
				};
				return filter && filter.cp ? mustache.render(this.sqlcp,view) : null;
			},
			getCloseCpSQL:function(lon,lat){
				var config = {
					lon: lon,
					lat: lat
				};
				return mustache.render(this.sqlclosecp,config);
			},
			getAPIURL:function(filter){
				//http://decasaalcole.cartodb.com/api/v2/sql?q=
				return this.url + "/api/v2/sql?q=" + encodeURI(this.getSQL(filter));
			},

			getLeafletLayer:function(filter,map){
				if(map._layers[30] !== undefined){
					var lyr = map._layers[30];
					var sublyr = lyr.getSubLayer(0);
					sublyr.setSQL(this.getSQL(filter));
				}else{
					// create a layer with 1 sublayer
					var sql = this.getSQL(filter);
					var css = '#times{marker-fill-opacity: 1; marker-line-color: #FFF; marker-line-width: 0; marker-line-opacity: 1; marker-width: 10; marker-fill: #FFFFB2; marker-allow-overlap: true; } #times [ minutes <= 500] {marker-fill: #B10026; } #times [ minutes <= 180] {marker-fill: #E31A1C; } #times [ minutes <= 150] {marker-fill: #FC4E2A; } #times [ minutes <= 120] {marker-fill: #FD8D3C; } #times [ minutes <= 90] {marker-fill: #FEB24C; } #times [ minutes <= 60] {marker-fill: #FED976; } #times [ minutes <= 30] {marker-fill: #FFFFB2;}' +
					          '#times::labels [zoom>10] {text-name: [dabreviada]; text-face-name: \'DejaVu Sans Book\'; text-size: 1;1l text-label-position-tolerance: 10; text-fill: #8f5902; text-halo-fill: #FFF; text-halo-radius: 1.5; text-dy: -10; text-allow-overlap: false; text-placement: point; text-placement-type: simple;}';

					cartodb.createLayer(map, {
					  user_name: 'decasaalcole',
					  type: 'cartodb',
					  sublayers: [{
					    sql: sql,
					    cartocss: css
					  }]
					}).addTo(map).on('done', function(layer) {
					   //console.log("Cargada");
					   layer.invalidate();
					  }).on('error', function(err) {
					    //console.log("some error occurred: " + err);
					  });
					
				}
			},

			showCpLocation:function(cp,map){
				var opts={
					cp: cp
				}				
				var url = this.url + "/api/v2/sql?q=" + encodeURI(this.getCpSQL(opts));
				$.ajax({
					url: url,
					dataType: "json",
					success: function(data){
						if(data.rows.length > 0){
							var pto = data.rows[0].pto;
							var lonlat =pto.substring(6,pto.length-1);
							var lonlat2 = lonlat.split(' ');
							if(map.mrk){
								var lalo = [lonlat2[1], lonlat2[0]];
								map.mrk.setLatLng(lalo).update();
								map.mrk.setPopupContent(cp);
							}else{
								map.mrk = L.marker([lonlat2[1], lonlat2[0]]);
								map.mrk.addTo(map).bindPopup(cp);
							}
						}else{
							if(map.mrk){
								map.removeLayer(map.mrk);
							}
						}
					}
				})
			},

			showSchoolMarker: function(lon,lat,map,title){
				if(map.mrk2){
					var lalo = [lat, lon];
					map.mrk2.setLatLng(lalo).update();
					map.mrk2.setPopupContent(title);
				}else{
					var myIcon = L.icon({
					    iconUrl: '/scripts/themes/css/images/marker-icon2.png',
					    shadowUrl: '/scripts/themes/css/images/marker-shadow.png',
					    iconSize:     [25, 41], // size of the icon
					    shadowSize:   [41, 41],
					    iconAnchor: [12, 41],
					    popupAnchor: [0, -41]
					});
					map.mrk2 = L.marker([lat, lon],{
						icon: myIcon
					});
					map.mrk2.addTo(map).bindPopup(title);
				}

			},

			getCpClose:function(lon,lat,div){
				var url = this.url + "/api/v2/sql?q=" + encodeURI(this.getCloseCpSQL(lon,lat));
				$.ajax({
					url: url,
					dataType: "json",
					success: function(data){
						if(data.rows.length > 0){
							var cp = data.rows[0].cp;
							if(cp && cp.toString().length > 0){
								$('#'+div).val(cp);
							}
						}
					}
				})
			}

		};
		return cartojs;
	}
);