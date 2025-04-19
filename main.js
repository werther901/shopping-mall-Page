let newArray = [];

// header.html, footer.html 가져오기
const header = document.querySelector("header");
const footer = document.querySelector("footer");

// 로컬스토리지에서 데이터 가져오기
const itemContainer = document.querySelector(".itemContainer");

const getData = async () => {
  // pagination 기능 추가 때문에 redirect
  if (window.location.href == "http://127.0.0.1:5500/main.html") {
    window.location.href = "http://127.0.0.1:5500/main.html?page=1";
  }
  // 1. 로컬스토리지에 저장된 데이터 화면에 표출
  // if (localStorage.length !== 0) {
  if (localStorage.getItem("userInfo") != null) {
    let newLang = JSON.parse(localStorage.getItem("userInfo"));
    newArray.push(...newLang);

    // 저장되어 있는 로컬스토리지 데이터로 items 생성
    const addTr = newArray.map((x) => {
      // 가격 천단위 ',' 추가
      x.price = Number(x.price);
      let localPrice = x.price.toLocaleString("ko-KR");
      // 저장된 '좋아요' 표시
      let addActive = x.like ? "active" : "";

      return `<div class="item01" id="${x.id}">
                <a href="/detail.html?id=${x.id}">
                  <img src="${x.img}" alt="keyboardItem" class="sizeDown">
                </a>
                <div class="itemCont">
                  <div class="itemInfo">
                    <a href="/detail.html?id=${x.id}">${x.name}</a>
                    <p>${localPrice}원</p>
                  </div>
                  <div class="likeGoods">
                    <svg class="${addActive}" onclick="fillLike(${x.id})" id="like" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                  </div>
                </div>
              </div>`;
    });
    // 한 페이지당 15개의 상품 표출
    let currentPage = 1;
    let itemsPerPage = 15;

    // 쿼리스트링 page값 가져오기
    const params = new URLSearchParams(window.location.search);
    const urlPage = params.get("page");
    // console.log(urlPage);

    // pagination - 한 페이지당 15개의 상품 표출
    let startData = (urlPage - 1) * itemsPerPage;
    // console.log(startData);
    let endData = startData + itemsPerPage;
    // console.log(endData);

    const addTr02 = addTr.slice(startData, endData);
    itemContainer.innerHTML = addTr02.join("");

    // pagination
    const pagination = () => {
      const pagination = document.querySelector(".pagination");
      // console.log(newArray.length); // number, 아이템 개수

      // console.log(item01.length); // 15

      // 총 페이지 수
      let totalPage = Math.ceil(newArray.length / itemsPerPage);
      // 화면에 보여질 페이지 그룹
      let showScreen = Math.ceil(urlPage / 5);
      // 화면에 그려질 마지막 페이지
      let lastPage = showScreen * 5;
      if (lastPage > totalPage) lastPage = totalPage;
      // console.log(lastPage)
      // 화면에 그려질 첫번째 페이지
      let firstPage = lastPage - (5 - 1) <= 0 ? 1 : lastPage - (5 - 1); // 1
      // console.log(firstPage)
      let nextPage = lastPage + 1;
      let prevPage = firstPage - 1;

      if (newArray.length <= 15) {
        // 현재 게시물의 개수가 15개 이하이면 pagination 숨기기
        pagination.innerHTML = "";
      }

      // '<<', '<' 생성
      if (prevPage > 0) {
        pagination.innerHTML = `<li class="page">
                                  <a href="/main.html?page=1" id="allPreview">
                                    &lt;&lt;
                                  </a>
                                </li>
                                <li class="page">
                                  <a href="/main.html?page=${prevPage}" id="preview">
                                    &lt;
                                  </a>
                                </li>`;
      }
      // 페이지 수 생성
      for (let i = firstPage; i <= lastPage; i++) {
        pagination.innerHTML += `<li class="page"><a href="/main.html?page=${i}" id="page-${i}">${i}</a></li>`;
      }
      // '>', '>>' 생성
      if (lastPage < totalPage) {
        pagination.innerHTML += `<li class="page">
                                  <a href="/main.html?page=${nextPage}" id="next">
                                    &gt;
                                  </a>
                                </li>
                                <li class="page">
                                  <a href="/main.html?page=${totalPage}" id="allNext">
                                    &gt;&gt;
                                  </a>
                                </li>`;
      }
      // 클릭시 active_02 class추가하여 스타일
      const paginationA = document.querySelector(
        `.pagination .page a#page-${urlPage}`
      );
      paginationA.classList.add("active_02");
    };
    pagination();

    // 2. fetch 처리 이후 다음 코드 실행(async, await)
    const headerRes = await fetch("header.html");
    const headerData = await headerRes.text();
    header.innerHTML = headerData;

    const footerRes = await fetch("footer.html");
    const footerData = await footerRes.text();
    footer.innerHTML = footerData;

    // scroll 내리면 header에 on클래스 추가
    const headerContainer = document.querySelector(".headerContainer");
    // console.log(headerContainer);

    const scrollChange = () => {
      if (window.scrollY > 0) {
        headerContainer.classList.add("on");
      } else {
        headerContainer.classList.remove("on");
      }
    };
    window.addEventListener("scroll", scrollChange);

    // header 장바구니 UI
    const cartCount = document.querySelector(".cartCount");
    const cartCountSpan = document.querySelector(".cartCount > span");
    let newCart = JSON.parse(localStorage.getItem("cart"));

    if (newCart != null) {
      // const newCartCal = newCart.reduce((acc, item) => acc + Number(item.count), 0); // 중복아이템까지 count할 경우

      const newCartCal = newCart.length;
      // console.log(typeof newCart); // object

      if (newCartCal > 0) {
        cartCount.style.display = "inline-block";
        cartCountSpan.textContent = newCartCal;
      } else {
        cartCount.style.display = "none";
      }
    }
  } else {
    console.log("main 데이터 없서요");
    // 아이템 없을때 보여줄 <div> 만들기
    const noItem = `<div class="noItemWrap">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>
            <p class="noSell">판매중인 상품이 없습니다.</p>
            <p class="pleaseInquire">관련 문의사항은 판매자의 연락처로 문의 주시거나 고객센터로 문의해주세요.</p>
          </div>`;

    itemContainer.innerHTML = noItem;

    // 2. fetch 처리 이후 다음 코드 실행(async, await)
    const headerRes = await fetch("header.html");
    const headerData = await headerRes.text();
    header.innerHTML = headerData;

    const footerRes = await fetch("footer.html");
    const footerData = await footerRes.text();
    footer.innerHTML = footerData;

    // scroll 내리면 header에 on클래스 추가
    const headerContainer = document.querySelector(".headerContainer");
    console.log(headerContainer); // null

    const scrollChange = () => {
      if (window.scrollY > 0) {
        headerContainer.classList.add("on");
      } else {
        headerContainer.classList.remove("on");
      }
    };
    window.addEventListener("scroll", scrollChange);
  }
};
window.addEventListener("load", getData);

// 좋아요 버튼 누르면 색깔 채우기
const fillLike = (id) => {
  const like = document.querySelector(
    `.itemContainer > div[id="${id}"] > div.itemCont > div.likeGoods > svg`
  );

  // 좋아요 표시 및 로컬스토리지 변경
  like.classList.toggle("active");

  // 로컬스토리지 like 반전
  const newLang = JSON.parse(localStorage.getItem("userInfo"));
  const likeData = newLang.map((x) => {
    if (x.id == id) {
      x.like = like.classList.contains("active");
    }
    return x;
  });
  newArray = likeData;
  localStorage.setItem("userInfo", JSON.stringify(newArray));
};
