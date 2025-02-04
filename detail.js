// 로컬스토리지에 담을 배열 생성
let newCart = [];

const mainContainer = document.querySelector(".mainContainer");

// header.html, footer.html 가져오기
const header = document.querySelector("header");
const footer = document.querySelector("footer");

// id가 같은 item 상세페이지 보여주기 + cart 로컬스토리지 누적 + 장바구니 UI + await fetch
const getData = async () => {
  // fetch 처리 이후 다음 코드 실행(async, await)
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

  // 1. id가 같은 item 상세페이지 보여주기
  let newLang = JSON.parse(localStorage.getItem("userInfo"));

  // 쿼리스트링에서 id값만 가져오기
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  // URL id와 같은 id만 return
  const detailData = newLang.filter((x) => {
    if (x.id == id) {
      return x;
    }
  });
  // filter된 data로 html생성
  const showData = detailData.map((x) => {
    x.price = Number(x.price);
    let localPrice = x.price.toLocaleString("ko-KR");

    return `<div class="mainContainer_img">
            <img src="${x.img}" alt="keyboard_detail">
          </div>
          <div class="mainContainer_cont">
            <div class="mainContainer_cont01">
              <p class="goodsName">${x.name}</p>
              <p class="goodsPrice">${localPrice}<span>원</span></p>
              <p class="goodsCont">${x.detail}</p>
            </div>
            <div class="goodsbtn">
              <button class="gift" onclick="deleteBoard()">선물하기</button>
              <button class="addCart" onclick="addToCart(${x.id})">장바구니 담기</button>
              <button class="buyNow_btn" onclick="deleteBoard()">바로 구매하기</button>
            </div>
          </div>`;
  });
  mainContainer.innerHTML = showData;

  // 2. cart 로컬스토리지 data 누적
  if (localStorage.getItem("cart") !== null) {
    console.log("장바구니 data 있음");
    let newLangCart = JSON.parse(localStorage.getItem("cart"));
    // console.log(newLangCart);
    newCart.push(...newLangCart);
  } else {
    console.log("장바구니 data 없서요");
    // localStorage.setItem("cart", JSON.stringify([]));
  }

  // 3. header 장바구니 UI
  const cartCount = document.querySelector(".cartCount");
  const cartCountSpan = document.querySelector(".cartCount > span");
  // const newCartCal = newCart.reduce((acc, item) => acc + Number(item.count), 0); // 중복아이템까지 count할 경우

  const newCartCal = newCart.length;
  // console.log(typeof newCart); // object

  if (newCartCal > 0) {
    cartCount.style.display = "inline-block";
    cartCountSpan.textContent = newCartCal;
  } else {
    cartCount.style.display = "none";
  }
};
window.addEventListener("load", getData);

// 장바구니 로컬스토리지에 담기
const addToCart = (id) => {
  // 알림창
  Swal.fire({
    title: "장바구니에 담았습니다.",
    text: "",
    icon: "success",
  });

  // 장바구니 담기 눌렀는데 cart로컬스토리지가 없을때 빈 배열 추가
  // 빈 배열은 밑에서 filter실행 시 null이면 안돌아가서 추가한 것
  if (localStorage.getItem("cart") == null) {
    localStorage.setItem("cart", JSON.stringify([]));
  }

  // 장바구니 UI
  const cartCount = document.querySelector(".cartCount");
  const cartCountSpan = document.querySelector(".cartCount > span");
  let itemCount = Number(cartCountSpan.textContent); // 0

  // 이미 장바구니에 있다 -> cart 로컬스토리지에서 같은 id값 찾아서 count++
  // 장바구니에 없다 -> userInfo 로컬스토리지의 데이터를 cart에 추가
  let newItem = JSON.parse(localStorage.getItem("cart"));

  let existItem = newItem.filter((x) => x.id == id);
  console.log(existItem.length);

  if (existItem.length > 0) {
    // 장바구니에 item이 이미 있을때
    const cartItem = newItem.map((x) => {
      if (x.id == id) {
        x.count += 1;
      }
      return x;
    });
    newCart = cartItem;
    localStorage.setItem("cart", JSON.stringify(newCart));

    // 장바구니 UI
    // itemCount += 1; // 중복아이템까지 count할 경우
  } else {
    // 장바구니에 item이 없을때
    let newLang = JSON.parse(localStorage.getItem("userInfo"));
    const extractData = newLang.filter((x) => x.id == id);
    const plusCount = extractData.map((x) => {
      x.count++;
      return x;
    });

    newCart.push(...plusCount);
    localStorage.setItem("cart", JSON.stringify(newCart));

    // 장바구니 UI
    itemCount += 1;
  }

  if (itemCount > 0) {
    cartCount.style.display = "inline-block";
    cartCountSpan.textContent = itemCount;
  } else {
    cartCount.style.display = "none";
  }
};

// 준비중입니다. - SweetAlert2
function deleteBoard() {
  Swal.fire({
    title: "준비중 입니다.",
    text: "",
    icon: "warning",
  });
}
