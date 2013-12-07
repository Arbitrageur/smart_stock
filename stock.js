var tickers=["A005930","A005380","A012330","A005490","A000270"];
//var grad = ["#E53B00", "#E6450D", "#E74F1A", "#E95928", "#EA6435", "#EB6E43", "#ED7850", "#EE835D", "#EF8D6B", "#F19778", "#F2A286", "#F4AC93", "#F5B6A1", "#F6C1AE", "#F8CBBB"];
var grad = ["#E53B00", "#E6450D", "#E74F1A", "#E95928", "#EA6435", "#EB6E43", "#ED7850", "#EE835D", "#EF8D6B", "#F19778", "#F2A286", "#F4AC93", "#F5B6A1", "#F6C1AE", "#F8CBBB", "#BBE1EE", "#AEDBEA", "#A1D5E7", "#93CFE4", "#86C9E0", "#78C3DD", "#6BBDD9", "#5DB7D6", "#50B1D3", "#43ABCF", "#35A5CC", "#289FC9", "#1A99C5", "#0D93C2", "#008DBF"] 
var chart;
$(document).ready(function () {
    var gUpdatable = true;
    var history;

    function range(start, stop, step){
        if (typeof stop=='undefined'){
            // one param defined
            stop = start;
            start = 0;
        };
        if (typeof step=='undefined'){
            step = 1;
        };
        if ((step>0 && start>=stop) || (step<0 && start<=stop)){
            return [];
        };
        var result = [];
        for (var i=start; step>0 ? i<stop : i>stop; i+=step){
            result.push(i);
        };
        return result;
    };

    var gData;
    var options = {
        width: 1500,
        height: 770,
        cellSize: 55,
        cellRound: 0,
        cellSpace: 1,
	offsetX: 5,
	offsetY: 5,
        cellColors: ['#F52700', '#00EB57', '#000000'],
        background: '#000633',
        sortby: 'none',
	filterby: []
    };

    chart = Highcharts.StockChart({
        chart: {
            margin: 10,
            borderWidth: 0,
            renderTo: $("#info")[0],
            height: 500
        },
        navigator: {
            top: 430,
            margin: 30
        }, 
        series: [{
            data: [],
            type: 'candlestick'
        },{
            data: [],
            type: 'column',
            yAxis: 1
        }],
        yAxis: [{
            height: 314
        } , {
            top: 350,
            height: 56
        }],
        xAxis: {
            offset: 0
        },
        loading: {
            style: {
                backgroundColor: 'silver'
            },
            labelStyle: {
                color: 'white'
            }
        }
        
    });
    options.width = $(document).width()-2*options.offsetX;
    options.height = $(document).height()-2*options.offsetY;
    options.chartWidth = options.width * 0.7;
    options.chartHeight = options.height * 0.7;

    d3.select("#info-container").style("top", function() { return $(document).height()/2 - options.chartHeight / 2 + 'px'; });
    d3.select("#info-container").style("left", function() { return $(document).width()/2 - options.chartWidth / 2 + 'px'; });
    d3.select("#info-container").style({ "width": options.chartWidth, "height": options.chartHeight});
    
    /*
    $('#chart').dialog({
        autoOpen: false,
        width: options.width * 0.6,
        height: options.height * 0.6,
        modal: true
    });
    */
    $('#sortbutton').children().first().css('border-radius', '3px 0px 0px 3px');
    $('#sortbutton').children().last().css('border-radius', '0 3px 3px 0px');
    $('#filterbutton').children().first().css('border-radius', '3px 0px 0px 3px');
    $('#filterbutton').children().last().css('border-radius', '0 3px 3px 0px');

    $('#sortbyret').on('click', function() {
        if ($(this).hasClass("toggleBtnUnchecked")) {
	    $(this).parent().children().not($(this)).removeClass('toggleBtnChecked').addClass("toggleBtnUnchecked", 200);
	    $(this).removeClass('toggleBtnUnchecked').addClass("toggleBtnChecked", 200);
	    options.sortby = 'ret';
	    //sortUpdate(gData);
	    gUpdatable = false;
	    update(gData);
	}
    });

    $('#sortbymc').on('click', function() {
	if ($(this).hasClass("toggleBtnUnchecked")) {
            $(this).parent().children().not($(this)).removeClass('toggleBtnChecked').addClass("toggleBtnUnchecked", 200);
	    $(this).removeClass('toggleBtnUnchecked').addClass("toggleBtnChecked", 200);
            options.sortby = 'mktcap';
            //sortUpdate(gData);
            gUpdatable = false;
            update(gData);
	}
    });

    $('#sortbyta').on('click', function() {
        if ($(this).hasClass("toggleBtnUnchecked")) {
            $(this).parent().children().not($(this)).removeClass('toggleBtnChecked').addClass("toggleBtnUnchecked", 200);
	    $(this).removeClass('toggleBtnUnchecked').addClass("toggleBtnChecked", 200);
            options.sortby = 'tradeamt';
            gUpdatable = false;
            update(gData);
	}
    });
    $('#sortbynone').on('click', function() {
        if ($(this).hasClass("toggleBtnUnchecked")) {
            $(this).parent().children().not($(this)).removeClass('toggleBtnChecked').addClass("toggleBtnUnchecked", 200);
	    $(this).removeClass('toggleBtnUnchecked').addClass("toggleBtnChecked", 200);
            options.sortby = 'none';
            //sortUpdate(gData);
            gUpdatable = false;
            update(gData);
	}
    });
    $('#filterNone').on('click', function() {
        if ($(this).hasClass("toggleBtnUnchecked")) {
	    $(this).parent().children().not($(this)).removeClass('toggleBtnChecked').addClass("toggleBtnUnchecked", 200);
            $(this).removeClass('toggleBtnUnchecked').addClass("toggleBtnChecked", 200);
            options.filterby = [];
            gUpdatable = false;
            update(gData);
	}
    });
    $('#filterK200').on('click', function() {
        if ($(this).hasClass("toggleBtnUnchecked")) {
            $(this).removeClass('toggleBtnUnchecked').addClass("toggleBtnChecked", 200);
	    $('#filterNone').removeClass('toggleBtnChecked').addClass('toggleBtnUnchecked', 200);
	    //            $(this).parent().children().removeClass('toggleBtnChecked').addClass("toggleBtnUnchecked", 200);
	    if (options.filterby.indexOf('k200') < 0)
		options.filterby.push('k200');
            gUpdatable = false;
            update(gData);
	}
	else {
	    $(this).removeClass('toggleBtnChecked').addClass("toggleBtnUnchecked", 200);
	    $('#filterNone').removeClass('toggleBtnChecked').addClass('toggleBtnUnchecked', 200);
	    var removeIndex = options.filterby.indexOf('k200');
	    if (removeIndex >= 0) {
		options.filterby.splice(removeIndex, 1);
		if (options.filterby.length  == 0) {
		    $('#filterNone').removeClass('toggleBtnUnchecked').addClass('toggleBtnChecked', 200);
		}
	    }
	}
	gUpdatable = false;
        update(gData);
    });
    $('#filterK100').on('click', function() {
        if ($(this).hasClass("toggleBtnUnchecked")) {
            $(this).removeClass('toggleBtnUnchecked').addClass("toggleBtnChecked", 200);
	    $('#filterNone').removeClass('toggleBtnChecked').addClass('toggleBtnUnchecked', 200);
	    //          $(this).parent().children().removeClass('toggleBtnChecked').addClass("toggleBtnUnchecked", 200);
	    if (options.filterby.indexOf('k100') < 0)
		options.filterby.push('k100');

	}
	else {
	    $(this).removeClass('toggleBtnChecked').addClass("toggleBtnUnchecked", 200);
	    var removeIndex = options.filterby.indexOf('k100');
	    if (removeIndex >= 0) {
		options.filterby.splice(removeIndex, 1);
	    	if (options.filterby.length  == 0) {
		    $('#filterNone').removeClass('toggleBtnUnchecked').addClass('toggleBtnChecked', 200);
		}
	    }
	}
	gUpdatable = false;
        update(gData);
    });

    /*
    d3.select('body').style('background', options.background);
    d3.select('#showing').style('background', options.background);
     */
    //d3.select('#info').style('background', 'white').style('width',200);
    $('#btnLine').on('click', function() {
        $('#info-container').css('visibility', 'hidden');
        $(this).css('enabled', false);
    });
    var createData = function() {
        var i;
        var rtn=[];

        for (i = 0; i < tickers.length; i++) {
            rtn.push({'ticker': tickers[i], 'return': Math.random()*3/10 - 0.15});
        }
        return rtn;
    }
    var formatReturn = d3.format(".02f");
    var formatPrice = d3.format(",d");
    var formatIndex = d3.format(",.2f");

    var svg = d3.select("#showing").append("svg")
            .attr('width', options.width)
	    .attr('height', options.height);

    var gradient = svg.append("svg:defs")
	    .append("svg:linearGradient")
	    .attr("id", "gradient")
	    .attr("x1", "0%")
	    .attr("y1", "0%")
	    .attr("x2", "0%")
	    .attr("y2", "100%")
	    .attr("spreadMethod", "pad");
    gradient.append("svg:stop")
	.attr("offset", "0%")
//	.attr("stop-color", "#3F3F3F")
    	.attr("stop-color", "#000D38")
	.attr("stop-opacity", 1);
    gradient.append("svg:stop")
	.attr("offset", "100%")
//	.attr("stop-color", "#0E0E0E")
    	.attr("stop-color", "#000514")
	.attr("stop-opacity", 1);
    
    var board = svg.append("svg:rect")
	    .attr("width", options.width)
	    .attr("height", options.height)
	    .attr("fill", "url(#gradient)");
    
    //svg.style('background-color', "url(#gradient)");
    
     var tooltip = svg.append('rect')
     .attr('class', 'toolitp')
    .attr('render-order', 1)
     .attr('width', 200)
     .attr('height', 200)
     .attr('x', 200)
     .attr('y', 200)
     .attr('fill', 'white')
     .attr('visibility', 'hidden');

    var returnOpacity = d3.scale.linear()
            .domain([0, 0.15])
	    .range([0.10, 1]);

    var maxX = Math.round(options.width / (options.cellSize + options.cellSpace) - 0.5);
    var maxY = Math.round(options.height / (options.cellSize + options.cellSpace) - 0.5);
    var seq = d3.scale.ordinal();

    function brightAdj(d) {
	return returnOpacity(Math.abs(d.return)) > 0.9 ? 1.2 : 0;
    }
    
    function update(da2) {
	/*
         if (options.filterby == 'k200')
             da2 = da2.filter(function(e) { return e.k200 == 1; });
        else if (options.filterby == 'k100')
            da2 = da2.filter(function(e) { return e.k100 == 1; });
        else
            da2 = da2.slice(0);
	*/

        var da = da2.slice(0);
        seq.range(range(da.length));
        var tickers = [];

        if (options.sortby == 'none')
            tickers = da.map(function(d) { return d.ticker; });
        else if (options.sortby == 'ret')
            tickers = da.sort(function(a, b) { return b.return - a.return; }).map(function(d) { return d.ticker; });
        else if (options.sortby == 'mktcap')
            tickers = da.sort(function(a, b) { return b.mktcap - a.mktcap; }).map(function(d) { return d.ticker; });
        else if (options.sortby == 'tradeamt')
            tickers = da.sort(function(a, b) { return b.tradeamount- a.tradeamount; }).map(function(d) { return d.ticker; });

        var seq0 = seq.domain(tickers).copy();

        d3.transition().duration(750).each(function() {
	    var cells = svg.selectAll('.cell')
		    .data(da2, function(d) { return d.ticker; });

            var cellsEnter = cells.enter().insert('g')
		    .attr('class', 'cell')
		    .attr('transform', function(d, i) { 
			var x = (seq0(d.ticker) % maxX) * (options.cellSize + options.cellSpace) + options.offsetX;
			var y = Math.round(seq0(d.ticker) / maxX - 0.5) * (options.cellSize + options.cellSpace) + options.offsetY;
			return "translate(" + x + "," + y + ")"; 
		    });
/*
	    cellsEnter.append('rect')
		.attr('width', options.cellSize)
		.attr('height', options.cellSize)
		.attr('rx', options.cellRound)
		.attr('ry', options.cellRound)
		.attr('fill', 'black');
*/
            cellsEnter.append('rect')
		.attr('class', 'cellbox')
		.attr('width', options.cellSize)
		.attr('height', options.cellSize)
		.attr('rx', options.cellRound)
		.attr('ry', options.cellRound)
		.attr('stroke-width',function(d) { return d.ticker == 'KOSPI200' ? 1 : 0;})
	    	.attr('stroke', 'white');
            /* ticker */
            cellsEnter.append('text')
		.attr('class', 'code')
		.attr('x', options.cellSize/2)
		.attr('y', options.cellSize/2 - 11)
		.attr('text-anchor', 'middle')
		.attr('fill', 'white')
//		.attr('font-family', 'Helvetica Neue')
		.attr('font-family', 'Gill Sans')
		.attr('font-weight', 200)
		.attr('font-size', '11')
		.text(function(d) { return d.ticker; });

            /* return */
            cellsEnter.append('text')
		.attr('class', 'ret')
		.attr('x', options.cellSize/2)
		.attr('y', options.cellSize/2+5)
		.attr('text-anchor', 'middle')
//		.attr('font-family', 'Helvetica Neue')
		.attr('font-family', 'Gill Sans')
		.attr('font-weight', 200)
		.attr('font-size', '13')
		.text(function(d) { return formatReturn(d.return*100) + "%"; });
            /* price */

            cellsEnter.append('text')
		.attr('class', 'price')
		.attr('x', options.cellSize/2)
		.attr('y', options.cellSize/2+20)
		.attr('text-anchor', 'middle')
//		.attr('font-family', 'Helvetica Neue')
		.attr('font-family', 'Gill Sans')
		.attr('font-weight', 200)
		.attr('font-size', '11')
		.text(function(d) {
		    if (d.ticker == 'KOSPI200')
			return formatIndex(d.price);
		    else
			return formatPrice(d.price);
		});

            cells.select('.code')
		.text(function(d) { return d.ticker; })
	    	.attr('fill', function(d) {
		    return d3.rgb('white').darker(brightAdj(d));
		});
            cells.select('.ret')
		.text(function(d) { return formatReturn(d.return*100) + "%"; })
	    	.attr('fill', function(d) {
		    return d3.rgb('yellow').darker(brightAdj(d));
		});
            cells.select('.price')
		.text(function(d) {
		    if (d.ticker == 'KOSPI200')
			return formatIndex(d.price);
		    else
			return formatPrice(d.price);
		})
		.attr('fill', function(d) {
		    return d.return > 0 ? (d3.rgb('red').darker(brightAdj(d))) : ((d.return == 0) ? 'white' :  d3.rgb('cyan').darker(brightAdj(d)));
		});
            cells.select('.cellbox')
		.attr('fill-opacity', function(d, i) {
		    var filterd = false;

		    if (options.filterby.length > 0) {
			options.filterby.forEach(function(v, i) {
			    filterd = filterd || d[v] == 1;
			});
		    } else
			filterd = true;
		    return filterd ? (d.return == 0 ? 0.3 : returnOpacity(Math.abs(d.return))) : 0.5; })
		.attr('fill', function(d) {
		    var filterd = false;

		    if (options.filterby.length > 0) {
			options.filterby.forEach(function(v, i) {
			    filterd = filterd || d[v] == 1;
			});
		    } else
			filterd = true;
                    return filterd ? (options.cellColors[d.return > 0 ? 0 : (d.return == 0 ? 2 : 1)]) : '#1f1f1f';} );

	    d3.selectAll('.cell').attr('fill-opacity', function(d) {
		var filterd = false;

		if (options.filterby.length > 0) {
		    options.filterby.forEach(function(v, i) {
			filterd = filterd || d[v] == 1;
		    });
		} else
		    filterd = true;

		return filterd ? 1 : 0.1;
		
	    });
            cells.on('mouseover', function(d, i) {
		d3.select('#selectedTicker').text(d.ticker);
		d3.select('#tamt').text(formatPrice(d.tradeamount));
		d3.select('#openprice').text(function() {
		    if (d.ticker == 'KOSPI200')
			return formatIndex(d.open);
		    else
			return formatPrice(d.open);
		});
		d3.select('#highprice').text(function() {
		    if (d.ticker == 'KOSPI200')
			return formatIndex(d.high);
		    else
			return formatPrice(d.high);
		});
		d3.select('#lowprice').text(function() {
		    if (d.ticker == 'KOSPI200')
			return formatIndex(d.low);
		    else
			return formatPrice(d.low);
		});
		d3.select('#curprice').text(function() {
		    if (d.ticker == 'KOSPI200')
			return formatIndex(d.price);
		    else
			return formatPrice(d.price);
		});
		d3.select('#tvol').text(formatPrice(d.tradevolume));
            });

            var formatDate = d3.time.format("%Y-%m-%d");

            cells.on('click', function(d, i) {
                /*
                 var dt = new google.visualization.DataTable();
                 dt.addColumn('date', 'Date');
                 dt.addColumn('close', 'Close');
                 */

                $('#info-container').css('visibility', 'visible');
                chart.showLoading();
                $.ajax({
                    url:'http://127.0.0.1:5000/',
                    type:'POST',
                    timeout:3000,
                    dataType:'JSON',
                    data: {ticker: d.ticker, start_date: "2005-01-01", end_date: "2015-12-31"},
                    crossDomain: true,
                    error:function(){
                        //alert('Error');
                    },
                    success:function(json){
                        var stock = [];
                        var vl = [];
                        for (var i = 0; i < json.length; i++) {
                            stock.push([formatDate.parse(json[i][0]),json[i][1], json[i][2], json[i][3], json[i][4]]);
                            vl.push([formatDate.parse(json[i][0]),json[i][5]]);
                        }
                        /*
                         chart.series[0].setData(stock);
                         chart.series[1].setData(vl);
                         */
                        chart.series[0].update({
                            name: d.ticker,
                            data: stock,
                            type: 'candlestick'
                        });
                        chart.series[1].update({
                            name: 'Volume',
                            data: vl,
                            type: 'column',
                            yAxis: 1
                        });
                        chart.hideLoading();
                        chart.redraw();
                        $('#btnLine').css('enabled', true);
                    }
                });
            });
            cells.transition()/*.ease(d3.ease('exp-in-out')).*/
		.attr('transform', function(d, i) { 
                    var x = (seq0(d.ticker) % maxX) * (options.cellSize + options.cellSpace) + options.offsetX;
                    var y = Math.round(seq0(d.ticker) / maxX - 0.5) * (options.cellSize + options.cellSpace) + options.offsetY;
                    return "translate(" + x + "," + y + ")"; 
                }); //.each('end', function() { gUpdatable = true; });

            var cellsExit = cells.exit().remove();
            /*
             cellsExit.select('.code').transition().attr("fill-opacity", 0);
             cellsExit.select('.ret').transition().attr("fill-opacity", 0);
             cellsExit.select('.ret').transition().attr("fill-opacity", 0);
             cellsExit.select('.cellbox').transition().attr("fill-opacity", 0);
             cellsExit.transition()
             .attr("fill-opacity", 0)
             .remove();
             */

        });

	/*
         d3.selectAll('.cell').on('mousedown', function(d, i) {
         var coor = [0, 0];
         coor = d3.mouse(svg.node());
         //tooltip.attr('visibility', 'visible')
         d3.select('#info').style({
         'position': 'absolute',
         'width' : '300px',
         'height' : '200px',
         'top' : coor[1] + 30 + 'px',
         'left' : coor[0] + 30 + 'px',
         'z-index' : 2,
         'visibility': 'visible'});
         })
         .on('mouseup', function(d, i) {
         d3.select('#info').style({
         'position': 'absolute',
         'width' : '300px',
         'height' : '200px',
         'z-index' : 2,
         'visibility': 'hidden'});
         });
         */
        gUpdatable = true;
    }

    $.ajax({
        url:'http://127.0.0.1:5000/stocklive',
        type:'GET',
        timeout:1000,
        dataType:'JSON',
        crossDomain: true,
        error:function(){
            //alert('Error');
        },
        success:function(json){
            gData = json.slice(0);
            update(json);
        }
    });
    setInterval(function() { 
        $.ajax({
        url:'http://127.0.0.1:5000/stocklive',
        type:'GET',
        timeout:1000,
        dataType:'JSON',
        crossDomain: true,
        error:function(){
            //alert('Error');
        },
        success:function(json){
            gData = json.slice(0);
            if (gUpdatable)
                update(json);
        }
        });
    //}, 10000);
    }, 3700);
});
