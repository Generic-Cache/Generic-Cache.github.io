// utilities
var get = function (selector, scope) {
  scope = scope ? scope : document;
  return scope.querySelector(selector);
};

var getAll = function (selector, scope) {
  scope = scope ? scope : document;
  return scope.querySelectorAll(selector);
};

if (document.getElementsByClassName('demo0').length > 0 && document.getElementsByClassName('demo1').length > 0 && document.getElementsByClassName('demo2').length > 0) {
  var txt = [
    [`docker run --restart unless-stopped --name linuxcache -td generic_cache:latest
    linuxcache is running`],
    [`docker exec -it linuxcache bash`],
    [`./display

    =================================
    The status of current traffic
    =================================

    rid="27ba00689aedd548ad64afe704b79e7c" pck="http://archive.ubuntu.com/ubuntu/dists/disco-updates/main/dep11/icons-64x64.tar.gz" ucs="HIT" http_method="GET" response_time="-" cookie="-" request_time="0.000" 
    rid="6149405056a8a56dd9da04b1b7ed0404" pck="http://archive.ubuntu.com/ubuntu/dists/disco-updates/restricted/i18n/Translation-en.xz" ucs="UPDATING" http_method="GET" response_time="-" cookie="-" request_time="0.000" 
    rid="b45112a6f7d7bfb0f9dec416f577200a" pck="http://archive.ubuntu.com/ubuntu/dists/disco-updates/restricted/i18n/Translation-en.xz" ucs="EXPIRED" http_method="GET" response_time="0.348" cookie="-" request_time="0.364" 
    rid="ed041497d1f249e4831464353d849a15" pck="http://archive.ubuntu.com/ubuntu/dists/disco-updates/restricted/i18n/Translation-en.xz" ucs="UPDATING" http_method="GET" response_time="-" cookie="-" request_time="0.000" 
    rid="6ed03f2e4a09ce61d74e87e16c3ef920" pck="http://archive.ubuntu.com/ubuntu/pool/main/l/linux/linux-libc-dev_4.15.0-32.35_amd64.deb" ucs="MISS" http_method="GET" response_time="0.348, 0.352, 0.344, 0.360, 0.360, 0.368, 0.328, 0.632, 0.344" cookie="-" request_time="3.488" 

    ^C `],
    [`exit`]
  ];

  var speed = 60;
  var speed2 = 500;
  var txt_ = txt[2].toString().split("\n")

  var to1 = 0; //docker run
  var to2 = to1 + speed * (txt[0].toString().length + 30); // docker exec
  var to3 = to2 + speed * txt[1].toString().length; // ./display
  var to4 = to3 + speed * txt_[0].length; // the stats
  var to5 = to4 + speed2 * (txt_.length - 6); //exit 

  var to = [to1, to2, to3, to5, to4];

  sequence_operate(txt,0);

  function sequence_operate(arr,index){   
      setTimeout(function(){
        if(index != arr.length - 2){
          typeItOut(txt[index] + "", "demo"+index.toString(), 0, to[index]);
        } else if (index == arr.length -2){
          typeItOut(txt_[0], "demo"+index.toString(), 0, to3);
          typeLineOut(txt_, 1, to4);
        }
        if(index<arr.length){
          sequence_operate(arr,index+1);
        }
      });
  }

  function typeItOut (data, demo, index, to) {
    data = "" + data;
    setTimeout(function(){
      if (document.getElementsByClassName(demo).length >0) {
        document.getElementsByClassName(demo)[0].innerHTML += data.charAt(index);
        if (index + 1 < data.length){ 
          typeItOut(data, demo, index+1, speed);
        }
      }
    }, to);
  }

  function typeLineOut (data, index, speed) {
    // console.log(data[index], index)
    setTimeout(function(){
      var line = "" + data[index];
      toadd = line;
      if(line.search("HIT") >= 0) {
        toadd = line.fontcolor("green");
      } else if (line.search("MISS") >=0 ){
        toadd = line.fontcolor("red");
      } else if (line.search("UPDATING") >= 0) {
        toadd = line.fontcolor("yellow");
      } else if (line.search("EXPIRED") >= 0){
        toadd = line.fontcolor("blue");
      }
      
      if (document.getElementsByClassName('demo2').length > 0) {
        document.getElementsByClassName('demo2')[0].innerHTML += toadd + "\n";
        if(index + 1 < data.length){
          if (index + 1 < 6 || index + 1 == data.length - 1) {
            typeLineOut(data, index + 1, 0);
          } else {
            typeLineOut(data,index + 1, speed2);
          }
        }
      }
    }, speed);
  }
}


// toggle tabs on codeblock
window.addEventListener("load", function() {
  // get all tab_containers in the document
  var tabContainers = getAll(".tab__container");

  // bind click event to each tab container
  for (var i = 0; i < tabContainers.length; i++) {
    get('.tab__menu', tabContainers[i]).addEventListener("click", tabClick);
  }

  // each click event is scoped to the tab_container
  function tabClick (event) {
    var scope = event.currentTarget.parentNode;
    var clickedTab = event.target;
    var tabs = getAll('.tab', scope);
    var panes = getAll('.tab__pane', scope);
    var activePane = get(`.${clickedTab.getAttribute('data-tab')}`, scope);

    // remove all active tab classes
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove('active');
    }

    // remove all active pane classes
    for (var i = 0; i < panes.length; i++) {
      panes[i].classList.remove('active');
    }

    // apply active classes on desired tab and pane
    clickedTab.classList.add('active');
    activePane.classList.add('active');
  }
});

//in page scrolling for documentaiton page
var btns = getAll('.js-btn');
var sections = getAll('.js-section');

function setActiveLink(event) {
  // remove all active tab classes
  for (var i = 0; i < btns.length; i++) {
    btns[i].classList.remove('selected');
  }

  event.target.classList.add('selected');
}

function smoothScrollTo(i, event) {
  var element = sections[i];
  setActiveLink(event);

  window.scrollTo({
    'behavior': 'smooth',
    'top': element.offsetTop - 20,
    'left': 0
  });
}

if (btns.length && sections.length > 0) {
  for (var i = 0; i<btns.length; i++) {
    btns[i].addEventListener('click', smoothScrollTo.bind(this,i));
  }
}

// fix menu to page-top once user starts scrolling
window.addEventListener('scroll', function () {
  var docNav = get('.doc__nav > ul');

  if( docNav) {
    if (window.pageYOffset > 63) {
      docNav.classList.add('fixed');
    } else {
      docNav.classList.remove('fixed');
    }
  }

  var currPos = window.pageYOffset;
  var idx = 0;
  for (var i=0; i < sections.length; i++) {
    if (currPos >= sections[i].offsetTop -30 ){
      idx = i;
    }
  }
  
  setActiveBtn(idx);

  function setActiveBtn(index) {
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.remove('selected');
    }

    btns[index].classList.add('selected');
  }
});

// responsive navigation
var topNav = get('.menu');
var icon = get('.toggle');

window.addEventListener('load', function(){
  function showNav() {
    if (topNav.className === 'menu') {
      topNav.className += ' responsive';
      icon.className += ' open';
    } else {
      topNav.className = 'menu';
      icon.classList.remove('open');
    }
  }
  icon.addEventListener('click', showNav);
});



// line graph --> The traffic graph
am4core.ready(function() {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end
  
  // Create chart
  var chart = am4core.create("traffic_div", am4charts.XYChart);
  chart.paddingRight = 20;
  chart.colors.step = 2;
  
  chart.legend = new am4charts.Legend();
  chart.legend.position = 'bottom';
  chart.legend.paddingBottom = 20;
  chart.legend.labels.template.maxWidth = undefined;
  chart.legend.labels.template.text = "[bold {color}]{name}[/]";


  chart.data = [
    {
      "Days": 1,
      "Bandwidth saved": 27.3,
      "Total": 28941
    },
    {
      "Days": 2,
      "Bandwidth saved": 67.2,
      "Total": 64113
    },
    {
      "Days": 3,
      "Bandwidth saved": 22.3,
      "Total": 27258
    },
    {
      "Days": 4,
      "Bandwidth saved": 16.3,
      "Total": 22353
    },
    {
      "Days": 5,
      "Bandwidth saved": 55.96,
      "Total": 59040
    },
    {
      "Days": 6,
      "Bandwidth saved": 83.94,
      "Total": 88595
    },
    {
      "Days": 7,
      "Bandwidth saved": 49.72,
      "Total": 63373
    },
    {
      "Days": 8,
      "Bandwidth saved": 74.58,
      "Total": 110228
    },
    {
      "Days": 9,
      "Bandwidth saved": 57.8,
      "Total": 71514
    },
    {
      "Days": 10,
      "Bandwidth saved": 32.8,
      "Total": 33657
    },
    {
      "Days": 11,
      "Bandwidth saved": 12.1,
      "Total": 22457
    },
    {
      "Days": 12,
      "Bandwidth saved": 62.1,
      "Total": 88897
    },
    {
      "Days": 13,
      "Bandwidth saved": 50.8,
      "Total": 67684
    },
    {
      "Days": 14,
      "Bandwidth saved": 21.6,
      "Total": 44848
    },
    {
      "Days": 15,
      "Bandwidth saved": 13.74,
      "Total": 24606
    },
    {
      "Days": 16,
      "Bandwidth saved": 14.03,
      "Total": 24502
    },
    {
      "Days": 17,
      "Bandwidth saved": 13.55,
      "Total": 24542
    },
    {
      "Days": 18,
      "Bandwidth saved": 12.78,
      "Total": 24106
    },
    {
      "Days": 19,
      "Bandwidth saved": 15.13,
      "Total": 25276
    },
    {
      "Days": 20,
      "Bandwidth saved": 23.2,
      "Total": 39232
    },
    {
      "Days": 21,
      "Bandwidth saved": 15.6,
      "Total": 29878
    },
    {
      "Days": 22,
      "Bandwidth saved": 14.9,
      "Total": 27891
    },
    {
      "Days": 23,
      "Bandwidth saved": 7.9,
      "Total": 15651
    },
    {
      "Days": 24,
      "Bandwidth saved": 6.7,
      "Total": 16167
    },
    {
      "Days": 25,
      "Bandwidth saved": 12,
      "Total": 29079
    },
    {
      "Days": 26,
      "Bandwidth saved": 10.2,
      "Total": 21681
    },
    {
      "Days": 27,
      "Bandwidth saved": 58.68,
      "Total": 49909
    },
    {
      "Days": 28,
      "Bandwidth saved": 88.02,
      "Total": 75472
    },
    {
      "Days": 29,
      "Bandwidth saved": 42,
      "Total": 59292
    },
    {
      "Days": 30,
      "Bandwidth saved": 28,
      "Total": 38282
    }
  ];

  var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = "Days";
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.title.text = "[bold]Days"

  // Traffic data
  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.tooltip.disabled = true;
  valueAxis.title.text = "[bold]Number of Unique requests";

  var series = chart.series.push(new am4charts.LineSeries());
  series.yAxis = valueAxis;
  series.dataFields.categoryX = "Days";
  series.dataFields.valueY = "Total";
  series.tooltipText = "Requests: [bold]{valueY}[/]";
  series.fillOpacity = 0.3;
  series.name = "Incurred traffic"


  // bandwith saved data
  var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis2.renderer.opposite = true;
  valueAxis2.syncWithAxis = valueAxis;
  valueAxis2.tooltip.disabled = true;
  valueAxis2.renderer.ticks.template.disabled = true;
  valueAxis2.renderer.axisFills.template.disabled = true; 
  valueAxis2.title.text = "[bold]Bandwidth saved";

  var series2 = chart.series.push(new am4charts.ColumnSeries());
  series2.yAxis = valueAxis2
  series2.dataFields.categoryX = "Days";
  series2.dataFields.valueY = "Bandwidth saved";
  series2.tooltipText = "Bandwidth saved: [bold]{valueY.value} GB";
  series2.sequencedInterpolation = true;
  series2.fillOpacity = 0;
  series2.strokeOpacity = 1;
  series2.strokeDashArray = "1,3";
  series2.columns.template.width = 0.01;
  series2.tooltip.pointerOrientation = "horizontal";
  series2.name = "Bandwidth saved";
  
  var bullet = series2.bullets.create(am4charts.CircleBullet);
  
  chart.cursor = new am4charts.XYCursor();
  chart.cursor.lineY.opacity = 0;
  chart.scrollbarX = new am4charts.XYChartScrollbar();
  chart.scrollbarX.series.push(series);
  
  
  categoryAxis.start = 0;
  categoryAxis.keepSelection = true;
  
  
}); // end am4core.ready()




// bar chart --> The Miss and Hits chart
am4core.ready(function() {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end
  
  
  
  
  var chart = am4core.create('miss_hits_div', am4charts.XYChart)
  chart.colors.step = 2;
  
  chart.legend = new am4charts.Legend()
  chart.legend.position = 'bottom'
  chart.legend.paddingBottom = 20
  chart.legend.labels.template.maxWidth = 95
  
  var xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
  xAxis.dataFields.category = 'Days'
  xAxis.renderer.cellStartLocation = 0.1
  xAxis.renderer.cellEndLocation = 0.9
  xAxis.renderer.grid.template.location = 0;
  xAxis.title.text = "[bold]Days"
  
  var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
  yAxis.min = 0;
  yAxis.max = 100;
  yAxis.strictMinMax = true;
  yAxis.calculateTotals = true;
  yAxis.renderer.minWidth = 50;
  yAxis.title.text = "[bold]Percentage Requests"
  
  
  function createSeries(value, name) {
      var series = chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.valueY = value
      series.dataFields.categoryX = 'Days'
      series.name = name
      series.columns.template.tooltipText = "Day {categoryX}: [bold]{valueY.totalPercent}% {name}";
      series.dataFields.valueYShow = "totalPercent";

      series.events.on("hidden", arrangeColumns);
      series.events.on("shown", arrangeColumns);
  
      // I don't want labeling within the chart
    
      // var bullet = series.bullets.push(new am4charts.LabelBullet())
      // bullet.interactionsEnabled = false
      // bullet.dy = 30;
      // bullet.label.text = '{valueY}'
      // bullet.label.fill = am4core.color('#ffffff')
  
      return series;
  }
  
  chart.data = [
    {
      "Days": 1,
      "Misses": 6878,
      "Hits": 22063,
      "Bypasses": 0,
      "Expired": 0,
      "Updating": 0,
      "Revalidated": 0,
      "Stale": 0
    },
    {
      "Days": 2,
      "Misses": 8199,
      "Hits": 52770,
      "Bypasses": 0,
      "Expired": 73,
      "Updating": 9,
      "Revalidated": 3055,
      "Stale": 7
    },
    {
      "Days": 3,
      "Misses": 4641,
      "Hits": 20119,
      "Bypasses": 0,
      "Expired": 62,
      "Updating": 10,
      "Revalidated": 2426,
      "Stale": 0
    },
    {
      "Days": 4,
      "Misses": 3916,
      "Hits": 16007,
      "Bypasses": 0,
      "Expired": 51,
      "Updating": 15,
      "Revalidated": 2364,
      "Stale": 0
    },
    {
      "Days": 5,
      "Misses": 8269,
      "Hits": 47858,
      "Bypasses": 0,
      "Expired": 37,
      "Updating": 21,
      "Revalidated": 2844,
      "Stale": 11
    },
    {
      "Days": 6,
      "Misses": 12404,
      "Hits": 71789,
      "Bypasses": 0,
      "Expired": 86,
      "Updating": 22,
      "Revalidated": 4266,
      "Stale": 28
    },
    {
      "Days": 7,
      "Misses": 8348,
      "Hits": 52404,
      "Bypasses": 0,
      "Expired": 138,
      "Updating": 5,
      "Revalidated": 2475,
      "Stale": 3
    },
    {
      "Days": 8,
      "Misses": 12522,
      "Hits": 91707,
      "Bypasses": 0,
      "Expired": 208,
      "Updating": 7,
      "Revalidated": 5778,
      "Stale": 6
    },
    {
      "Days": 9,
      "Misses": 4870,
      "Hits": 61544,
      "Bypasses": 0,
      "Expired": 128,
      "Updating": 9,
      "Revalidated": 4962,
      "Stale": 1
    },
    {
      "Days": 10,
      "Misses": 5065,
      "Hits": 25190,
      "Bypasses": 0,
      "Expired": 63,
      "Updating": 13,
      "Revalidated": 3326,
      "Stale": 0
    },
    {
      "Days": 11,
      "Misses": 3002,
      "Hits": 16495,
      "Bypasses": 0,
      "Expired": 55,
      "Updating": 15,
      "Revalidated": 2890,
      "Stale": 0
    },
    {
      "Days": 12,
      "Misses": 9416,
      "Hits": 76297,
      "Bypasses": 0,
      "Expired": 16,
      "Updating": 10,
      "Revalidated": 3154,
      "Stale": 4
    },
    {
      "Days": 13,
      "Misses": 5944,
      "Hits": 61445,
      "Bypasses": 0,
      "Expired": 6,
      "Updating": 0,
      "Revalidated": 289,
      "Stale": 0
    },
    {
      "Days": 14,
      "Misses": 8249,
      "Hits": 36461,
      "Bypasses": 0,
      "Expired": 7,
      "Updating": 0,
      "Revalidated": 131,
      "Stale": 0
    },
    {
      "Days": 15,
      "Misses": 4073,
      "Hits": 20532,
      "Bypasses": 0,
      "Expired": 1,
      "Updating": 0,
      "Revalidated": 0,
      "Stale": 0
    },
    {
      "Days": 16,
      "Misses": 4070,
      "Hits": 20431,
      "Bypasses": 0,
      "Expired": 1,
      "Updating": 0,
      "Revalidated": 0,
      "Stale": 0
    },
    {
      "Days": 17,
      "Misses": 3995,
      "Hits": 20545,
      "Bypasses": 0,
      "Expired": 2,
      "Updating": 0,
      "Revalidated": 0,
      "Stale": 0
    },
    {
      "Days": 18,
      "Misses": 4121,
      "Hits": 19984,
      "Bypasses": 0,
      "Expired": 1,
      "Updating": 0,
      "Revalidated": 0,
      "Stale": 0
    },
    {
      "Days": 19,
      "Misses": 4105,
      "Hits": 21170,
      "Bypasses": 0,
      "Expired": 1,
      "Updating": 0,
      "Revalidated": 0,
      "Stale": 0
    },
    {
      "Days": 20,
      "Misses": 6972,
      "Hits": 32188,
      "Bypasses": 0,
      "Expired": 19,
      "Updating": 0,
      "Revalidated": 53,
      "Stale": 0
    },
    {
      "Days": 21,
      "Misses": 5692,
      "Hits": 23745,
      "Bypasses": 0,
      "Expired": 119,
      "Updating": 7,
      "Revalidated": 314,
      "Stale": 1
    },
    {
      "Days": 22,
      "Misses": 4781,
      "Hits": 22223,
      "Bypasses": 0,
      "Expired": 208,
      "Updating": 19,
      "Revalidated": 658,
      "Stale": 2
    },
    {
      "Days": 23,
      "Misses": 3064,
      "Hits": 12007,
      "Bypasses": 0,
      "Expired": 125,
      "Updating": 24,
      "Revalidated": 430,
      "Stale": 1
    },
    {
      "Days": 24,
      "Misses": 3037,
      "Hits": 12172,
      "Bypasses": 0,
      "Expired": 137,
      "Updating": 15,
      "Revalidated": 806,
      "Stale": 0
    },
    {
      "Days": 25,
      "Misses": 5219,
      "Hits": 22814,
      "Bypasses": 0,
      "Expired": 161,
      "Updating": 29,
      "Revalidated": 855,
      "Stale": 1
    },
    {
      "Days": 26,
      "Misses": 5177,
      "Hits": 15583,
      "Bypasses": 0,
      "Expired": 152,
      "Updating": 16,
      "Revalidated": 750,
      "Stale": 3
    },
    {
      "Days": 27,
      "Misses": 7072,
      "Hits": 42062,
      "Bypasses": 0,
      "Expired": 58,
      "Updating": 9,
      "Revalidated": 708,
      "Stale": 0
    },
    {
      "Days": 28,
      "Misses": 10608,
      "Hits": 63093,
      "Bypasses": 0,
      "Expired": 113,
      "Updating": 7,
      "Revalidated": 1651,
      "Stale": 0
    },
    {
      "Days": 29,
      "Misses": 8019,
      "Hits": 45880,
      "Bypasses": 0,
      "Expired": 172,
      "Updating": 34,
      "Revalidated": 5187,
      "Stale": 0
    },
    {
      "Days": 30,
      "Misses": 5346,
      "Hits": 30586,
      "Bypasses": 0,
      "Expired": 95,
      "Updating": 32,
      "Revalidated": 2223,
      "Stale": 0
    }
   ];
  
  
  
  createSeries('Misses', 'Misses');
  createSeries('Hits', 'Hits');
  createSeries('Bypasses', 'Bypasses');
  createSeries('Expired', 'Expired');
  createSeries('Updating', 'Updating');
  createSeries('Revalidated', 'Revalidated');
  createSeries('Stale', 'Stale');
  
  function arrangeColumns() {
  
      var series = chart.series.getIndex(0);
  
      var w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
      if (series.dataItems.length > 1) {
          var x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
          var x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
          var delta = ((x1 - x0) / chart.series.length) * w;
          if (am4core.isNumber(delta)) {
              var middle = chart.series.length / 2;
  
              var newIndex = 0;
              chart.series.each(function(series) {
                  if (!series.isHidden && !series.isHiding) {
                      series.dummyData = newIndex;
                      newIndex++;
                  }
                  else {
                      series.dummyData = chart.series.indexOf(series);
                  }
              })
              var visibleCount = newIndex;
              var newMiddle = visibleCount / 2;
  
              chart.series.each(function(series) {
                  var trueIndex = chart.series.indexOf(series);
                  var newIndex = series.dummyData;
  
                  var dx = (newIndex - trueIndex + middle - newMiddle) * delta
  
                  series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                  series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
              })
          }
      }
  }
  chart.scrollbarX = new am4core.Scrollbar();
  
  }); // end am4core.ready()
