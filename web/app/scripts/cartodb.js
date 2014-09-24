define(
	['mustache','leaflet','cartodbjs'],
	function (mustache,leaflet,cartodbjs) {
		console.log("pasando por cartodb");

		function cartojs(options){
			this.url = options.url || 'http://decasaalcole.cartodb.com';
		};

		function getWhere(filter){
			var conditions = [];
			if (filter.regimen && filter.regimen !== undefined ){
				var reg = filter.regimen === '0' ? 'false' : 'true';
				conditions.push("regimen = " + reg);
			}
			if (filter.maxtime){
				conditions.push("atime < " + filter.maxtime);
			}
			if (filter.tipo){
				conditions.push("nived like '%"+filter.tipo+"%'");
			}

			if (conditions.length>0){
				return "WHERE " + conditions.join(" AND ")
			} else {
				return "";
			}
		}



		cartojs.prototype = {
			sql : 'with ftimes as (select cp_to cp, from_dist dist, from_time atime from times where cp_from = \'{{cp}}\'), ttimes as (select cp_from cp, to_dist dist, to_time atime from times where cp_to = \'{{cp}}\'), totaltimes as (select * from ftimes union select * from ttimes union select \'{{cp}}\' cp, 0 dist, 0 atime) select c.cartodb_id, c.the_geom, c.the_geom_webmercator, c.regimen, c.despecific, c.localidad, c.tipocalle, c.direccion, c.numero, c.codigo, ((t.atime)/60)::integer minutes, (t.dist/1000)::integer kms from coles_cp c join totaltimes t on c.cp = t.cp {{&where}} order by t.atime, t.dist',

			sqlcp : 'select st_astext(the_geom) pto from cp where cp = {{cp}}',

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
					cartodb.createLayer(map, {
					  user_name: 'decasaalcole',
					  type: 'cartodb',
					  sublayers: [{
					    sql: this.getSQL(filter),
					    cartocss: '#times{marker-fill-opacity: 1; marker-line-color: #FFF; marker-line-width: 0; marker-line-opacity: 1; marker-width: 10; marker-fill: #FFFFB2; marker-allow-overlap: true; } #times [ minutes <= 500] {marker-fill: #B10026; } #times [ minutes <= 180] {marker-fill: #E31A1C; } #times [ minutes <= 150] {marker-fill: #FC4E2A; } #times [ minutes <= 120] {marker-fill: #FD8D3C; } #times [ minutes <= 90] {marker-fill: #FEB24C; } #times [ minutes <= 60] {marker-fill: #FED976; } #times [ minutes <= 30] {marker-fill: #FFFFB2;}'
					  }]
					}).addTo(map);
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
								var lalo = L.latLng(lonlat2[1], lonlat2[0]);
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
			}

		};
		return cartojs;
	}
);