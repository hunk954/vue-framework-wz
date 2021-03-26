<template>
    <div class="animated fadeIn" style="background:#eee; padding:20px;">
        <Row :gutter="16">
            <Col span="6">
                <Card :bordered="false">
                    <p slot="title">实验参数设置</p>
                    <p>扩缩容算法类型</p>
                    <el-select v-model="algorithmValue" placeholder="请选择扩缩容算法" size="small" filterable clearable :disabled="buttonDisabled">
                        <el-option
                                v-for="item in algorithmList"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label">
                        </el-option>
                    </el-select>
                    <div style="margin:20px;"></div>
                    <p>流量类型</p>
                    <el-select v-model="waveValue" placeholder="请选择流量类型" size="small" filterable clearable :disabled="buttonDisabled">
                        <el-option
                                v-for="item in waveList"
                                :key="item.value"
                                :value="item.value"
                                :label="item.label">
                        </el-option>
                    </el-select>
                    <div style="margin:20px;"></div>
                    <el-button type="primary" icon="el-icon-thumb" size="small" @click="startExperiment" :disabled="startButtonDisabled">开始实验</el-button>
                    <!-- <p>Content of no border type. Content of no border type. Content of no border type. Content of no border type. </p> -->
                </Card>
            </Col>
            
            <!-- <div style="margin:10px;"></div> -->
            <Col span="18">
                <Card :bordered="false">
                    <p slot="title">实验进程展示</p>
                    <el-steps :active="exprCurrStep" finish-status="success">
                        <el-step v-for="stepInfo in stepInfoList" :icon="stepInfo.icon" :status="stepInfo.status">
                            <template slot="title">
                                <span style="font-size:14px;">{{stepInfo.title}}</span>
                            </template>
                            <template slot="description">
                                <span style="font-size:5px;">{{stepInfo.desc}}</span>
                                <p style="font-size:5px;color:blue;" v-if="stepInfo.needTimeDesc">{{stepInfo.timeDesc + stepInfo.time}}</p>
                            </template>
                        </el-step>
                    </el-steps>
                    <br>
                    <el-button type="warning" icon="el-icon-thumb" size="small" @click="forceStopFunc">强制终止</el-button>
                
            
                </Card>
            </Col>
        </Row>
        <br>
        <!-- <Col span="1"><div style="margin:5px;"></div></Col> -->
        <Row>
            <Card :bordered="false">
            <p slot="title">当前实验一级指标展示</p>
            <div v-if="experimentInProcess">
                <iframe src="http://172.16.33.50:30000/d/rmdIER8Gk/cproductpage?orgId=1&from=1616675574281&to=1616675874281&refresh=5s&theme=dark" style="width:100%;height:600px"></iframe>
            </div>
            <div v-else>
            <p>暂无实验进行中</p>
             </div>
            </Card>
        </Row>
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
                forceStop: false,
                algorithmIdx: 1,
                waveIdx: 2,
                secondStateIdx: 3,
                commonEndIdx: 4,
                exceptionIdx: 5,
                stepInfoList:[  
                    {title:"等待开始", icon:"", desc:"等待实验开始中，选择流量与算法类型后点击开始实验即可触发", status:"", needTimeDesc:false, timeDesc:"", time:""},
                    {title:"启动扩缩容调度算法", icon:"", desc:"在流量波形发送前，首先启用扩缩容调度算法的实例以监听服务状态", status:"", needTimeDesc:false, timeDesc:"", time:""},
                    {title:"发送流量波形", icon:"", desc:"发送流量波形到预设的实验负载中，该过程可能会持续1小时", status:"", needTimeDesc:false, timeDesc:"已耗时：", time:""},
                    {title:"计算二级指标", icon:"", desc:"实验过程中收集的一级指标在实验结束后，计算基于一段时间流量的二级指标", status:"", needTimeDesc:false, timeDesc:"", time:""},
                    {title:"实验结束", icon:"", desc:"单次实验完成", status:""},
                ],
                startButtonDisabled: false,
                exprCurrStep: 0,
                experimentInProcess: false,
                buttonDisabled: false,
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
                        label: 'Threshold_scale'
                    },
                    {
                        value: 1,
                        label: 'Q-learning_scale'
                    },
                    // {
                    //     value: 2,
                    //     label: 'Armia-Predict_scale'
                    // }
                ],
                waveValue: 0,
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
        },
        methods:{
            async forceStopFunc(){
                this.forceStop = true;
                this.buttonDisabled = false;
                this.startButtonDisabled = false;
                await this.$store.dispatch("forceStopFunc");
            },
            resetExperStepInfo(){
                for(let i = 0; i < this.stepInfoList.length; i++){
                    this.stepInfoList[i].icon = "";
                    this.stepInfoList[i].status = "process";
                }
                this.exprCurrStep = 0; // 步骤状态设置为0
                this.forceStop = false; // 取消强制停止态
                this.stepInfoList[this.waveIdx].needTimeDesc = false; // 将时间展示去掉
            },
            failStep(index){
                this.changeIconStatus(index, "error", "");
            },
            reachStep(index){
                for(let i = 0; i < index; i++){
                    this.changeIconStatus(i, "success", "");
                }
                // 成功index步骤，并使下一个步骤成为等待态
                this.changeIconStatus(index);
                this.exprCurrStep = index;
            },
            changeIconStatus(index, status="process", icon="el-icon-loading"){
                // this.exprCurrStep = index;
                if(index >= this.stepInfoList.length){
                    return;
                }
                this.stepInfoList[index].status = status;
                this.stepInfoList[index].icon = icon;
            },
            processTimeDisplay(timeTmp){
                 if(timeTmp < 60){
                    this.stepInfoList[this.waveIdx].time = Math.floor(timeTmp) + "秒" + ((timeTmp - Math.floor(timeTmp))*100).toPrecision(2);
                }else if(timeTmp < 60*60){
                    timeTmp = Math.floor(timeTmp);
                    this.stepInfoList[this.waveIdx].time = Math.floor(timeTmp/60) + "分" + Math.floor(timeTmp%60) + "秒";
                }else{
                    timeTmp = Math.floor(timeTmp);
                    this.stepInfoList[this.waveIdx].time = Math.floor(timeTmp/3600) + "时" + Math.floor(timeTmp%3600/60) + "分" +  Math.floor(timeTmp%3600%60) + "秒";
                }
            },
            async doExperiment(start=0){

                this.buttonDisabled = true;
                let resp
                while(true){
                    // 如果强制停止就直接停止
                    if(this.forceStop){
                        this.failStep(this.exprCurrStep);
                        break;
                    }
                    // 获取状态
                    resp = await this.$store.dispatch('getCurrExperStatus',this.$store.getters.name);
                    
                    // status为0表示网络是通的
                    if(resp.data.status == 0){
                        if(resp.data.data >= this.exceptionIdx){
                            // 如果传来的状态大于ExceptionIdx就是异常了
                            this.failStep(this.exprCurrStep);
                            break;
                        }
                        else{
                            // 否则的话就是当前在resp.data.data状态
                            if(resp.data.data != this.exprCurrStep){
                                start = (new Date()).valueOf();
                            }
                            this.reachStep(resp.data.data);
                            
                            // 如果是在流量发送态，展现流程图
                            if(resp.data.data == this.waveIdx){
                                this.stepInfoList[this.waveIdx].needTimeDesc = true;
                                let timeTmp = ((new Date()).valueOf() - start)/1000;
                                this.processTimeDisplay(timeTmp);
                                this.experimentInProcess = true;
                            }
                            // 如果是在结束状态需要break
                            if(resp.data.data == this.commonEndIdx){
                                this.reachStep(resp.data.data+1);
                                break;
                            }
                            // 其他状态就等待一秒
                            resp = await this.$store.dispatch("sleepBackEnd", 1);
                            if(resp.data.status != 0){
                                break;
                            }
                        }
                    }else{
                        break;
                    }
                }
                this.startButtonDisabled = false;
                this.buttonDisabled = false;
            },
            async startExperiment(){
                // 重置实验步骤信息
                this.resetExperStepInfo();
                
                // 检验参数是否正确
                if(this.algorithmValue === ""){
                    this.$message({
                        type: "error",
                        message: "未选择算法类型"
                    })
                    return;
                }
                if(this.waveValue === ""){
                    this.$message({
                        type: "error",
                        message: "未选择流量类型"
                    })
                    return;
                }
                // 置开始实验为禁用
                this.startButtonDisabled = true;
                this.buttonDisabled = true;
                // 开启实验进程
                let that = this;
                let resp = await this.$store.dispatch('startExperiment', {algorithm: this.algorithmValue, wave: this.waveValue});
                if(resp.data.status !== 0){
                    console.log("start failed!", resp)
                    this.failStep(this.exprCurrStep);
                    return;
                }
                let start = 0;
                this.doExperiment();
                
                
            },
            async recoverExperiment(algo, wave, status, time){
                this.startButtonDisabled = true;
                this.algorithmValue = algo;
                this.waveValue = wave;
                this.reachStep(status);
                if(status >= this.waveIdx){
                    if(status == this.waveIdx){
                        this.experimentInProcess = true;
                    }
                    this.stepInfoList[this.waveIdx].needTimeDesc = true;
                    let timeTmp = ((new Date()).valueOf()/1000 - time);
                    this.processTimeDisplay(timeTmp);
                }
                await this.doExperiment(time*1000);
            }
        },
        created: async function(){
            // 获取当前用户的实验ID
            let resp = await this.$store.dispatch('getCurrExperStatus',this.$store.getters.name);
            if(resp.data.data < this.commonEndIdx){
                resp = await this.$store.dispatch('getCurrExperData');
                console.log("resp:::::", resp);
                if(resp.data.status === 0 && resp.data.experStatus > 0 && resp.data.experStatus <= this.commonEndIdx){
                    this.recoverExperiment(resp.data.algo, resp.data.wave, resp.data.experStatus, resp.data.lastUpdateTime);
                }
            }
            
        }
    }
</script>
