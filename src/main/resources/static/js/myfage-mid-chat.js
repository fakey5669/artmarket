// myfageChatMidAddTag()
// ------------------------------ myfage-mid-chat ------------------------------
function myfageChatMidAddTag() {



    if (myfageMid.childNodes) {
        const childNodesArray = Array.from(myfageMid.childNodes);
        for (const myfageMidTag of childNodesArray) {
            myfageMidTag.remove();
        }
    }

    let resStatusCode

    myfageMid.insertAdjacentHTML('afterbegin', `<div class="myfage-chat-box">
        <div class="myfage-chat-not-check chatNotBtn" onclick="chatNotCheck()">안 읽은 메세지만 보기</div>
        <div class="myfage-chat-not-check chatAllBtn" onclick="chatAll()" style="display:none;">전체 메세지 보기</div>
        <div class="myfage-chat-box-default-title">현재 대화중인 채팅방이 없습니다.</div>
        <div class="myfage-chat-box-default-intro">다양한 작품을 구경하고 작가에게 문의해보세요!</div>
    </div>`)

    function myfageChatListBring(chatRoomId, chatRoomMsg, chatRoomLastDate, chatSender, chatSenderIdtity, chatSenderProfile) {
        const myfageChatBox = document.querySelector('.myfage-chat-box');


        myfageChatBox.insertAdjacentHTML('beforeend',
            `<div class="myfage-chat-list" id="${chatRoomId}" name="${chatSender}">
          <div class="myfage-chat-content">
              <div class="myfage-chat-profile">
                  <div class="myfage-chat-profile-identity">${chatSenderIdtity}</div>
                  <div class="myfage-chat-profile-img">
                      <img class="myfage-chat-profile-img-tag" src="${chatSenderProfile}" />
                  </div>
              </div>
              <div class="myafge-chat-info">
                  <div class="myfage-chat-info-top">
                      <div class="myfage-chat-info-top-nickname" id="${chatSender}">${chatSender}</div>
                      <div class="myfage-chat-info-top-send-time">${chatRoomLastDate}</div>
                  </div>
                  <div class="myfage-chat-info-msg">${chatRoomMsg}</div>
              </div>
          </div>
          <div class="myfage-chat-delete">
              <img class="myfage-chat-delete-img" src="./css/icon/chat-exit.png" />
          </div>
      </div>`);
    }


    function myfageChatListClickEventFun(){
        const myfageChatLists = document.querySelectorAll('.myfage-chat-list');
        myfageChatLists.forEach((item,index)=>{
            // 상세 내용
            item.querySelector(".myfage-chat-content").addEventListener('click', function () {
                myfageChatListClick(item.getAttribute('id'), item.getAttribute('name'));
            });
            // 삭제
            item.querySelector(".myfage-chat-delete").addEventListener('click', function () {
                myfageChatListDelete(item.getAttribute('id'),item);
            });

        });
    }


    fetch(`/myfage/${sessionStorage.getItem('id')}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => {
        resStatusCode = response.status
        return response.json()
    }).then(data => {
        if (resStatusCode === 200) {

            let chatListCheck = true
            // 채팅 리스트 출력
            for (var i = 0; i < data.myChatRooms.length; i++) {
                if (data.myChatRooms[i].chatMsg !== null) {
                    let defaultProfile = (data.myChatRooms[i].chatSenderProfile === null ? './css/icon/default-profile-img.png' : `${data.myChatRooms[i].chatSenderProfile}`)
                    myfageChatListBring(data.myChatRooms[i].chatRoomId,
                        data.myChatRooms[i].chatMsg,
                        data.myChatRooms[i].chatDate,
                        data.myChatRooms[i].chatSender,
                        data.myChatRooms[i].chatSenderIdtity,
                        defaultProfile)
                    chatListCheck = false
                }
            }


            // 채팅 클릭 이벤트
            myfageChatListClickEventFun();

            if (!chatListCheck) {
                const myfageChatBoxDefaultTitle = document.querySelector('.myfage-chat-box-default-title')
                const myfageChatBoxDefaultIntro = document.querySelector('.myfage-chat-box-default-intro')

                myfageChatBoxDefaultTitle.remove()
                myfageChatBoxDefaultIntro.remove()
            }
        } else if (resStatusCode === 401) {
            alert('참여한 대화방이 없습니다.')
        } else if (resStatusCode === 400) {
            alert('알수 없는 오류로 대화방을 읽어들일 수 없습니다.')
        }
    })
}

// ------------------------------ myfage-right-chat ------------------------------
var isDisabled = false;
function myfageChatListClick(chatRoomId, chatSender) {

    let  myfageRightChatNotDefault = document.querySelector('.myfage-right-chat-not-default');
    myfageRightChatNotDefault.remove();

    myfageRight.insertAdjacentHTML('beforeend', `
    <div class="myfage-right-chat-box" id="${chatRoomId}">
    <div class="myfage-right-chat-box-top">
    <div class="myfage-right-chat-box-top-profile">
      <div class="myfage-right-chat-box-top-nickname">${chatSender}</div>
      <div class="myfage-right-chat-box-top-show-article">
        작품 보러가기
      </div>
    </div>
    <input
      class="myfage-right-chat-box-top-show-exit"
      type="button"
      value="X"
    />
  </div>
  <div class="myfage-right-chat-box-mid"></div>
  <div class="myfage-right-chat-box-bot">
    <img id="fileBox" src=""  />
    <input class="myfage-right-chat-box-bot-send-text" type="text" />
    <label for="fileMsg" class="myfage-right-chat-box-bot-send-attach-btn"><img class="myfage-right-chat-box-bot-send-attach" src="./css/icon/chat-attach.png" /></label>
    <input class="myfage-right-chat-box-bot-send-attach-file" id="fileMsg" type="file" multiple="multiple" style="display:none;">
    <img class="myfage-right-chat-box-bot-send-btn"src="./css/icon/chat-send-btn.png"/>
  </div>
  </div>`)

    sessionStorage.setItem('chatcurrenttag', `myfage-right-chat-box-mid`)
    const myfageRightChatBoxMid = document.querySelector('.myfage-right-chat-box-mid')
    fetch(`${baseUrl}/myfage`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            clickChatId: `${chatRoomId}`,
            clickMember: `${sessionStorage.getItem('id')}`
        })
    }).then(response => {
        return response.json()
    }).then(data => {


        const myfageRightChatBoxTopShowArticle = document.querySelector('.myfage-right-chat-box-top-show-article')
        myfageRightChatBoxTopShowArticle.setAttribute('id', `${data.chatProudct}`)
        let chatContent = '';
        for (chatList of data.chatList) {

            let chatWhoTag = (chatList.chatSender == sessionStorage.getItem('id') ? 'me' : 'other')
            chatContent += '<div class="' + sessionStorage.getItem('chatcurrenttag') +'-msg-'+ chatWhoTag + '">';
            chatContent += '<div class="' + sessionStorage.getItem('chatcurrenttag') +'-msg-'+ chatWhoTag + '-time">' + chatList.chatDate +' </div>';
            if(chatList.chatMsg != ''){
                chatContent += '<div class="' + sessionStorage.getItem('chatcurrenttag') +'-msg-'+ chatWhoTag + '-text">' + chatList.chatMsg +' </div>';
            }
            if(chatList.chatType == "FILE"){
                let  fileFix = getExtensionOfFilename(chatList.chatFileName);
                if ( fileFix== '.jpg' || fileFix== '.png' || fileFix== '.gif') {
                      chatContent += '<img class="myfage-right-chat-box-mid-img" src="' + chatList.chatFile +'" />';
                }
                chatContent += '<a class="myfage-right-chat-box-mid-download" href="/file/download/'+ chatList.chatFileDownload +'" download="'+ chatList.chatFileName +'"><img src="../css/img/icon-downloads.png">';
                chatContent +=  chatList.chatFileName +' </a>';
            }
            chatContent += '</div>'
        }
        myfageRightChatBoxMid.innerHTML = chatContent;
        myfageRightChatBoxMid.scrollTop = myfageRightChatBoxMid.scrollHeight;
    })

    const myfageRightChatBoxTopShowArticle = document.querySelector('.myfage-right-chat-box-top-show-article')


    myfageRightChatBoxTopShowArticle.addEventListener('click', function () {
        sessionStorage.setItem('detailproduct', `${myfageRightChatBoxTopShowArticle.getAttribute('id')}`)
        location.href = "detail.html"
    })


    //파일 관련
    //const myfageChatRoomBoxBotSendAttach = document.querySelector('.myfage-right-chat-box-bot-send-attach')
    const myfageChatRoomBoxBotSendAttachFile = document.getElementById('fileMsg');
    let chatFileBox = document.querySelector("#fileBox");
    let chatTxtFrom = document.querySelector(".myfage-right-chat-box-bot-send-text")


    // chat send btn
    const myfageRightChatBoxBotSendBtn = document.querySelector('.myfage-right-chat-box-bot-send-btn')

    // chat exit btn
    const myfageRightChatBoxTopShowExit = document.querySelector('.myfage-right-chat-box-top-show-exit')

    let socket = new SockJS(`/stomp/chat`)
    let stompClient = Stomp.over(socket)


    // //초기화
    // myfageRightChatBox.style.display = 'none'
    // myfageChatRightAddTag()
    // stompClient.disconnect()

    stompClient.connect({}, function () {

            stompClient.subscribe(`/sub/chat-room/get/${chatRoomId}`, (message) => {
                chatMsgGet(JSON.parse(message.body), `${chatSender}`);

                myfageRightChatBoxMid.scrollTop = myfageRightChatBoxMid.scrollHeight;
            })

            //파일 업로드 구현
            myfageChatRoomBoxBotSendAttachFile.addEventListener('click', function () {
                myfageChatRoomBoxBotSendAttachFile.addEventListener('change',function(){
                    var fileList = myfageChatRoomBoxBotSendAttachFile.files ;
                    // 읽기
                    var reader = new FileReader();
                    reader.readAsDataURL(fileList[0]);
                    //로드 한 후
                    reader.onload = function  () {
                        let fileType = fileList.type;
                        if(fileList[0].type == "image/png" || fileList[0].type == "image/jpeg"){
                            chatFileBox.style.display = 'block';
                            chatTxtFrom.style = 'padding-left:4rem';
                            chatFileBox.src=  reader.result;
                        }
                    };
                });
            });


            //메시지 전송
            myfageRightChatBoxBotSendBtn.addEventListener('click', function () {
                let fileList = myfageChatRoomBoxBotSendAttachFile.files[0];
                const myfageRightChatBoxBotSendText = document.querySelector('.myfage-right-chat-box-bot-send-text')

                if (myfageRightChatBoxBotSendText.value === '') {
                    alert('메세지를 입력해주세요.')
                } else {
                    //파일이 있을경우
                    if (fileList != null) {
                        // 웹소켓에서 파일객체는 직렬화 해서 전달 받아야한다.
                        // 바이트 배열로 변환하여 전송
                        let reader = new FileReader();
                        reader.onload = function (event) {
                            let fileContent = event.target.result; // 파일 내용
                            stompClient.send(`/pub/chat-room/send`, {}, JSON.stringify({
                                sendChatRoomId: `${chatRoomId}`,
                                sendChatMsg: myfageRightChatBoxBotSendText.value,
                                sendChatSender: sessionStorage.getItem('id'),
                                sendChatFile: {
                                            chatFileName: fileList.name,
                                            chatFileData:  Array.from(new Uint8Array(fileContent)),
                                            chatFileType: fileList.type
                                    }
                            }));

                        };

                        reader.readAsArrayBuffer(fileList); // 파일을 바이너리로 읽기
                    }else{
                        // 일반 메시지
                        stompClient.send(`/pub/chat-room/send`, {}, JSON.stringify({
                            sendChatRoomId: `${chatRoomId}`,
                            sendChatMsg: myfageRightChatBoxBotSendText.value,
                            sendChatSender: sessionStorage.getItem('id'),
                            sendChatFile: null // 바이트 배열로 변환하여 전송
                        }));
                    }

                    setTimeout(function () {
                        // 초기화
                        myfageRightChatBoxBotSendText.value = '';
                        if(chatFileBox != null){
                            chatFileBox.style = "display:none";
                            myfageRightChatBoxBotSendText.style = '';
                            myfageChatRoomBoxBotSendAttachFile.value ='';
                        }
                    },100);


                }
            })

            const myfageRightChatBox = document.querySelector('.myfage-right-chat-box')
            // disconnect 구현
            myfageRightChatBoxTopShowExit.addEventListener('click', function () {
                myfageRightChatBox.style.display = 'none'
                myfageChatRightAddTag()
                stompClient.disconnect()
            });

            stompClient.debug = null;

        },
        function () {
            alert('연결에 실패했습니다.')
        });
}


function myfageChatListDelete(chatRoomId,item){
    console.log("삭제로직 ");
    modal.style = "display:block";
    modalTitle.innerHTML = "채팅방 삭제";
    let modalMsg = '<p><b>채팅방의 모든 내용이 사라집니다</b></p>'
        modalMsg += '<p><b>삭제를 원하시면 버튼을 눌러주세요^_^</b></p>'
        modalMsg += '<p style="margin-top: 1rem">제거된 파일은 되돌릴 수 없습니다 </p>'
        modalMsg += '<div class="btn-wrap" style="margin-top: 1rem"><button id="chatDeleteResult" class="btn-type01">삭제하기</button></div>'
    modalContent.innerHTML = modalMsg;


    let chatDeleteResult = document.getElementById("chatDeleteResult");

    chatDeleteResult.addEventListener("click",function () {
        modal.style ="display:none";

        fetch('/mypage',{
            method:"DELETE",
            body:JSON.stringify({
                remChatMember: sessionStorage.getItem('id'),
                remChatRoomId: chatRoomId
            }),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response =>{
            if(response.status == 400){
                modal.style = "display:block";
                modalTitle.innerHTML = "채팅 방 삭제 실패";
                modalContent.innerHTML = '<p>주문 진행 중인 상품이 있습니다. </p>' +
                                        '<p>마감기한이 완료되어야 삭제 가능합니다.</p>';

                setTimeout(function () {
                    modal.style = "display:none";
                },5000);

            }
            if(response.status == 200){
                modal.style = "display:block";
                modalTitle.innerHTML = "채팅 방 삭제 성공";
                modalContent.innerHTML = "채팅 방 삭제가 성공했습니다.";
                item.style = "display:none";
                setTimeout(function () {
                    modal.style = "display:none";
                },5000);

            }

        })
    })


}




function chatNotCheck(){
    let myfageChatLists = document.querySelectorAll('.myfage-chat-list');
    let myfageChatNot = document.querySelector('.chatNotBtn');
    let myfageChatAll = document.querySelector('.chatAllBtn');

    if (alramMsgList.size != 0){
    // console.log("안읽은 메시지 ");
        myfageChatLists.forEach((item,index) => {
            item.style = "display:none";
            if(alramMsgList.get(index) == item.getAttribute('id')){
                item.style = "display:flex";
            }
        });

        myfageChatNot.style = "display:none";
        myfageChatAll.style = "display:block";
    }else {
        modal.style = "display:block";
        modalTitle.innerHTML = "채팅 알림";
        modalContent.innerHTML = "<p>안 읽은 메시지가 존재하지 않습니다.</p>";
        setTimeout(function () {
            modal.style = "display:none";
        },1000)
    }
}

function chatAll(){
    let myfageChatLists = document.querySelectorAll('.myfage-chat-list');
    let myfageChatNot = document.querySelector('.chatNotBtn');
    let myfageChatAll = document.querySelector('.chatAllBtn');

    myfageChatLists.forEach((item,index)=> {
        item.style = "display:flex";
    });
    myfageChatNot.style = "display:block";
    myfageChatAll.style = "display:none";
}