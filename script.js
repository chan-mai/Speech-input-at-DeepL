push_cnt = 0;

toastr.options.timeOut = 3000;
toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": false,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
let recognition = new SpeechRecognition();

recognition.lang = 'ja-JP';
recognition.interimResults = true;
recognition.continuous = true;

disable_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-mic" viewBox="0 0 16 16"><path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/><path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"/></svg>';
enable_svg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-mic-mute" viewBox="0 0 16 16"><path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3-9v4.879l-1-1V3a2 2 0 0 0-3.997-.118l-.845-.845A3.001 3.001 0 0 1 11 3z"/><path d="m9.486 10.607-.748-.748A2 2 0 0 1 6 8v-.878l-1-1V8a3 3 0 0 0 4.486 2.607zm-7.84-9.253 12 12 .708-.708-12-12-.708.708z"/></svg>';


$(function () {
    //音声入力の開始ボタンを追加
    $(".lmt__language_container").eq(0).append('<div><button class="mic_inp"></button></div>');
    $(".mic_inp").eq(0).append(disable_svg);
    $(".dl_header_menu_v2__links__item").eq(-1).remove();
    $(".dl_header_menu_v2__links__item").eq(-2).remove();
    $(".dl_header_menu_v2__links__item").eq(-3).remove();
    $(".dl_header_menu_v2__links").append('<a class="dl_header_menu_v2__links__item dl_navigate_away" id="dl_menu_apps" style="display: flex;" href="/app"><span class="dl_headerMenu__itemWithBadge">Speech input at DeepL<span id="apps-link-free-badge" style="display: block;" class="dl_headerMenu__freeBadge">GitHub</span></span></a>');
    //css
    $(".mic_inp").css("color", "#ff0000");

    let finalTranscript = ''; //確定した認識結果

    recognition.onresult = (event) => {
        let interimTranscript = ''; //暫定認識結果
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            let transcript = event.results[i][0].transcript;
            
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript = transcript;
            }
        }
        $(".lmt__source_textarea").val(finalTranscript + interimTranscript);
        console.log(finalTranscript + '+(' + interimTranscript + ')');
    }
    recognition.onend = (event) => {
        //終了されていなければ音声認識を再帰的に実行
        if (push_cnt % 2 == 1) {
            recognition.start()
        }
    }

    //音声入力の開始ボタンを押したときの処理
    $(".mic_inp").click(function () {
        push_cnt++;
        //入力開始と終了の判定
        if (push_cnt % 2 == 1) {
            //音声入力開始
            console.log("音声入力開始");
            recognition.start();
            Command: toastr["info"]("音声入力開始", "Speech input at DeepL");
            //svgの変更
            $(".mic_inp").eq(0).empty();
            $(".mic_inp").eq(0).append(enable_svg);
            //textareaをリセット
            $(".lmt--empty_source").val("");
            //クラスの追加
            $(".lmt__source_textarea").addClass("lmt__textarea");
            $(".lmt__source_textarea").addClass("lmt__textarea_base_style");
            $(".lmt__source_textarea").addClass("df2937__textareaPointer--sup2M");
            //css
            $("body").css("border-radius", "10px");
        }else{
            //音声入力終了
            console.log("音声入力終了");
            recognition.stop();
            Command: toastr["info"]("音声入力終了", "Speech input at DeepL");
            //svgの変更
            $(".mic_inp").eq(0).empty();
            $(".mic_inp").eq(0).append(disable_svg);
        }
    });
});