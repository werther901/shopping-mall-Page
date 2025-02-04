let newArray = [];

// header.html, footer.html 가져오기
const header = document.querySelector("header");
const footer = document.querySelector("footer");

// 로컬스토리지 cart data 화면에 뿌려주기
const userTbody = document.querySelector(".userTbody");
const totalAmountContainer = document.querySelector(".totalAmountContainer");

const getData = async () => {
  if (localStorage.getItem("cart") != null) {
    // 1-1. 로컬스토리지 데이터 화면에 표출
    let newLang = JSON.parse(localStorage.getItem("cart"));
    newArray.push(...newLang);

    const addData = newArray.map((x) => {
      // 가격 천단위 ',' 추가
      x.price = Number(x.price);
      let localPrice = x.price.toLocaleString("ko-KR");

      return `<tr id=${x.id} class="tableTr">
                <th scope="row" class="tableImgTitle"><img src="${x.img}" alt="dd"></th>
                <td class="goodsName"><strong>${x.name}</strong></td>
                <td class="goodsPrice">${localPrice}원</td>
                <td class="goodsCount">
                  <input class="countInput" oninput="changeQuan(${x.id})" type="number" value="${x.count}">
                </td>
                <td class="goodsDelete"><img src="./images/trash.svg" alt="delete" class="deleteItem" onclick="deleteData(${x.id})"></td>
              </tr>`;
    });
    userTbody.innerHTML = addData.join("");

    // 1-2. 장바구니 결제금액 계산
    const calcPrice = newLang.reduce((acc, item) => acc + Number(item.price) * Number(item.count), 0);
    // console.log(calcPrice); // 30000
    const commaPrice = calcPrice.toLocaleString("ko-KR");
    // console.log(commaPrice); // 30,000

    const goTotalPrice = document.querySelector(".goTotalPrice");
    const goTotalPrice_02 = document.querySelector(".goTotalPrice_02");
    goTotalPrice.textContent = commaPrice;
    goTotalPrice_02.textContent = commaPrice;
  } else {
    console.log("장바구니에 아이템이 없서요");
    const noCartItem = document.querySelector(".noCartItem");

    const noItem = `<div class="noCartItem_01">
              <img src="./images/no_cart_item.svg" alt="no_cart_item" />
              <p>장바구니에 담긴 상품이 없습니다.</p>
            </div>`;

    noCartItem.innerHTML = noItem;
  }

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
    // console.log(newCartCal);

    const newCartCal = newCart.length;
    // console.log(typeof newCart); // object

    if (newCartCal > 0) {
      cartCount.style.display = "inline-block";
      cartCountSpan.textContent = newCartCal;
    } else {
      cartCount.style.display = "none";
    }
  }
};
window.addEventListener("load", getData);

// '휴지통' 아이콘 누르면 테이블 행 + 로컬스토리지 삭제
const deleteData = (id) => {
  // table에서 tr삭제
  const delTr = document.querySelector(`.userTbody > tr[id="${id}"]`);
  // console.log(delTr);
  delTr.remove();

  // 로컬스토리지 삭제
  let newLang = JSON.parse(localStorage.getItem("cart"));

  if (newLang.length > 1) {
    const mapDelTr = newLang.filter((x) => {
      if (x.id != id) {
        // id가 같지 않은 것들만 return 시켰더니 id가 같은 tr은 쏙 빠진 배열이 return됨
        return x;
      }
    });
    newArray = mapDelTr;
    localStorage.setItem("cart", JSON.stringify(newArray));
  } else {
    localStorage.removeItem("cart"); // 로컬스토리지 삭제
    newArray = [];
  }
  // console.log(newLang.length);

  // 장바구니 개수 반영
  const cartCount = document.querySelector(".cartCount");
  const cartCountSpan = document.querySelector(".cartCount > span");
  let newCart = JSON.parse(localStorage.getItem("cart"));

  if (newCart != null) {
    const newCartCal = newCart.reduce((acc, item) => acc + item.count, 0);
    // console.log(newCartCal);

    if (newCartCal > 0) {
      cartCount.style.display = "inline-block";
      cartCountSpan.textContent = newCartCal;
    } else {
      cartCount.style.display = "none";
    }
  } else {
    // cart 로컬스토리지가 사라지면 header span 안보이게
    cartCount.style.display = "none";
  }

  // 최종결제 금액 변경
  const calcPrice = newCart.reduce((acc, item) => acc + Number(item.price) * Number(item.count), 0);
  console.log(calcPrice); // 30000
  const commaPrice = calcPrice.toLocaleString("ko-KR");
  console.log(commaPrice); // 30,000

  const goTotalPrice = document.querySelector(".goTotalPrice");
  const goTotalPrice_02 = document.querySelector(".goTotalPrice_02");
  goTotalPrice.textContent = commaPrice;
  goTotalPrice_02.textContent = commaPrice;
};

// 수량 변경하면 장바구니 개수 변경 + 로컬스토리지 개수 변경 + 총 금액 계산 변경
const changeQuan = (id) => {
  const countInput = document.querySelector(`.userTbody > .tableTr[id="${id}"] > .goodsCount > .countInput`);

  // 로컬스토리지 개수 변경
  let newCart = JSON.parse(localStorage.getItem("cart"));

  const newCount = newCart.map((x) => {
    if (x.id == id) {
      x.count = countInput.value;
    }
    return x;
  });
  newCart = newCount;
  localStorage.setItem("cart", JSON.stringify(newCart));

  // 최종 결제 금액 변경
  const calcPrice = newCart.reduce((acc, item) => acc + Number(item.price) * Number(item.count), 0);
  console.log(calcPrice); // 30000
  const commaPrice = calcPrice.toLocaleString("ko-KR");
  console.log(commaPrice); // 30,000

  const goTotalPrice = document.querySelector(".goTotalPrice");
  const goTotalPrice_02 = document.querySelector(".goTotalPrice_02");
  goTotalPrice.textContent = commaPrice;
  goTotalPrice_02.textContent = commaPrice;

  // header 장바구니 UI 개수 변경(고쳐야함 -> ??? 뭐고쳐야하는지 까먹음)
  const cartCount = document.querySelector(".cartCount");
  const cartCountSpan = document.querySelector(".cartCount > span");
  // const newCartCal = newCart.reduce((acc, item) => acc + Number(item.count), 0); // 중복아이템까지 count할 경우
  // console.log(newCartCal);

  const newCartCal = newCart.length;
  // console.log(typeof newCart); // object

  if (newCartCal > 0) {
    cartCount.style.display = "inline-block";
    cartCountSpan.textContent = newCartCal;
  } else {
    cartCount.style.display = "none";
  }
};

// 장바구니 전체 삭제 버튼
const deleteCart = document.querySelector(".deleteCart");

const deleteAll = () => {
  // table 삭제
  userTbody.innerHTML = "";

  // cart 로컬스토리지 전체삭제
  localStorage.removeItem("cart");

  // header 장바구니 사라지게
  const cartCount = document.querySelector(".cartCount");
  cartCount.style.display = "none";

  // 결제금액 0원
  const goTotalPrice = document.querySelector(".goTotalPrice");
  const goTotalPrice_02 = document.querySelector(".goTotalPrice_02");
  goTotalPrice.textContent = 0;
  goTotalPrice_02.textContent = 0;

  // 장바구니에 담긴 상품이 없습니다.
  const noCartItem = document.querySelector(".noCartItem");

  const noItem = `<div class="noCartItem_01">
              <img src="./images/no_cart_item.svg" alt="no_cart_item" />
              <p>장바구니에 담긴 상품이 없습니다.</p>
            </div>`;

  noCartItem.innerHTML = noItem;
};
deleteCart.addEventListener("click", deleteAll);

// 준비중입니다. - SweetAlert2
const totalBtn = document.querySelector('.totalBtn');

function deleteBoard() {
  Swal.fire({
    title: "준비중 입니다.",
    text: "",
    icon: "warning"
  });
}
totalBtn.addEventListener('click', deleteBoard);