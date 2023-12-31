/*------------------------태그 추가------------------------- */

const nav = document.querySelector('nav')

nav.insertAdjacentHTML('beforeend', `
<div class="nav-logo">
    <img src="./css/img/ARTMARKET.png">
</div>
<div class="nav-category">
    <div class="illust">ILLUST</div>
    <div class="live">LIVE2D•3D</div>
    <div class="character">CHARACTER</div>
    <div class="design">DESIGN</div>
    <div class="video">VIDEO</div>
</div>
<div class="nav-menu">
    <div class="login">LOGIN</div>
    <div class="myfage">MYPAGE</div>
    <div class="alram">
      ALARM 
      <!-- <span class="alram-num num" style="display:none;"></span>-->
      <div class="alram-con" style="display:none;" >
          <p class="title">
            <span class="num"></span>개의 알람이 도착했습니다.
            <button class="alram-delete-all">모두읽음</button>
          </p>
          <ul></ul>
      </div>
    </div>
<!--    <div class="center">CENTER</div>-->
    <div class="home">HOME</div>
    <div class="login-profile">
        <img class="login-profile-img" />
        <div class="login-profile-intro">
        </div>
    </div>
</div>`)


const login = document.querySelector('.login');
const alram = document.querySelector('.alram');
const alramDeleteAllBtn = alram.querySelector('.alram-delete-all');
const alramNumber = alram.querySelectorAll('.num');
const alramContent = document.querySelector('.alram-con');
let alramSize = 0;

if (sessionStorage.getItem("id") !== null) {
    login.textContent = 'LOGOUT'
    login.setAttribute("class", "logout");
    alramSet(sessionStorage.getItem("id"));
} else {
    login.textContent = 'LOGIN'
    login.setAttribute("class", "login");
}

if (login) {
    login.addEventListener('click', function () {
        location.href = 'login.html'
    })
}

const alramMsgList = new Map();

function alramSet(id) {
    let resStatus = 0;
    fetch("/index/alram", {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            alramId: id
        })
    }).then(response => {
        resStatus = response.status
        return response.json()
    }).then(data => {
        let alramListCont = '';

        alramMsgList.clear();
        for (let i = 0; i < data.alrams.length; i++) {
            alramListCont += '<li>';
            alramListCont += '<span class="alram-type">' + data.alrams[i].alramType + '</span>';
            alramListCont += '<span class="alram-sender">' + data.alrams[i].alramSender + '</span>';
            alramListCont += '<span class="alram-date">' + data.alrams[i].alertDate + '</span>';
            alramListCont += '</li>';
            if (data.alrams[i].alramType == "MESSAGE") alramMsgList.set(i, data.alrams[i].alertPath);

        }
        alramSize = `${data.alrams.length}`
        sessionStorage.setItem('alramList', alramListCont);

        alramNumber.forEach((item, index) => {
            item.textContent = alramSize;
            item.style = "display:inline-block";
        });

    });
}


alram.addEventListener('click', function () {
    const alramList = sessionStorage.getItem("alramList");
    if (alramSize != 0) {
        alramContent.querySelector("ul").innerHTML = alramList;
    } else {
        alramContent.querySelector("ul").innerHTML = '<li style="text-align: center">알림이 내역이 없습니다.</li>';
    }
    alram.classList.add("active");
    alramContent.style = "display:block;";
});

alramDeleteAllBtn.addEventListener('click', function () {
    fetch('/index/alram', {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            alramAllInId: sessionStorage.getItem("id")
        })
    })
        .then(response => {
            if (response.status == 204) {
                alert("모두 읽기가 실패했습니다.");
            } else if (response.status == 200) {
                alert("모두 읽기가 성공했습니다.");
                alramSet(sessionStorage.getItem("id"));
                alramContent.style = "display:none";
                alram.classList.remove("active");
                alramMsgList.clear();
            }
        })
});

// 알람 닫기 -- 다른 영역 클릭시 닫힘
document.addEventListener("mouseup", function (e) {
    if (alram.classList.contains("active")) {
        alram.classList.remove("active");
        alramContent.style = "display:none";
    }
});


const illust = document.querySelector('.illust')

illust.addEventListener('click', function () {
    location.href = 'category.html'
    sessionStorage.setItem('selectcategory', 'illust')
})


const live = document.querySelector('.live')
live.addEventListener('click', function () {
    location.href = 'category.html'
    sessionStorage.setItem('selectcategory', 'live')
})


const character = document.querySelector('.character')

character.addEventListener('click', function () {
    location.href = 'category.html'
    sessionStorage.setItem('selectcategory', 'character')
})


const design = document.querySelector('.design')

design.addEventListener('click', function () {
    location.href = 'category.html'
    sessionStorage.setItem('selectcategory', 'design')
})


const video = document.querySelector('.video')
video.addEventListener('click', function () {
    location.href = 'category.html'
    sessionStorage.setItem('selectcategory', 'video')
})


/*------------------------이동------------------------- */

// 여기서 변경된 부분입니다.
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const loginType = getCookie('loginType'); // 쿠키에서 loginType 값을 가져오는 함수

if (loginType === 'SOCIAL') {
    const loginTrueId = getCookie('loginTrueId');
    const loginTrueName = getCookie('loginTrueName');
    const loginTrueIdentity = getCookie('loginTrueIdentity');
    const loginId = getCookie('loginId');
    const nickname = getCookie('nickname');

    if (loginTrueId && loginTrueName && loginTrueIdentity && loginId && nickname) {
        sessionStorage.setItem('id', loginTrueId);
        sessionStorage.setItem('identity', loginTrueIdentity);
        sessionStorage.setItem('loginId', loginId);
        sessionStorage.setItem('nickname', nickname);

        if (loginTrueIdentity == 'GENERAL') {
            sessionStorage.setItem('login-profile-img', './css/icon/login-general.png')
        } else {
            sessionStorage.setItem('login-profile-img', './css/icon/login-author.png')
        }
        sessionStorage.setItem('login-profile-intro', `${loginTrueName}님, 어서오세요`)
        sessionStorage.setItem('name', loginTrueName)
// 쿠키 삭제
        document.cookie = 'loginTrueId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'loginTrueName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'loginTrueIdentity=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'loginId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'nickname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        location.reload();
    }
}
const navLogo = document.querySelector('.nav-logo')
navLogo.addEventListener("click", function () {
    location.href = "index.html"
})


const myfage = document.querySelector('.myfage')

if (sessionStorage.getItem('id') === null) {
    myfage.style.display = 'none'
    alram.style.display = 'none'
} else {
    myfage.addEventListener('click', function () {
        location.href = 'myfage.html'
    })
}

const loginProfile = document.querySelector('.login-profile')
const loginProfileImg = document.querySelector('.login-profile-img')
const loginProfileIntro = document.querySelector('.login-profile-intro')
const navCategory = document.querySelector('.nav-category')

if (sessionStorage.getItem('id') === null) {
    loginProfile.style.display = 'none'
    nav.style.padding = '0.4rem 1rem'
    nav.style.margin = '0.5rem'
    navCategory.style.paddingRight = '10rem'
} else {
    nav.style.padding = '0.4rem 1rem'
    nav.style.marginBottom = '0.3rem'
    loginProfile.style.display = 'flex'
    navCategory.style.paddingLeft = '7.5rem'
    loginProfileImg.setAttribute('src', sessionStorage.getItem('login-profile-img'))
    loginProfileIntro.textContent = sessionStorage.getItem('login-profile-intro')
}

const home = document.querySelector('.home')
home.addEventListener("click", function () {
    location.href = "index.html"
})

const logout = document.querySelector('.logout')
if (logout) {
    logout.addEventListener("click", function () {
        if (sessionStorage.getItem("id") !== null) {
            sessionStorage.removeItem("id")
            sessionStorage.removeItem("identity")
            sessionStorage.removeItem('login-profile-img')
            sessionStorage.removeItem('login-profile-intro')
            sessionStorage.removeItem('intro');
            sessionStorage.removeItem('nickname');
            sessionStorage.removeItem('alramList');
            sessionStorage.removeItem('name');
            sessionStorage.removeItem('loginId');
            sessionStorage.removeItem('detailproduct');
            sessionStorage.removeItem('selectcategory');
            sessionStorage.removeItem('chatcurrenttag');

            document.cookie = 'loginType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'joinType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

            login.textContent = 'LOGIN'
            alert('로그아웃 되었습니다.')
            location.href = 'index.html'
        } else {
            location.href = "login.html"
        }
    })
}
