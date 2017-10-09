
	    
	  
       
	   
    
      
        
        
        (function() {
            var log = console.log.bind(console),
                deviceInfoInputs = document.getElementById('inputs'),
                deviceInfoOutputs = document.getElementById('outputs'),
                midi;
            window.AudioContext = window.AudioContext||window.webkitAudioContext;
            var context = new AudioContext();
            var activeNotes = [];
            var btnBox = document.getElementById('content'),
                btn = document.getElementsByClassName('button');
            var data, cmd, channel, type, note, velocity;
            if (navigator.requestMIDIAccess) {
                navigator.requestMIDIAccess({
                    sysex: false
                }).then(onMIDISuccess, onMIDIFailure);
            } else {
                alert("No MIDI support in your browser, please use Chrome!");
            }
            for (var i = 0; i < btn.length; i++) {
    btn[i].addEventListener('mousedown', clickPlayOn);
  btn[i].addEventListener('mouseup', clickPlayOff);
    btn[i].addEventListener('touchstart', clickPlayOn);
   btn[i].addEventListener('touchend', clickPlayOff);
}
            
             document.getElementById('container').oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation(); // not necessary in my case, could leave in case stopImmediateProp isn't available? 
    event.stopImmediatePropagation();
    return false;
};  
            
            
            
            
            for (var i = 0; i < btn.length; i++) {
                addAudioProperties(btn[i]);
            }
            var sampleMap = {
                key64: 1,
                key65: 2,
                key66: 3,
                key67: 4,
                key60: 5,
                key61: 6,
                key62: 7,
                key63: 8,
            };
            function clickPlayOn(e) {
    e.target.classList.add('active');
    e.target.play();
}
function clickPlayOff(e) {
    e.target.classList.remove('active');
}
                       
  
            
            
            
            function onMIDISuccess(midiAccess) {
                midi = midiAccess;
                var inputs = midi.inputs.values();
                for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
                    input.value.onmidimessage = onMIDIMessage;
                    listInputs(input);
                }
                midi.onstatechange = onStateChange;
            }
            function onMIDIMessage(event) {
                data = event.data,
                    cmd = data[0] >> 4,
                    channel = data[0] & 0xf,
                    type = data[0] & 0xf0,
                    note = data[1],
                    velocity = data[2];
                log('MIDI data', data);
                switch (type) {
                    case 144:
                        noteOn(note, velocity);
                        break;
                    case 128:
                        noteOff(note, velocity);
                        break;
                }
            }
            function onStateChange(event) {
                showMIDIPorts(midi);
                var port = event.port,
                    state = port.state,
                    name = port.name,
                    type = port.type;
                if (type == "input")
                    log("name", name, "port", port, "state", state);
            }
            function listInputs(inputs) {
                var input = inputs.value;
                log("Input port : [ type:'" + input.type + "' id: '" + input.id +
                    "' manufacturer: '" + input.manufacturer + "' name: '" + input.name +
                    "' version: '" + input.version + "']");
            }
            function noteOn(midiNote, velocity) {
                player(midiNote, velocity);
            }
            function noteOff(midiNote, velocity) {
                player(midiNote, velocity);
            }
            function player(note, velocity) {
                var sample = sampleMap['key' + note];
                if (sample) {
                    if (type == (0x80 & 0xf0) || velocity == 0) { //needs to be fixed for QuNexus, which always returns 144
                        btn[sample - 1].classList.remove('active');
                        return;
                    }
                    btn[sample - 1].classList.add('active');
                    btn[sample - 1].play(velocity);
                }
            }
            function onMIDIFailure(e) {
                log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
            }
            function showMIDIPorts(midiAccess) {
                var inputs = midiAccess.inputs,
                    outputs = midiAccess.outputs,
                    html;
                html = '<h4>MIDI Inputs:</h4><div class="info">';
                inputs.forEach(function(port) {
                    html += '<p>' + port.name + '<p>';
                    html += '<p class="small">connection: ' + port.connection + '</p>';
                    html += '<p class="small">state: ' + port.state + '</p>';
                    html += '<p class="small">manufacturer: ' + port.manufacturer + '</p>';
                    if (port.version) {
                        html += '<p class="small">version: ' + port.version + '</p>';
                    }
                });
                deviceInfoInputs.innerHTML = html + '</div>';
                html = '<h4>MIDI Outputs:</h4><div class="info">';
                outputs.forEach(function(port) {
                    html += '<p>' + port.name + '<br>';
                    html += '<p class="small">manufacturer: ' + port.manufacturer + '</p>';
                    if (port.version) {
                        html += '<p class="small">version: ' + port.version + '</p>';
                    }
                });
                deviceInfoOutputs.innerHTML = html + '</div>';
            }
            function loadAudio(object, url) {
                var request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.responseType = 'arraybuffer';
                request.onload = function() {
                    context.decodeAudioData(request.response, function(buffer) {
                        object.buffer = buffer;
                    });
                }
                request.send();
            }
            function addAudioProperties(object) {
                object.name = object.id;
                object.source = object.dataset.sound;
                loadAudio(object, object.source);
                object.play = function(volume) {
                    var s = context.createBufferSource();
                    var g = context.createGain();
                    var v;
                    s.buffer = object.buffer;
                    s.playbackRate.value = 1;
                    if (volume) {
                        v = rangeMap(volume, 1, 127, 0, 1);
                        s.connect(g);
                        g.gain.value = v;
                        g.connect(context.destination);
                    } else {
                        s.connect(context.destination);
                    }
                    s.start();
                    object.s = s;
                }
            }
            function rangeMap(x, a1, a2, b1, b2) {
                return ((x - a1) / (a2 - a1)) * (b2 - b1) + b1;
            }
        })();
        
    
    