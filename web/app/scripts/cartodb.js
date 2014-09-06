define(
	['mustache'], 
	function (mustache) {
		console.log("pasando por cartodb");

		function cartojs(options){
			this.url = options.url || 'http://decasaalcole.cartodb.com';
		}

		cartojs.prototype = {
			sql : 'with ftimes as (select cp_to cp, from_dist dist, from_time atime ' +
				  'from times where cp_from = \'{{cp}}\'), ttimes as ( select ' + 
				  'cp_from cp, to_dist dist, to_time atime from times where cp_to ' +
				  '= \'{{cp}}\'), totaltimes as ( select * from ftimes union ' +
				  'select * from ttimes union select \'{{cp}}\' cp, 0 dist, 0 atime) ' +
				  'select c.*, t.atime, t.dist adist from coles_cp c join totaltimes t ' +
				  'on c.cp = t.cp {{&where}} order by t.atime, t.dist',

			getURL : function() {
				return this.url; 
			},

			getAPIURL:function(filter){
				var result,sqlstr;
				var view = {
					cp: filter.cp,
					where: function(){
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

						return "WHERE " + conditions.join(" AND ");
					}
				}
				if (filter && filter.cp){
					sqlstr = mustache.render(this.sql,view);
				}
				//http://decasaalcole.cartodb.com/api/v2/sql?q=
				return this.url + "/api/v2/sql?q=" + encodeURI(sqlstr);
			}

		};
		return cartojs;
	}
);