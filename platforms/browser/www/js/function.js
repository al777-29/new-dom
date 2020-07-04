//-----------------------------------
var f = {
    f           :  function ()      {

    },
    mp3         :  function (mp3)   {
        var i = mp3 + '.mp3';
        a.mp3_files[i].play(a.mp3_files[i].addEventListener("progress", onProgress));
    },// mp3
    start       :  function (s_i)   {
        for (var i in a.mp3_files) {
            var src = f.src + 'www/mp3/'+ i;
            a.mp3_files[i] = new Audio();
            a.mp3_files[i].setAttribute("src", src);
            a.mp3_files[i].load();
        }
        if (s_i === 'text') {
            f.html({// страница 1
            he      :   1,
            title   :   `
    <input type="text" id="sec"  size="5" class="t_model"   value="" >
    <input type="submit" class="t_model"  id="t_model" onclick="f.click(this.id)" value="000" >
        
                        `,


            content :   `
        текст 1
        `
        });
            f.html({// страница 2
            he      :   2,
            title   :   `
        страница 2
        `,
            content :   `
        текст 2<br>
        текст 2<br>
        текст 2
        `
        });
        }
    },// mp3
    he_1        :  function ()      {
        document.getElementById("header2").style.display = "none";
        document.getElementById("header1").style.display = "block";
        a.he=1;
        f.he_0();

    },// 1-окно
    he_2        :  function ()      {// 2-окно
        document.getElementById("header1").style.display = "none";
        document.getElementById("header2").style.display = "block";
        a.he=2;
        f.he_0();
    },// 2-окно
    he_0        :  function ()      {
        var rr = '#header'+a.he;
        document.getElementById("deviceready").style.cssText
            = `margin-top: ${$(rr).css('height')};`;
    },// высота сдвиг окна
    ajax        :  function ()      {
        // создадим объект XHR
        var request = new XMLHttpRequest();
        // инициализирум запрос
        request.open("POST", a.url);
        // при изменении состояния запроса request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.addEventListener('readystatechange', function() {
            // если запрос завершился и код ответа сервера OK (200), то
            if (this.readyState === 4 && this.status === 200) f.ajax200(a.post=JSON.parse(this.responseText));
        });
        // отправляем запрос на сервер
        request.send(a.formData);
        f.ajax000();
    },// ajax запрос на сервер
    ajax000     :  function ()      {
        a.a = a.t;
        a.formData.append('pin', 0);
        a.formData.append('sec', 0);
    },// ajax обнуление после отправки
    ajax200     :  function ()      {
        //a.post = post ;
    },// ajax ответ сервер
    html        :  function (options) {
        if ( options===undefined) options=[];
        var he = a.he;
        if (options.he) he = options.he;
        var header  =   ``;
        header+=`
                <div class="modul-header" >
                    <span class="modul-title" >${options.title || ''}</span>
                    ${options.closavle  ? '' : '<span class="modul-close" onclick="f.he_'+(he >= 2 ? 1 : 2)+'()">&times;'+he+'&times;</span>'}
                </div>
                <div class="modul-body">
                    ${options.content || ''}
                </div>
        `;
        document.getElementById(`header${he}`).innerHTML=header;
        if ( !options.he_0) f.he_0();
    },// html структура
    click       :  function (i)     {
       f.modal({
           title        : 'Отчет об Энергии',
           background   : '#bbecff',
           content      :   ``
       });
       f.mp3('on');
    },// click МОДЕЛЬНОЕ ОКНО
    modal       :  function (options)  {    // окно
        var speed =200;
        var closing = false;
        $modul = f._createModul(options);
        $modul.classList.add('open');
        var modal = {
            open () {
                !closing && $modul.classList.add('open')// Добавить класс
            },
            close () {
                closing = true;
                $modul.classList.remove('open') ;// удалить класс
                $modul.classList.add('hide');
                setTimeout(function () {
                    $modul.classList.remove('hide');
                    closing = false;
                },speed)
            }
        };
        $modul.addEventListener('click' , function (event)  {
           if (event.target.dataset.clole) modal.close()
        });
        return modal
    },// МОДЕЛЬНОЕ ОКНО
    _createModul:  function (options)  {    // окно

        var modul = document.createElement('div');
        modul.classList.add('vmodul');
        var modul_body=options.content;
        if (options.url) {
            modul_body=`<iframe  frameborder="0" scrolling="yes" align="middle" src="${options.url}" width="100%" height="560"></iframe>`;
        }
        modul.insertAdjacentHTML('afterbegin',`
    <div class="modul-overlay" data-clole="true">
        <div class="modul-windows" style="width: ${options.width || '90%' } ;background: ${options.background || '#0c6b66' };">
            <div class="modul-header" >
                <span class="modul-title" >${options.title || ''}</span>
                ${options.closavle  ? '' : '<span class="modul-close" data-clole="true">&times;&times;&times;</span>'}
            </div>
            <div class="modul-body">${modul_body}</div>
        </div>
    </div>
    `);
        document.body.appendChild(modul);
        return modul
    },// МОДЕЛЬНОЕ ОКНО...
    ReadFile    :  function (file)  {
        if (file) a.fileName=file;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,onFileSystem, fail);
    },// чтение файла с постояного каталога
    SaveFile    :  function (text,file)  {
        if (file) a.fileName=file;
        if (text) a.fileText=text;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,onFileSystemSuccess, fail);
    },// запись файла с постояного каталога
};
















