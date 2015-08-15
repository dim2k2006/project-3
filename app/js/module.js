var player = (function() {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;   
    var options = {
        context: new window.AudioContext(),
        source: null,
        audioBuffer: null,
        wavesurfer: Object.create(WaveSurfer),
        waveContainer: document.querySelector('#wave'),
        waveColor: 'white',
        progressColor: 'white',
        startButton: $('.player__toggle_start'),
        stopButton: $('.player__toggle_stop'),
        metaTitle: null,
        metaArtist: null,
        metaAlbum: null,
        metaYear: null,
        dv: '',
        reader: '',
        filename: null,
        playerContainer: $('.player'),
        playerToggler: $('.player__toggle')   
    };
    


    options.wavesurfer.init({
        container: options.waveContainer,
        waveColor: options.waveColor,
        progressColor: options.progressColor
    });



    options.wavesurfer.on('ready', function() {
        options.playerContainer.removeClass('player__loading');
        
        if (options.metaTitle) {
            $('#meta-name').html(options.metaTitle);
        }

        if (options.metaArtist) {
            $('#meta-artist').html('by <u>' + options.metaArtist + '</u>');
        }
        
        if (options.metaAlbum || options.metaYear) {
            $('#meta-album').html(options.metaAlbum + ' ' + options.metaYear);
        }
        
        if (!options.metaTitle && !options.metaArtist && !options.metaAlbum && !options.metaYear) {
            if (options.filename) {
                $('#meta-name').html(options.filename);
            }
        } else {
            if (options.filename) {
                $('#filename').html(options.filename);
            }
        }
    });
        


    function _setUpListners() {
        options.startButton.click(function(event) {
            event.preventDefault();
            options.source = options.context.createBufferSource();
            options.source.buffer = options.audioBuffer;
            options.source.loop = false;
            options.source.connect(options.context.destination);                        
            options.source.start(0);
            options.startButton.removeClass('player__toggle_active');
            options.stopButton.addClass('player__toggle_active');
        });



        options.stopButton.click(function(event) {
            event.preventDefault();
            if (options.source) {
                options.source.stop(0);
                $(this).removeClass('player__toggle_active');
                options.startButton.addClass('player__toggle_active');
            }
        });



        $('input[type="file"]').change(function(e) {
            if (options.stopButton.hasClass('player__toggle_active')) {
                options.stopButton.trigger('click');
            }
            options.playerContainer.addClass('player__loading');
            options.playerToggler.removeClass('player__inactive');
            options.reader = new FileReader();
            options.reader.onload = function(e) {
                _initSound(e.target.result);

                options.dv = new jDataView(this.result);
                if (options.dv.getString(3, options.dv.byteLength - 128) == 'TAG') {
                    options.metaTitle = options.dv.getString(30, options.dv.tell());
                    options.metaArtist = options.dv.getString(30, options.dv.tell());
                    options.metaAlbum = options.dv.getString(30, options.dv.tell());
                    options.metaYear = options.dv.getString(4, options.dv.tell());
                }
            };

            options.filename = e.target.files[0].name;
            options.reader.readAsArrayBuffer(e.target.files[0]);
            options.wavesurfer.loadBlob(e.target.files[0]);
        });       
    }



    function _initSound(arrayBuffer) {
        options.context.decodeAudioData(arrayBuffer, function(buffer) {
            options.audioBuffer = buffer;
        }, function(e) {
            console.log('Error decoding', e);
        }); 
    }



    return {
        init: function () {
            _setUpListners();
        }
    };
}());