//-----------------------------------
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        //document.getElementById(`header1`).innerHTML='header';
        makeFunc('deviceready');

    }
};
var onProgress = function(){
    var buffered;
    try{
        buffered = (Math.floor(this.buffered.end(0) * 1000) / 1000) || 0;
    }catch(e){}
    if(time && Math.abs(time - buffered) < 0.1){
        console.log("Buffered: 20%");
        this.removeEventListener("progress", onProgress);
    }else{
        var percent = Math.ceil(buffered / time * 100);

        percent = Math.min(100, Math.max(0, percent));
        if(!isNaN(percent)){
            console.log("Buffered: "+ percent +"%");
        }
    }
};
//-----------------------------------
function unserialize (data) {
    //  discuss at: https://locutus.io/php/unserialize/
    // original by: Arpad Ray (mailto:arpad@php.net)
    // improved by: Pedro Tainha (https://www.pedrotainha.com)
    // improved by: Kevin van Zonneveld (https://kvz.io)
    // improved by: Kevin van Zonneveld (https://kvz.io)
    // improved by: Chris
    // improved by: James
    // improved by: Le Torbi
    // improved by: Eli Skeggs
    // bugfixed by: dptr1988
    // bugfixed by: Kevin van Zonneveld (https://kvz.io)
    // bugfixed by: Brett Zamir (https://brett-zamir.me)
    // bugfixed by: philippsimon (https://github.com/philippsimon/)
    //  revised by: d3x
    //    input by: Brett Zamir (https://brett-zamir.me)
    //    input by: Martin (https://www.erlenwiese.de/)
    //    input by: kilops
    //    input by: Jaroslaw Czarniak
    //    input by: lovasoa (https://github.com/lovasoa/)
    // improved by: Rafał Kukawski
    //      note 1: We feel the main purpose of this function should be
    //      note 1: to ease the transport of data between php & js
    //      note 1: Aiming for PHP-compatibility, we have to translate objects to arrays
    //   example 1: unserialize('a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}')
    //   returns 1: ['Kevin', 'van', 'Zonneveld']
    //   example 2: unserialize('a:2:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";}')
    //   returns 2: {firstName: 'Kevin', midName: 'van'}
    //   example 3: unserialize('a:3:{s:2:"ü";s:2:"ü";s:3:"四";s:3:"四";s:4:"𠜎";s:4:"𠜎";}')
    //   returns 3: {'ü': 'ü', '四': '四', '𠜎': '𠜎'}
    //   example 4: unserialize(undefined)
    //   returns 4: false
    //   example 5: unserialize('O:8:"stdClass":1:{s:3:"foo";b:1;}')
    //   returns 5: { foo: true }

    var utf8Overhead = function (str) {
        var s = str.length
        for (var i = str.length - 1; i >= 0; i--) {
            var code = str.charCodeAt(i)
            if (code > 0x7f && code <= 0x7ff) {
                s++
            } else if (code > 0x7ff && code <= 0xffff) {
                s += 2
            }
            // trail surrogate
            if (code >= 0xDC00 && code <= 0xDFFF) {
                i--
            }
        }
        return s - 1
    }
    var readUntil = function (data, offset, stopchr) {
        var i = 2
        var buf = []
        var chr = data.slice(offset, offset + 1)

        while (chr !== stopchr) {
            if ((i + offset) > data.length) {
                throw Error('Invalid')
            }
            buf.push(chr)
            chr = data.slice(offset + (i - 1), offset + i)
            i += 1
        }
        return [buf.length, buf.join('')]
    }
    var readChrs = function (data, offset, length) {
        var i, chr, buf

        buf = []
        for (i = 0; i < length; i++) {
            chr = data.slice(offset + (i - 1), offset + i)
            buf.push(chr)
            length -= utf8Overhead(chr)
        }
        return [buf.length, buf.join('')]
    }
    function _unserialize (data, offset) {
        var dtype
        var dataoffset
        var keyandchrs
        var keys
        var contig
        var length
        var array
        var obj
        var readdata
        var readData
        var ccount
        var stringlength
        var i
        var key
        var kprops
        var kchrs
        var vprops
        var vchrs
        var value
        var chrs = 0
        var typeconvert = function (x) {
            return x
        }

        if (!offset) {
            offset = 0
        }
        dtype = (data.slice(offset, offset + 1))

        dataoffset = offset + 2

        switch (dtype) {
            case 'i':
                typeconvert = function (x) {
                    return parseInt(x, 10)
                }
                readData = readUntil(data, dataoffset, ';')
                chrs = readData[0]
                readdata = readData[1]
                dataoffset += chrs + 1
                break
            case 'b':
                typeconvert = function (x) {
                    const value = parseInt(x, 10)

                    switch (value) {
                        case 0:
                            return false
                        case 1:
                            return true
                        default:
                            throw SyntaxError('Invalid boolean value')
                    }
                }
                readData = readUntil(data, dataoffset, ';')
                chrs = readData[0]
                readdata = readData[1]
                dataoffset += chrs + 1
                break
            case 'd':
                typeconvert = function (x) {
                    return parseFloat(x)
                }
                readData = readUntil(data, dataoffset, ';')
                chrs = readData[0]
                readdata = readData[1]
                dataoffset += chrs + 1
                break
            case 'n':
                readdata = null
                break
            case 's':
                ccount = readUntil(data, dataoffset, ':')
                chrs = ccount[0]
                stringlength = ccount[1]
                dataoffset += chrs + 2

                readData = readChrs(data, dataoffset + 1, parseInt(stringlength, 10))
                chrs = readData[0]
                readdata = readData[1]
                dataoffset += chrs + 2
                if (chrs !== parseInt(stringlength, 10) && chrs !== readdata.length) {
                    throw SyntaxError('String length mismatch')
                }
                break
            case 'a':
                readdata = {}

                keyandchrs = readUntil(data, dataoffset, ':')
                chrs = keyandchrs[0]
                keys = keyandchrs[1]
                dataoffset += chrs + 2

                length = parseInt(keys, 10)
                contig = true

                for (i = 0; i < length; i++) {
                    kprops = _unserialize(data, dataoffset)
                    kchrs = kprops[1]
                    key = kprops[2]
                    dataoffset += kchrs

                    vprops = _unserialize(data, dataoffset)
                    vchrs = vprops[1]
                    value = vprops[2]
                    dataoffset += vchrs

                    if (key !== i) {
                        contig = false
                    }

                    readdata[key] = value
                }

                if (contig) {
                    array = new Array(length)
                    for (i = 0; i < length; i++) {
                        array[i] = readdata[i]
                    }
                    readdata = array
                }

                dataoffset += 1
                break
            case 'O': {
                // O:<class name length>:"class name":<prop count>:{<props and values>}
                // O:8:"stdClass":2:{s:3:"foo";s:3:"bar";s:3:"bar";s:3:"baz";}
                readData = readUntil(data, dataoffset, ':') // read class name length
                dataoffset += readData[0] + 1
                readData = readUntil(data, dataoffset, ':')

                if (readData[1] !== '"stdClass"') {
                    throw Error('Unsupported object type: ' + readData[1])
                }

                dataoffset += readData[0] + 1 // skip ":"
                readData = readUntil(data, dataoffset, ':')
                keys = parseInt(readData[1], 10)

                dataoffset += readData[0] + 2 // skip ":{"
                obj = {}

                for (i = 0; i < keys; i++) {
                    readData = _unserialize(data, dataoffset)
                    key = readData[2]
                    dataoffset += readData[1]

                    readData = _unserialize(data, dataoffset)
                    dataoffset += readData[1]
                    obj[key] = readData[2]
                }

                dataoffset += 1 // skip "}"
                readdata = obj
                break
            }
            default:
                throw SyntaxError('Unknown / Unhandled data type(s): ' + dtype)
        }
        return [dtype, dataoffset - offset, typeconvert(readdata)]
    }

    try {
        if (typeof data !== 'string') {
            return false
        }

        return _unserialize(data, 0)[2]
    } catch (err) {
        console.error(err)
        return false
    }
}
function onFileSystem(fileSystem) {
    fileSystem.root.getFile(a.fileName,{create: true, exclusive: false},gotFileE,fail);
}
function gotFileE(fileEntry) {
    var reader = new FileReader();
    fileEntry.file(function(file) {
        reader.onloadend = function(e) {
            a.fileResult = this.result;
        };
        a.fileResult = '';
        reader.readAsText(file);
    });
}
function onFileSystemSuccess(fileSystem) {
    fileSystem.root.getFile(a.fileName, { create: false }, function (fileEntry) {
        fileEntry.remove(function () {
            fileSystem.root.getFile(a.fileName,{create: true, exclusive: false},gotFileEntry,fail);
        }, function (error) {
            fileSystem.root.getFile(a.fileName,{create: true, exclusive: false},gotFileEntry,fail);
        });
    });
}
function gotFileEntry(fileEntry) {
    fileEntry.createWriter(function (writer) {
        writer.write(a.fileText);
    }, fail);
}
function fail(e) {
    console.log("FileSystem Error");
    console.dir(e);
}