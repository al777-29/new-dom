/*

 */
//инстал
app.initialize();



// структура загружена
function makeFunc (){
    f.src = cordova.file.applicationDirectory;
    f.start('text');

    //SaveFile('Как ты ?');
    var src = f.src + 'www/index.html';
    console.log();


var sec0 = '';
    setInterval(function() {
        a.a--;
        if (a.a <= 0) {
            f.ReadFile();
            f.ajax();
        }
        if (document.getElementById("sec")) {
        var sec =document.getElementById("sec").value;
            if (sec !== sec0) {
                sec0 = sec;
                f.SaveFile(sec);
            }
        }


        document.getElementById("text").innerHTML=`${a.a} => ${a.post.time} =>  
        ${a.fileResult}`;

    }, 100);
}
