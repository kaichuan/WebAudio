var aCtx = new webkitAudioContext();
var analyser
var microphone
var filter
var recorder
var fftSize = 2048
var no_of_bin_to_watch = 90
var binsize = 44000/fftSize

var startBin = Math.round(20000/binsize);

var STD_FFTData
var monitor;
var audioStream;
//for (var i=startBin;i<startBin+no_of_bin_to_watch;i++) {
//    $("#spectrum").append('<th width="5%">'+i*binsize+'</th>')
//}

$("#SoloDecodeToggle").click(function(){
    if ($("#SoloDecodeToggle")[0].innerHTML == "Stop"){
        $("#SoloDecodeToggle")[0].innerHTML = "Start"
        clearInterval(monitor);
        microphone.disconnect()
        analyser.disconnect();
        audioStream.stop();
    } else
        navigator.webkitGetUserMedia({audio: true}, function(stream) {
            audioStream = stream;
            $("#SoloDecodeToggle")[0].innerHTML = "Calibrating"
            $("#SoloDecodeToggle")[0].disabled = true
            aCtx = new webkitAudioContext();
            analyser = aCtx.createAnalyser();
            analyser.fftSize = fftSize;
            analyser.smoothingTimeConstant = 0.9
            analyser.minDecibels = $("#minDecibel")[0].value;
            analyser.maxDecibels = $("#maxDecibel")[0].value;
            microphone = aCtx.createMediaStreamSource(stream);
            microphone.connect(analyser);
            calibrate(1);
        });



})
function calibrate(time){
    var calibrater = setInterval(function(){
        STD_FFTData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(STD_FFTData);
    }, 50);

    setTimeout(function(){
        $("#SoloDecodeToggle")[0].innerHTML = "Stop"
        $("#SoloDecodeToggle")[0].disabled = false
        clearInterval(calibrater)
        analyser.smoothingTimeConstant = 0;
        var data;
        monitor = setInterval(function(){
            var max=0,index=0
            data = new Uint8Array(analyser.frequencyBinCount)
            analyser.getByteFrequencyData(data)
            for (var i=0; i<data.length;i++){
                if (data[i]-STD_FFTData[i] > max) {
                    max =  data[i]-STD_FFTData[i];
                    index = i;
                }
            }
            $("#DecodedFreq")[0].innerHTML = index*binsize;
            $("#DecodeBin")[0].innerHTML = index;
        },500)
    },time*1000)
}

$("#decodeBtn").click(function(){
    navigator.webkitGetUserMedia({audio: true}, function(stream) {
        audioStream = stream;
        analyser = aCtx.createAnalyser();
        analyser.fftSize = fftSize;
        analyser.smoothingTimeConstant = 0
        analyser.minDecibels = $("#minDecibel")[0].value;
        analyser.maxDecibels = $("#maxDecibel")[0].value;
        microphone = aCtx.createMediaStreamSource(stream);
        microphone.connect(analyser);
        decode();
    });

})

function decode(){
//    var freq = $("#freqRange1")[0].value*4/binsize;
//    var freq2 = Math.round($("#freqRange2")[0].value*4 /binsize);
    var freq = 952;
    var freq2 = 952
    console.log(freq2)
    var data = new Uint8Array(analyser.frequencyBinCount)
    console.log($("#time")[0].value)
    setInterval(function(){
        analyser.getByteFrequencyData(data)
        if ((data[freq2] > 0 )){
            console.log("1")
        }
        else
            console.log("0")
    }, $("#time")[0].value)


}



function decode2(){
//    var freq = $("#freqRange1")[0].value*4/binsize;
//    var freq2 = Math.round($("#freqRange2")[0].value*4 /binsize);
    var bins = [947,957,965,975]
    var data = new Uint8Array(analyser.frequencyBinCount)
    setInterval(function(){
        analyser.getByteFrequencyData(data)
        for (var i=0;i<4;i++){
            if (data[bins[i]] > 0)
                console.log(i + "1")

            else
                console.log(i + "0")
        }
    }, $("#time")[0].value)


}


$("#start").click(function(){
    navigator.webkitGetUserMedia({audio: true}, function(stream) {
        analyser = aCtx.createAnalyser();
        analyser.fftSize = fftSize;
        analyser.smoothingTimeConstant = 0
        analyser.minDecibels = -120
        analyser.maxDecibels = 0
        microphone = aCtx.createMediaStreamSource(stream);
//        filter = aCtx.createBiquadFilter()
//        filter.type = 2
//        filter.frequency = 21000
//        microphone.connect(filter)
//        filter.connect(analyser);
        microphone.connect(analyser);
        // analyser.connect(aCtx.destination);
//        console.log(analyser.frequencyBinCount);
        process();
    });
})


function process(){
    setInterval(function(){
        FFTData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(FFTData);
        $("#spectrum")[0].innerHTML = "";
        for (var i=startBin;i<startBin+no_of_bin_to_watch;i++){
            $("#spectrum").append("<tr><td>"+i*binsize+"</td><td>"+FFTData[i]+"</td><td>"+i+"</td></tr>")
        }
//        $("#freq")[0].innerHTML = FFTData[1];
//        console.log(FFTData[1]);
    },1000);
}
function process2(){
    var started = false;
    var begin = false;
    var time = 0;
    var FFTData = new Uint8Array(analyser.frequencyBinCount);
    var preData = new Uint8Array(binLocation.length);
    setInterval(function(){

        analyser.getByteFrequencyData(FFTData);
        for (var i=0;i<binLocation.length;i++){
            if (FFTData[binLocation[i]] - preData[i] > 30){
                console.log(binLocation[i])
                return
            }

        }
        for (var i=0;i<binLocation.length;i++){
            preData[i] =  FFTData[binLocation[i]]  ;
        }


//        if (FFTData[219] > 100){
//            console.log("started")
//            started = true
//            return;
//        }
//        if (FFTData[245] > 100 && started==true){
//            console.log("yes")
//            begin = true;
//            started=false
//            return
//        }
//        started=false

//        $("#freq")[0].innerHTML = FFTData[1];
//        console.log(FFTData[1]);
    },87.2);
}


var semitone      = 1.05946311
var baseFrequency = 1760
var beepLength    = 87.2

var characters = '0123456789abcdefghijklmnopqrstuv'

var freqCodes = {}
var frequencies = []
var binLocation = [82,
    87,
    92,
    97,
    103,
    109,
    116,
    123,
    130,
    138,
    146,
    155,
    164,
    174,
    184,
    195,
    206,
    219,
    232,
    245,
    260,
    276,
    292,
    309,
    328,
    347,
    368,
    390,
    413,
    437,
    463,
    491]

// Generate the frequencies that correspond to each code point.
for (var i=0; i<characters.length;i++) {
    var freq = +(baseFrequency * Math.pow(semitone, i))
    freqCodes[characters[i]] = freq
    frequencies[i] = freq
}
//for (var i=0;i<characters.length;i++){
//    console.log(frequencies[i]);
//}

$("#chirpBtn").click(function(){
    navigator.webkitGetUserMedia({audio: true}, function(stream) {
        analyser = aCtx.createAnalyser();
        analyser.fftSize = fftSize;
        analyser.smoothingTimeConstant = 0

        microphone = aCtx.createMediaStreamSource(stream);
        microphone.connect(analyser);
        // analyser.connect(aCtx.destination);
//        console.log(analyser.frequencyBinCount);
        process2();
    });





})

$("#rec").click(function(){
    navigator.webkitGetUserMedia({audio: true}, function(stream) {
        analyser = aCtx.createAnalyser();
        analyser.fftSize = fftSize;
        analyser.smoothingTimeConstant = 0
        analyser.minDecibels = -120
        analyser.maxDecibels = 0
        microphone = aCtx.createMediaStreamSource(stream);
        microphone.connect(analyser);
        decode2()
    });
})