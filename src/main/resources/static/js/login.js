const loginId = document.getElementById('loginId')
const loginPassword = document.getElementById('loginPassword')
const loginSub = document.querySelector('.login-sub')
const loginBtn = document.querySelector('.login-btn')
const loginIdError = document.createElement('div')
const loginPassError = document.createElement('div')
const loginToJoin = document.querySelector('.login-info-join')
const logoAuto = document.querySelector('.login-auto')

let btnModCheckId = false;
let btnModCheckPass = false;
let loginAutoResult = false;

// alert 생성 ----

const notiboxBor = document.createElement('div')
const notibox = document.createElement('div')
const noticontent = document.createElement('div')
const notibtn = document.createElement('div')

// 로그인 정보 불일치 시 나오는 팝업창 생성 함수
function noticeAlert(parentTag, notiMsg) {

    notiboxBor.style.position = 'absolute'
    notiboxBor.style.marginTop = '8.9rem'

    notibox.style.display = 'flex'
    notibox.style.flexDirection = 'column'
    notibox.style.alignItems = 'center'
    notibox.style.backgroundColor = 'white'
    notibox.style.padding = '1.5rem 1rem'
    notibox.style.borderRadius = '0.5rem'
    notibox.style.boxShadow = '2px 2px 0.5rem rgba(88, 88, 88, 0.3)'

    noticontent.style.marginBottom = '1.1rem'
    noticontent.style.fontSize = '0.9rem'

    notibtn.textContent = '닫기'
    notibtn.style.fontSize = '0.8rem'
    notibtn.style.padding = '0.1rem 0.8rem'
    notibtn.style.borderRadius = '0.3rem'
    notibtn.style.backgroundColor = 'rgba(88, 88, 88, 1)'
    notibtn.style.color = 'white'
    notibtn.style.cursor = 'pointer'

    notiboxBor.appendChild(notibox)
    notibox.appendChild(noticontent)
    notibox.appendChild(notibtn)

    noticontent.textContent = notiMsg

    parentTag.prepend(notiboxBor)
}

notibtn.addEventListener('click', function () {
    notiboxBor.remove()
})

loginToJoin.addEventListener('mouseover', function () {
    loginToJoin.textContent = "회원가입 하러가기"
})

loginToJoin.addEventListener('mouseout', function () {
    loginToJoin.textContent = "아직 아트마켓에 계정이 없으신가요?"
})

loginToJoin.addEventListener('click', function () {
    location.href = "agree.html"
})

logoAuto.addEventListener('click', function () {
    loginAutoResult = !(loginAutoResult)
})

function setErrorCss(el) {
    el.style.color = 'red'
    el.style.fontSize = '0.7rem'
    el.style.visibility = 'hidden'
    el.style.padding = '0'
}

setErrorCss(loginIdError)
setErrorCss(loginPassError)

loginId.after(loginIdError)
loginPassword.after(loginPassError)

const btnModCheckList = []
btnModCheckList.push(btnModCheckId)
btnModCheckList.push(btnModCheckPass)


function loginErrorMsgOnOff(check, msg, tag) {

    if ((check.getAttribute('name') === 'check')) {
        tag.textContent = msg
    } else if (msg === '') {
        tag.style.visibility = 'hidden'
    } else {
        tag.style.visibility = 'visible'
        tag.textContent = msg
        check.setAttribute('name', 'check')
    }
}

function btnModCheck() {
    if (btnModCheckList[0] && btnModCheckList[1]) {
        loginBtn.style.backgroundColor = 'rgba(27, 27, 27, 1)'
        loginBtn.style.cursor = 'pointer'
    } else {
        loginBtn.style.backgroundColor = 'rgba(27, 27, 27, 0.4)'
        loginBtn.style.cursor = 'not-allowed'
    }
}

function loginErrorMsgMod(inTag, regTag, errMsgTag, inTagStatus) {

    const btnCheckIndex = (inTagStatus === '아이디' ? 0 : 1)
    let btnCheckResult = false

    if (inTag.value === '') {
        loginErrorMsgOnOff(inTag, `${inTagStatus} 값을 입력해주세요.`, errMsgTag)
    } else if (regTag.test(inTag.value) === false) {
        loginErrorMsgOnOff(inTag, `${inTagStatus} 형식에 맞지 않습니다.`, errMsgTag)
    } else if (regTag.test(inTag.value) === true) {
        loginErrorMsgOnOff(inTag, '', errMsgTag)
        btnCheckResult = true;
    }

    btnModCheckList[btnCheckIndex] = btnCheckResult
}

loginId.addEventListener('focusout', function () {
    loginErrorMsgMod(loginId, commonIdReg, loginIdError, '아이디')
    btnModCheck()
})

loginPassword.addEventListener('focusout', function () {
    loginErrorMsgMod(loginPassword, commonPassReg, loginPassError, '비밀번호')
    btnModCheck()
})


loginBtn.addEventListener("click", function () {

    let resStatus = 0

    if (btnModCheckList[0] && btnModCheckList[1]) {

        sessionStorage.setItem('loginId', `${loginId.value}`)

        fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                loginId: `${loginId.value}`,
                loginPassword: `${loginPassword.value}`,
                autoLogin: `${loginAutoResult}`,
            })
        }).then(response => {
            resStatus = response.status
            return response.json()
        }).then(data => {
            if (resStatus === 200) {
                sessionStorage.setItem('id', data.loginTrueId)
                sessionStorage.setItem('identity', data.loginTrueIdentity)

                if (data.loginTrueIdentity == 'GENERAL') {
                    sessionStorage.setItem('login-profile-img', './css/icon/login-general.png')
                } else {
                    sessionStorage.setItem('login-profile-img', './css/icon/login-author.png')
                }
                sessionStorage.setItem('login-profile-intro', `${data.loginTrueName}님, 어서오세요`)
                sessionStorage.setItem('name', `${data.loginTrueName}`)
                sessionStorage.setItem('nickname', `${data.loginTrueNickname}`)
                location.href = 'index.html'

            } else if (resStatus === 401) {
                sessionStorage.removeItem('loginId')
                const parentTag = document.querySelector('.login-content')
                noticeAlert(parentTag, data.loginNoMatchMsg)
            }
        })
    }

    loginId.value = null
    loginPassword.value = null

})
//구글 로그인
const googleLogin = document.querySelector('.google-login');
googleLogin.addEventListener("click", function () {
    location.href = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=242939801101-svnsms546a27mk3i9mhfisb7fd0ge7l9.apps.googleusercontent.com&redirect_uri=http://localhost:8070/google-login&response_type=code&scope=email profile'
})
//카카오 로그인
const kakaoLogin = document.querySelector('.kakao-login');
kakaoLogin.addEventListener("click", function () {
    location.href = 'https://kauth.kakao.com/oauth/authorize?client_id=04e607024de70154a6a880a77c57ddad&redirect_uri=http://localhost:8070/kakao-login&response_type=code'

})

const loginInfoReq = document.querySelector('.login-info-req')
loginInfoReq.addEventListener('click', function () {
    location.href = 'find-info.html'
})
