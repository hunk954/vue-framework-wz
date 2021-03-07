<template>
    <div class="animated fadeIn" style="background:#eee; padding:20px;">
        <Col span="6">
            <Row>
                <Card :bordered="false">
                    <p slot="title">实验参数设置</p>
                    <p>扩缩容算法类型</p>
                    <el-select v-model="algorithmValue" placeholder="请选择扩缩容算法" size="small" filterable clearable>
                        <el-option
                                v-for="item in algorithmList"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label">
                        </el-option>
                    </el-select>
                    <div style="margin:20px;"></div>
                    <p>流量类型</p>
                    <el-select v-model="waveValue" placeholder="请选择流量类型" size="small" filterable clearable>
                        <el-option
                                v-for="item in waveList"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label">
                        </el-option>
                    </el-select>
                    <div style="margin:20px;"></div>
                    <el-button type="primary" icon="el-icon-thumb" size="small">开始实验</el-button>
                    <!-- <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p> -->
                </Card>
                <!-- <h3>选择流量类型</h3>
                <h3>选择扩缩容算法类型</h3> -->
            </Row>
            <div style="margin:20px;"></div>
            <Row>
                <Card :bordered="false">
                    <p slot="title">实验进程展示</p>
                    <Steps :current="0" direction="vertical">
                        <Step title="等待开始" content="等待实验开始中，选择流量与算法类型后点击开始实验即可触发"></Step>
                        <Step title="启动扩缩容调度算法" content="在流量波形发送前，首先启用扩缩容调度算法的实例以监听服务状态"></Step>
                        <Step title="发送流量波形" content="发送流量波形到预设的实验负载中，该过程可能会持续1小时"></Step>
                        <Step title="计算二级指标" content="实验过程中收集的一级指标在实验结束后，计算基于一段时间流量的二级指标"></Step>
                        <Step title="实验结束" content="单次实验完成"></Step>
                    </Steps>
                    <el-button type="warning" icon="el-icon-thumb" size="small">强制终止</el-button>
                </Card>
            </Row>
        </Col>
        <Col span="1"><div style="margin:5px;"></div></Col>
        <Col span="16">
            <Card :bordered="false">
                <p slot="title">当前实验一级指标展示</p>
                <Row>
                    <Col span="12">
                        <chart :options="option" style="height:400px; width:95%; border-radius: 25px;"></chart>
                    </Col>
                    <Col span="12">
                        <chart :options="option" style="height:400px; width:95%; border-radius: 25px;"></chart>
                    </Col>
                </Row>
                <div style="margin:20px;"></div>
                <Row>
                    <Col span="12">
                        <chart :options="option" style="height:400px; width:95%; border-radius: 25px;"></chart>
                    </Col>
                    <Col span="12">
                        <chart :options="option" style="height:400px; width:95%; border-radius: 25px;"></chart>
                    </Col>
                </Row>

            </Card>
        </Col>
    </div>
</template>

<style scoped>
    .echarts {
        height: 700px;
        width: 100%;
        border-radius: 25px;
    }

</style>
<script>
    var xData = function() {
        var data = [];
        for (var i = 1; i < 13; i++) {
            data.push(i + "月份");
        }
        return data;
    }();

    export default{
        data(){
            return{
                option : {
                    backgroundColor: "#344b58",
                    "title": {
                        "text": "CPU占用率",
                        x: "4%",
                        y: "4%",
                        textStyle: {
                            color: '#fff',
                            fontSize: '22',
                        },
                        subtextStyle: {
                            color: '#90979c',
                            fontSize: '16',

                        },
                    },
                    "tooltip": {
                        "trigger": "axis",
                        "axisPointer": {
                            "type": "shadow",
                            textStyle: {
                                color: "#fff"
                            }

                        },
                    },
                    "grid": {
                        "show": true,
                        "borderWidth": 1,
                        "top": 110,
                        "bottom": 95,
                        textStyle: {
                            color: "#fff"
                        }
                    },
                    "legend": {
                        x: '4%',
                        top: '11%',
                        textStyle: {
                            color: '#90979c',
                        }
                        // "data": ['女', '男', '平均']
                    },


                    "calculable": true,
                    "xAxis": [{
                        "type": "category",
                        "axisLine": {
                            lineStyle: {
                                color: '#90979c'
                            }
                        },
                        "splitLine": {
                            "show": false
                        },
                        "axisTick": {
                            "show": true
                        },
                        "splitArea": {
                            "show": false
                        },
                        "axisLabel": {
                            "interval": 0,

                        },
                        "data": xData,
                    }],
                    "yAxis": [{
                        "type": "value",
                        "splitLine": {
                            "show": false
                        },
                        "axisLine": {
                            lineStyle: {
                                color: '#90979c'
                            }
                        },
                        "axisTick": {
                            "show": false
                        },
                        "axisLabel": {
                            "interval": 0,

                        },
                        "splitArea": {
                            "show": false
                        },

                    }],
                    "dataZoom": [{
                        "show": true,
                        "height": 40,
                        "xAxisIndex": [
                            0
                        ],
                        bottom: 30,
                        "start": 10,
                        "end": 80,
                        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                        handleSize: '80%', // 两边的小格
                        handleStyle:{
                            color:"#d3dee5",

                        },
                        textStyle:{
                            color:"#fff"},
                        borderColor:"#90979c"


                    }, {
                        "type": "inside",
                        "show": true,
                        "height": 15,
                        "start": 1,
                        "end": 35
                    }],
                    "series": [{
                        "name": "女",
                        "type": "bar",
                        "stack": "总量",
                        "barMaxWidth": 50,
                        "barGap": "10%",
                        "itemStyle": {
                            "normal": {
                                "color": "rgba(255,144,128,1)",
                                "label": {
                                    "show": true,
                                    "textStyle": {
                                        "color": "#fff"
                                    },
                                    "position": "insideTop",
                                    formatter: function(p) {
                                        return p.value > 0 ? (p.value) : '';
                                    }
                                }
                            }
                        },
                        "data": [
                            709,
                            1917,
                            2455,
                            2610,
                            1719,
                            1433,
                            1544,
                            3285,
                            5208,
                            3372,
                            2484,
                            4078
                        ],
                    },

                        {
                            "name": "男",
                            "type": "bar",
                            "stack": "总量",
                            "itemStyle": {
                                "normal": {
                                    "color": "rgba(0,191,183,1)",
                                    "barBorderRadius": 0,
                                    "label": {
                                        "show": true,
                                        "position": "top",
                                        formatter: function(p) {
                                            return p.value > 0 ? (p.value) : '';
                                        }
                                    }
                                }
                            },
                            "data": [
                                327,
                                1776,
                                507,
                                1200,
                                800,
                                482,
                                204,
                                1390,
                                1001,
                                951,
                                381,
                                220
                            ]
                        }, {
                            "name": "总数",
                            "type": "line",
                            "stack": "总量",
                            symbolSize:10,
                            symbol:'circle',
                            "itemStyle": {
                                "normal": {
                                    "color": "rgba(252,230,48,1)",
                                    "barBorderRadius": 0,
                                    "label": {
                                        "show": true,
                                        "position": "top",
                                        formatter: function(p) {
                                            return p.value > 0 ? (p.value) : '';
                                        }
                                    }
                                }
                            },
                            "data": [
                                1036,
                                3693,
                                2962,
                                3810,
                                2519,
                                1915,
                                1748,
                                4675,
                                6209,
                                4323,
                                2865,
                                4298
                            ]
                        },
                    ]
                },
                algorithmValue: 0,
                algorithmList:[
                    {
                        value: 0,
                        label: 'static_scale'
                    },
                    {
                        value: 1,
                        label: 'Q-learning_scale'
                    },
                    {
                        value: 2,
                        label: 'Armia-Predict_scale'
                    }
                ],
                waveValue: null,
                waveList:[
                    {
                        value: 0,
                        label: '突增型流量波形'
                    },
                    {
                        value: 1,
                        label: '递减型流量波形'
                    },
                    {
                        value: 2,
                        label: '平滑型流量波形'
                    },
                    {
                        value: 3,
                        label: '递增型流量波形'
                    },
                    {
                        value: 4,
                        label: '周期性变化流量波形'
                    },
                    {
                        value: 5,
                        label: '正弦变化流量波形'
                    },
                ]
            }
        }
    }
</script>
