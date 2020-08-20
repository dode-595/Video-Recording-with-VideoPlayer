$('#newvideo').append('<video id="myVideo" controls preload="auto" playsinline class="video-js vjs-default-skin vjs-playback-rate"></video>');

var ready = false;
var progress = 0;

var options = {
    controls: false,
    width: 320,
    height: 240,
    fluid: false,
    playbackRates: [0.5, 1, 1.5, 2, 3],
    controlBar : {
        deviceButton: false,
    },
    plugins: {
        record: {
            audio: true,
            video: true,
            maxLength: 30,
            debug: true,
            videoMimeType: "video/webm\;codecs=vp8"
        }
    }
};

var player = videojs('myVideo', options, function() {
    var msg = 'Using video.js ' + videojs.VERSION +
        ' with videojs-record ' + videojs.getPluginVersion('record') +
        ' and recordrtc ' + RecordRTC.version;
    videojs.log(msg);
});

var display = $('#myVideo');

player.on('deviceError', function() {
    console.log('device error:', player.deviceErrorCode);
    ready = false;
});

player.on('error', function(element, error) {
    console.error(error);
    ready = false;
});

var timeForRecord = null;

player.on('startRecord', function() {
    console.log('started recording!');
    progress = 1;
    timeForRecord = setInterval(() => {
        var nowTime = $('.vjs-current-time-display').text();
        nowTime = nowTime.slice(2);

        if (nowTime.charAt(0) === '0') {
            nowTime = nowTime.charAt(1);
        }
        nowTime = '(' + nowTime + ')';
        
        $('#time').text(nowTime);
    }, 1000);
});

player.on('finishRecord', function() {
    progress = 0;
    clearInterval(timeForRecord);
    console.log('finished recording: ', player.recordedData);
    display[0].lastChild.remove();
    if (!$('#backMask').length) option();
});

player.on('pause', function() {
    if (!$('#backMask').length) option();
});

player.on('deviceReady', function() {
    ready = true;
});


$('.vjs-icon-av-perm').click(function() {
    var url = ['five.svg', 'four.svg', 'three.svg', 'two.svg', 'one.svg'];
    var tt = 0;

    var obT = setInterval(() => {
        if (tt > 200) {
            clearInterval(obT);
        }

        if (ready) {
            startRemove();
            clearInterval(obT);
            var count = 5;
            const timer = setInterval(() => {
                if (count === 0) {
                    clearInterval(timer);
                    display[0].lastChild.remove();
                    setProgress();
                    $('.vjs-icon-record-start').trigger('click');
                } else {
                    if (count !== 5) {
                        display[0].lastChild.remove();
                    }
                    display.append(`<img src='./assets/icons/${url[5-count]}' style="position: relative; left: '${display.position().left}'; top: '${display.position().top}'" width='${display.width()}' height='${display.height()}'class='elementToFadeOut overlay' />`);
                    count --;
                }
            }, 1000);
        } else {
            startRemove();
            preStart();
        }

        tt ++;
    }, 10);    
})

$('.vjs-paused').click(function (e) {
    if ($(e.target).attr('id') === 'myVideo_html5_api' && !progress) {
        $('.vjs-playing').trigger('click');
    }
})


$('#output').click(function() {
    const formData = new FormData();
    const input = $('#files');

    if (input.val()) {
        for (const file of input.get(0).files) {
            formData.append('files[]', file, file.name);
        }

        fetch('/video.php', {
            method: 'POST',
            body: formData,
        })
        .then(
            success => console.log("file upload complete.")
        )
        .catch(
            error => console.error('file upload error occurred!')
        );
    }
});

const preStart = () => {
    display.append(`<div id ='start' class='overlay' style='text-align: center; position: relative; left: ${display.position().left}px; top: ${display.position().top  + display.height() * 1 / 15}px; width: ${display.width()}px;'><a href='javascript: start()' style='text-decoration: none'><img src='./assets/icons/technology.svg' width='${display.width() / 3}px' class='hover'/><br><br><span style='color: white; font-size: 18px' onmouseover="this.style.color='pink'" onmouseout="this.style.color='white'">click here to start recording</span></a></div>`);
}

const startRemove = () => {
    $('#start').remove();
}

const start = () => {
    $('.vjs-icon-av-perm').trigger('click');
    startRemove();
}

const setProgress = () => {
    display.append(`<div class='overlay' style='text-align: center; position: relative; left: ${display.position().left}px; top: ${display.position().top  + display.height() - 60}px; width: ${display.width()}px; height: 30px'><a href='javascript: stop()' style='text-decoration: none'><span style='color: white; font-size: 18px' onmouseover="this.style.color='pink'" onmouseout="this.style.color='white'">click here to stop recording<span id='time'></span></span></a></div>`);
}

const stop = () => {
    display[0].lastChild.remove();
    player.record().stop();
}

const option = () => {
    display.append(`<div id='backMask' class='overlay' style='position: relative; width: ${display.width()}px; height: ${display.height()}px'></div>`)

    var pan = $('#backMask');

    pan.append(`<div id='stop' class='overlay' style='text-align: center; position: absolute; left: ${pan.position().left + 15}px; top: ${pan.position().top + pan.height() / 4}px; width: ${pan.width() / 3}px;'><a href='javascript: upload()' id='upload' style='text-decoration: none'><img src='./assets/icons/upload.svg' width='${pan.width() / 9}px' class='hover'/><br><br><span style='color: white; font-size: 22px' onmouseover="this.style.color='pink'" onmouseout="this.style.color='white'">Upload</span></a></div>`);
    pan.append(`<div id='stop' class='overlay' style='text-align: center; position: absolute; left: ${pan.position().left + pan.width() / 3}px; top: ${pan.position().top + pan.height() / 4}px; width: ${pan.width() / 3}px;'><a href='javascript: replay()' id='replay' style='text-decoration: none'><img src='./assets/icons/replay.svg' width='${pan.width() / 9}px' class='hover'/><br><br><span style='color: white; font-size: 22px' onmouseover="this.style.color='pink'" onmouseout="this.style.color='white'">Replay</span></a></div>`);
    pan.append(`<div id='stop' class='overlay' style='text-align: center; position: absolute; left: ${pan.position().left + pan.width()* 2 / 3 - 15}px; top: ${pan.position().top + pan.height() / 4}px; width: ${pan.width() / 3}px;'><a href='javascript: cancel()' id='cancel' style='text-decoration: none'><img src='./assets/icons/power.svg' width='${pan.width() / 9 + 2}px' class='hover'/><br><br><span style='color: white; font-size: 22px' onmouseover="this.style.color='pink'" onmouseout="this.style.color='white'">Close</span></a></div>`);
}

const upload = () => {
    var blob = player.recordedData;

    if (player.recordedData.video) {    
        blob = player.recordedData.video;
    }

    var reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = function() {
        var data = reader.result;

        var serverUrl = '/video.php';

        console.log('uploading recording:', blob.name);

        fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        }).then( success => {
            console.log('recording upload complete.');
            stub('uploaded');
            player.record().destroy();
        })
        .catch( error => {
            console.error('an upload error occurred!');
            if (confirm('Error uploading. \n Do you want to record again?')) {
                restore();
                player.record().reset();
                preStart();
            } else {
                player.record().destroy();
                stub('uploaded error');
            }
        });
    }
}

const replay = () => {
    $('#backMask').remove();
    $('.vjs-paused').trigger('click');
}

const cancel = () => {
    if (confirm('Are you sure you want to close the player?')) {
        player.record().destroy();
        stub('closed');
    }
}

const stub = id => {
    alert('Here is what you can do with \n id = "' + id + '"');
}

preStart();
