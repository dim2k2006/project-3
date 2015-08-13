var wavesurfer = Object.create(WaveSurfer);

wavesurfer.init({
    container: document.querySelector('#wave'),
    waveColor: 'white',
    progressColor: 'white'
});

if (!window.AudioContext) {
  alert('The Web Audio API is not supported in your browser!');
}
var context = new window.AudioContext();
var source = null;
var audioBuffer = null;
 
function stopSound() {
  if (source) {
    source.stop(0);
  }
}

function playSound() {
  source = context.createBufferSource(); // Global so we can .noteOff() later.
  source.buffer = audioBuffer;
  source.loop = false;
  source.connect(context.destination);
  source.start(0);    
}

function initSound(arrayBuffer) {
  context.decodeAudioData(arrayBuffer, function(buffer) {
    audioBuffer = buffer;
    var buttons = document.querySelectorAll('button');
    buttons[0].disabled = false;
    buttons[1].disabled = false;
  }, function(e) {
    console.log('Error decoding', e);
  }); 
}

document.querySelector('input[type="file"]').addEventListener('change', function(e) {  
  var reader = new FileReader();
  reader.onload = function(e) {
    initSound(e.target.result);

    
    var dv = new jDataView(this.result);
    if (dv.getString(3, dv.byteLength - 128) == 'TAG') {
      var title = dv.getString(30, dv.tell());
      var artist = dv.getString(30, dv.tell());
      var album = dv.getString(30, dv.tell());
      var year = dv.getString(4, dv.tell());


      document.getElementById('meta-name').innerHTML = title;
      document.getElementById('meta-artist').innerHTML = 'by <u>' + artist + '</u>';
      document.getElementById('meta-album').innerHTML = album + ' ' + year;
      // document.getElementById('meta').innerHTML = 'title: ' + title
      // + '<br>'
      // + 'artist: '
      // + artist
      // + '<br>'
      // + 'album: '
      // + album
      // + '<br>'
      // + 'year: '
      // + year;
    } else {
      // no ID3v1 data found.
      document.getElementById('filename').innerHTML = 'no metadata';
    }
  };
  reader.readAsArrayBuffer(e.target.files[0]);
  document.getElementById('filename').innerHTML = e.target.files[0].name;

  // wavesurfer.load(e.target.files[0]);
   wavesurfer.loadBlob(e.target.files[0]);
}, false);
  
// Example loading via xhr2: loadSoundFile('sounds/A220_A880.wav');
function loadSoundFile(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.onload = function(e) {
    initSound(e.target.response);
  };
  request.send();
}