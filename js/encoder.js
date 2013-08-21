$('.slider').slider()
// prepare AudioContext
var ctx = new webkitAudioContext()
var osc
var osc2
var gainNode
var is_start;


$("#soloGenToggle").click(function(){
    var currTime
    if (!is_start){
        osc = ctx.createOscillator()
        gainNode = ctx.createGainNode()
        osc.type = 0
        osc.frequency.value =  $("#freqRange")[0].value*4
        currTime = ctx.currentTime;
//        gainNode.gain.value = 1.0
        gainNode.gain.linearRampToValueAtTime(0, currTime);
        gainNode.gain.linearRampToValueAtTime(1, currTime + 0.5)
        osc.connect(gainNode)
        gainNode.connect(ctx.destination)
        osc.start(0)
        is_start = true
        $("#soloGenToggle")[0].className = "btn btn-danger"
        $("#soloGenToggle")[0].innerHTML = "Stop"
    } else {
        currTime = ctx.currentTime;
        gainNode.gain.linearRampToValueAtTime(1, currTime);
        gainNode.gain.linearRampToValueAtTime(0, currTime + 0.5)
        setTimeout(function(){
            gainNode.disconnect()
            osc.disconnect()
            osc.stop(0);
        },510)
        is_start =false;
        $("#soloGenToggle")[0].className = "btn btn-success"
        $("#soloGenToggle")[0].innerHTML = "Start"
    }
})
$("#BiGenToggle").click(function(){
    var currTime
    if (!is_start){
        osc = ctx.createOscillator()
        osc2 = ctx.createOscillator()

        gainNode = ctx.createGainNode()

        osc.type = 0
        osc.frequency.value =  $("#freqRange1")[0].value*4
        osc2.type = 0
        osc2.frequency.value =  $("#freqRange2")[0].value*4
        currTime = ctx.currentTime;
//        gainNode.gain.value = 1.0
        gainNode.gain.linearRampToValueAtTime(0, currTime);
        gainNode.gain.linearRampToValueAtTime(1, currTime + 0.5)
        osc.connect(gainNode)
        osc2.connect(gainNode)
        gainNode.connect(ctx.destination)
        osc.start(0)
        osc2.start(0)
        is_start = true
        $("#BiGenToggle")[0].className = "btn btn-danger"
        $("#BiGenToggle")[0].innerHTML = "Stop"
    } else {
        currTime = ctx.currentTime;
        gainNode.gain.linearRampToValueAtTime(1, currTime);
        gainNode.gain.linearRampToValueAtTime(0, currTime + 0.5)
        setTimeout(function(){
            gainNode.disconnect()
            osc.disconnect()
            osc2.disconnect()
            osc.stop(0);
            osc2.stop(0)
        },510)
        is_start =false;
        $("#BiGenToggle")[0].className = "btn btn-success"
        $("#BiGenToggle")[0].innerHTML = "Start"
    }
})

$("#freqRange").change(function(){
//    console.log($("#freqRange")[0].value);
    $("#freqLabel")[0].innerHTML = $("#freqRange")[0].value*4
    if (osc != undefined)
        osc.frequency.value =  $("#freqRange")[0].value*4
})
$("#freqRange1").change(function(){
//    console.log($("#freqRange")[0].value);
    $("#freqLabel1")[0].innerHTML = $("#freqRange1")[0].value*4
    if (osc != undefined)
        osc.frequency.value =  $("#freqRange1")[0].value*4
})
$("#freqRange2").change(function(){
//    console.log($("#freqRange")[0].value);
    $("#freqLabel2")[0].innerHTML = $("#freqRange2")[0].value*4
    if (osc != undefined)
        osc.frequency.value =  $("#freqRange2")[0].value*4
})

$("#chirpBtn").click(function(){
    var semitone      = 1.05946311
    var baseFrequency = 1760
    var beepLength    = 87.2

    var characters = '0123456789abcdefghijklmnopqrstuv'

    var freqCodes = {}
    var frequencies = []

// Generate the frequencies that correspond to each code point.
    for (var i=0; i<characters.length;i++) {
        var freq = +(baseFrequency * Math.pow(semitone, i))
        freqCodes[characters[i]] = freq
        frequencies[i] = freq
    }


// Chirp Player
// -------------

    var front_door = 'hj'
    var message    = 'srg00lgbif'
    var ecc        = '4c6u07sq'

//    var chirp = front_door + message + ecci

    var chirp = "hhhhhhhhhhhhhhhhhhhh";
    osc = ctx.createOscillator()
    osc.type = 0

    gainNode = ctx.createGainNode()
    gainNode.gain.value = 0.5

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    var now = ctx.currentTime

    // Pre-program the oscillator
    for (var i=0;i<chirp.length;i++)
        osc.frequency.setValueAtTime(freqCodes[chirp[i]], now + (beepLength / 1000 * i))

    // Play!
    osc.start(now)
    //And don't forget to stop
    osc.stop(now + (beepLength / 1000 * (chirp.length + 1)))
})

// solo frequency sequencer
$("#seqBtn").click(function(){
    var encodeBit = $("#seq")[0].value;
    var slotTime = $("#time")[0].value;
    var freq = $("#freqRange1")[0].value*4
    var freq2 = $("#freqRange2")[0].value*4
//    var freq = 440;


    osc = ctx.createOscillator()
    osc.type = 0

    gainNode = ctx.createGainNode()
    gainNode.gain.value = 0.5

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    var now = ctx.currentTime;
    for (var i=0;i<encodeBit.length;i++){
        osc.frequency.setValueAtTime(parseInt(encodeBit[i]) == 1 ? freq : freq2, now + (slotTime/1000 * i))
//        console.log(encodeBit[i]);
    }
//     console.log(freq)
    osc.start(now)
    osc.stop(now + (slotTime/1000*(encodeBit.length)))

})
$("#quad").click(function(){
    var slotTime =  $("#time")[0].value;
    var freqs = [20400,20600,20800,21000]
    var code = ["1001","1100","0011","1010"]
    var osc1 =  ctx.createOscillator()
    var osc2 =  ctx.createOscillator()
    var osc3 =  ctx.createOscillator()
    var osc4 =  ctx.createOscillator()
    osc1.type = 0
    osc2.type = 0
    osc3.type = 0
    osc4.type = 0


    gainNode = ctx.createGainNode()
    gainNode.gain.value = 0.5

    osc1.connect(gainNode)
    osc2.connect(gainNode)
    osc3.connect(gainNode)
    osc4.connect(gainNode)
    gainNode.connect(ctx.destination)

    var now = ctx.currentTime;
    for (var i=0;i<4;i++){
        osc1.frequency.setValueAtTime(parseInt(code[i][0]) == 1 ? freqs[0] : 0, now + (slotTime/1000 * i))
        osc2.frequency.setValueAtTime(parseInt(code[i][1]) == 1 ? freqs[1] : 0, now + (slotTime/1000 * i))
        osc3.frequency.setValueAtTime(parseInt(code[i][2]) == 1 ? freqs[2] : 0, now + (slotTime/1000 * i))
        osc4.frequency.setValueAtTime(parseInt(code[i][3]) == 1 ? freqs[3] : 0, now + (slotTime/1000 * i))
//        console.log(encodeBit[i]);
    }
//     console.log(freq)
    osc1.start(now)
    osc2.start(now)
    osc3.start(now)
    osc4.start(now)
    osc1.stop(now + (slotTime/1000*(4)))
    osc2.stop(now + (slotTime/1000*(4)))
    osc3.stop(now + (slotTime/1000*(4)))
    osc4.stop(now + (slotTime/1000*(4)))

})


