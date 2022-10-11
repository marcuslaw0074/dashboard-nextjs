export default DefaultChartOption = {
  title: {
    text: "TEST",
    show: true,
    link: "http://localhost:9000/docs",
    target: "blank", // {"self": "opening it in current tab", "blank": "opening it in a new tab"}
    textStyle: {
      color: "#000000",
      fontStyle: "normal", // 'normal', 'italic', 'oblique'
      fontWeight: "bold", // 'normal', 'bold', 'bolder', 'lighter'
      fontFamily: "serif", // 'sans-serif'
      fontSize: 18,
      lineHeight: 56,
      width: 10,
      height: 10,
      textBorderColor: "#000000",
      textBorderWidth: 1,
      textBorderType: "solid", //'solid', 'dashed', 'dotted'
    },
    subtext: "",
    sublink: "http://localhost:9000/docs",
    subtarget: "blank", // {"self": "opening it in current tab", "blank": "opening it in a new tab"}
    subtextStyle: {
      color: "#fff000",
    },
    textAlign: "auto", // 'auto', 'left', 'right', 'center'
    textVerticalAlign: "auto", // 'auto', 'top', 'bottom', 'middle'
    triggerEvent: true,
    padding: [
      5, // up
      10, // right
      5, // down
      10, // left
    ],
    itemGap: 10, // The gap between the main title and subtitle.
    zlevel: 999,
    left: "center", // "auto", "center"
    top: "auto",
    right: "auto",
    bottom: "auto",
    backgroundColor: "transparent", // "transparent"
    borderColor: "transparent",
    borderWidth: 1,
    borderRadius: 5,
  },
  legend: {
    type: "scroll", // "plain" ,"scroll"
    show: true,
    zlevel: 999,
    left: "center", // 'left', 'center', or 'right'
    top: "bottom", // 'top', 'middle', or 'bottom'
    right: "auto",
    bottom: "auto",
    width: "auto",
    height: "auto",
    orient: "horizontal", // "horizontal", "vertical"
    align: "auto", // "auto", 'left' or 'right'
    padding: [
      5, // up
      10, // right
      5, // down
      10, // left
    ],
    itemGap: 10,
    itemWidth: 25,
    itemHeight: 14,
    itemStyle: {
      color: "#000000",
      borderColor: "#000000",
      borderType: "solid", // 'solid', 'dashed', 'dotted'
    },
    symbolRotate: 100,
    lineStyle: {
      color: "#000000",
      width: "auto",
      type: "solid", // 'solid', 'dashed', 'dotted'
    },
    formatter: function (name) {
      return "L " + name;
    },
    textStyle: {
      color: "#333",
      fontStyle: "italic",
      fontWeight: "normal",
      fontFamily: "sans-serif",
      fontSize: 12,
      lineHeight: 0,
      backgroundColor: {
        image: "xxx/xxx.png",
      },
      backgroundColor: "rgba(0,23,11,0.3)",
      borderWidth: 0,
      borderColor: "rgba(0,23,11,0.3)",
      borderType: "solid", // 'solid', 'dashed', 'dotted'
    },
    tooltip: {},
    icon: "circle", // 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
    data: [
      {
        name: "Email",
        icon: "circle",
        itemStyle: {
          color: "#000000",
          borderColor: "#000000",
          borderType: "solid", // 'solid', 'dashed', 'dotted'
        },
        lineStyle: {
          color: "#000000",
          width: "auto",
          type: "solid", // 'solid', 'dashed', 'dotted'
        },
        textStyle: {
          color: "red",
        },
      },
      {
        name: "Union Ads",
        icon: "circle",
        itemStyle: {
          color: "#000000",
          borderColor: "#000000",
          borderType: "solid", // 'solid', 'dashed', 'dotted'
        },
        lineStyle: {
          color: "#000000",
          width: "auto",
          type: "solid", // 'solid', 'dashed', 'dotted'
        },
        textStyle: {
          color: "red",
        },
      },
      {
        name: "Video Ads",
        icon: "circle",
        itemStyle: {
          color: "#000000",
          borderColor: "#000000",
          borderType: "solid", // 'solid', 'dashed', 'dotted'
        },
        lineStyle: {
          color: "#000000",
          width: "auto",
          type: "solid", // 'solid', 'dashed', 'dotted'
        },
        textStyle: {
          color: "red",
        },
      },
      {
        name: "Direct",
        icon: "circle",
        itemStyle: {
          color: "#000000",
          borderColor: "#000000",
          borderType: "solid", // 'solid', 'dashed', 'dotted'
        },
        lineStyle: {
          color: "#000000",
          width: "auto",
          type: "solid", // 'solid', 'dashed', 'dotted'
        },
        textStyle: {
          color: "red",
        },
      },
      {
        name: "Search Engine",
        icon: "circle",
        itemStyle: {
          color: "#000000",
          borderColor: "#000000",
          borderType: "solid", // 'solid', 'dashed', 'dotted'
        },
        lineStyle: {
          color: "#000000",
          width: "auto",
          type: "solid", // 'solid', 'dashed', 'dotted'
        },
        textStyle: {
          color: "red",
        },
      },
    ],
    backgroundColor: "rgba(128, 128, 128, 0.5)",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 0,
    selector: false,
    emphasis: {
      selectorLabel: {
        show: true,
        distance: 5,
        rotate: 90,
        color: "color",
      },
    },
  },
  grid: {
    show: true,
    zlevel: 999,
    left: "3%",
    right: "4%",
    bottom: "3%",
    width: "auto",
    height: "auto",
    backgroundColor: "transparent",
    borderColor: "#ccc",
    borderWidth: 1,
    containLabel: true,
    tooltip: {
      show: true,
      trigger: "axis",
      axisPointer: {
        type: "line",
        axis: "auto",
      },
    },
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985",
      },
    },
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    show: true,
    gridIndex: 0,
    alignTicks: false,
    position: "bottom", // 'top', 'bottom'
    type: "category",
    offset: 0,
    name: "haha",
    nameLocation: "end", // 'start', 'middle' or 'center', 'end'
    boundaryGap: false,
    splitNumber: 5,
    scale: false,
    data: [],
  },
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    {
      name: "Email",
      type: "line",
      stack: "Total",
      areaStyle: {},
      emphasis: {
        focus: "series",
      },
      data: [],
    },
  ],
  color: [
    "#5470c6",
    "#91cc75",
    "#fac858",
    "#ee6666",
    "#73c0de",
    "#3ba272",
    "#fc8452",
    "#9a60b4",
    "#ea7ccc",
  ],
  backgroundColor: "rgba(255,255,255,1)",
};
