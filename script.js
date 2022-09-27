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


$(function () {
    //音声入力の開始ボタンを追加
    $(".lmt__language_container").eq(0).append('<div><button class="mic_inp"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-mic" viewBox="0 0 16 16"><path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/><path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"/></svg></button></div>');
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
        $(".lmt__source_textarea").val(finalTranscript + '<span style="color:#ddd;">' + interimTranscript + '</span>');
        console.log(finalTranscript + '<span style="color:#ddd;">' + interimTranscript + '</span>');
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
        }else{
            //音声入力終了
            console.log("音声入力終了");
            recognition.stop();
            Command: toastr["info"]("音声入力終了", "Speech input at DeepL");
        }
    });
});