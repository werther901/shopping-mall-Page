const id = document.querySelector(".id");
const names = document.querySelector(".name");
const price = document.querySelector(".price");
const detail = document.querySelector(".detail");
const saveData = document.querySelector(".saveData");
const inputData = document.querySelector(".inputData");

const content01 = document.querySelector(".content01");
const content02 = document.querySelector(".content02");
const content03 = document.querySelector(".content03");
const content04 = document.querySelector(".content04");

// 로컬스토리지 저장
let newArray = [];
// 이미지 url 배열 저장
let images = [
  "./images/main_keyboard_01.jpg",
  "./images/main_keyboard_02.jpg",
  "./images/main_keyboard_03.jpg",
  "./images/main_keyboard_04.jpg",
  "./images/main_keyboard_05.jpg",
  "./images/main_keyboard_06.jpg",
  "./images/main_keyboard_07.jpg",
  "./images/main_keyboard_08.jpg",
  "./images/main_keyboard_09.jpg",
  "./images/main_keyboard_10.jpg",
  "./images/main_keyboard_11.jpg",
  "./images/main_keyboard_12.jpg",
  "./images/main_keyboard_13.jpg",
  "./images/main_keyboard_14.jpg",
  "./images/main_keyboard_15.jpg",
  "./images/main_keyboard_16.jpg",
  "./images/main_keyboard_17.jpg",
  "./images/main_keyboard_18.jpg",
  "./images/main_keyboard_19.jpg",
  "./images/main_keyboard_20.jpg",
];

// 로컬스토리지에 저장된 데이터 불러오기
window.onload = function () {
  if (localStorage.length !== 0) {
    let newLang = JSON.parse(localStorage.getItem("userInfo"));
    newArray.push(...newLang);

    // 저장되어있는 로컬스토리지 데이터로 table 생성
    const addTr = newArray.map((x) => {
      x.price = Number(x.price);
      let localPrice = x.price.toLocaleString("ko-KR");

      return `<tr id="${x.id}" class="sortTr">
          <td class="imgCont"><img src="${x.img}" alt="keyboard_${x.id}" class="sizeDown"></td>
          <td class="nameCont">${x.name}</td>
          <td class="priceCont">${localPrice}</td>
          <td class="detailCont">${x.detail}</td>
          <td>
            <button data-id="${x.id}" class="correctBtn" onclick="correctData('${x.id}')">수정</button>
            <button class="delTr" onclick="deleteData(${x.id})">삭제</button>
          </td>
        </tr>`;
    });
    inputData.innerHTML = addTr.join("");

    // table을 csv파일로 다운로드
    const download = document.querySelector(".download");
    const tableCustom = document.querySelector(".tableCustom");
    // 데이터 저장할 변수 선언
    let csvContent = "\uFEFF";

    // 테이블 헤더 추출
    const headers = Array.from(tableCustom.querySelectorAll("th"))
      .map((th) => th.innerText)
      .join(",");

    csvContent += headers + "\n";

    // 테이블 행 데이터 추출
    const rows = Array.from(tableCustom.querySelectorAll("tbody tr"));
    rows.forEach((row) => {
      const rowData = Array.from(row.querySelectorAll("td"))
        .map((td) => td.innerText.replace(/,/g, ""))
        .join(",");

      csvContent += rowData + "\n";
      // console.log(csvContent)
    });

    // Blob 생성
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

    // 파일 다운로드 함수
    const fileDownload = () => {
      const downloadUrl = window.URL.createObjectURL(blob);
      console.log(downloadUrl);
      download.href = downloadUrl;
      download.download = "registration.csv";
    };
    download.addEventListener("click", fileDownload);

  } else {
    console.log("데이터 없서요");
  }
};

// 유효성 체크 변수 생성
let idTrue = false;
let priceTrue = false;
let detailTrue = false;

// input eventListener로 유효성 검사
const allDataInspect = () => {
  // id 검사
  const idCheck = (e) => {
    const idInspect = newArray.filter((x) => x.id == e.target.value);
    if (idInspect.length > 0) {
      content01.innerHTML = "";
      content01.innerHTML += `<div>중복된 id입니다. 다시 입력해주세요.</div>`;
      idTrue = false;
    } else if (id.value === "") {
      content01.innerHTML = "";
      content01.innerHTML += `<div>아이디를 입력해주세요.</div>`;
      idTrue = false;
    } else {
      content01.innerHTML = "";
      idTrue = true;
    }
  };
  id.addEventListener("input", idCheck);

  // 상품명 검사
  const namesCheck = () => {
    if (names.value === "") {
      content02.innerHTML = "";
      content02.innerHTML += `<div>상품명을 입력해주세요.</div>`;
    } else {
      content02.innerHTML = "";
    }
  };
  names.addEventListener("input", namesCheck);

  // 가격 검사
  const priceCheck = () => {
    if (price.value === "") {
      content03.innerHTML = "";
      content03.innerHTML += `<div>가격을 입력해주세요.</div>`;
      priceTrue = false;
    } else {
      content03.innerHTML = "";
      priceTrue = true;
    }
  };
  price.addEventListener("input", priceCheck);

  // 상세내용 검사
  const contCheck = () => {
    if (detail.value === "") {
      content04.innerHTML = "";
      content04.innerHTML += "<div>내용을 입력해주세요.</div>";
      detailTrue = false;
    } else {
      content04.innerHTML = "";
      detailTrue = true;
    }
  };
  detail.addEventListener("input", contCheck);

  // 실시간 검증이 모두 true이면 button disabled 없앰
  const ifTrue = () => {
    if (idTrue && priceTrue && detailTrue) {
      saveData.disabled = false;
    } else {
      saveData.disabled = true;
    }
  };
  id.addEventListener("change", ifTrue);
  price.addEventListener("change", ifTrue);
  detail.addEventListener("change", ifTrue);
};
allDataInspect();

// '저장' 버튼 누르면 로컬스토리지 및 tr 추가
let localStorageSave = () => {
  // let newLang02 = JSON.parse(localStorage.getItem("userInfo"));
  // 이미지 랜덤 뽑기
  const randomImages = images[Math.floor(Math.random() * images.length)];

  if (idTrue && priceTrue && detailTrue) {
    let userInfo = {
      id: id.value,
      img: randomImages,
      name: names.value,
      price: price.value,
      detail: detail.value,
      like: false,
      count: 0,
    };
    // 로컬스토리지에 데이터 추가
    // let pushData = newArray.push(userInfo);

    newArray.push(userInfo);

    console.log(newArray);
    localStorage.setItem("userInfo", JSON.stringify(newArray));

    // input value 비우기
    id.value = "";
    names.value = "";
    price.value = "";
    detail.value = "";

    // 다시 false로
    idTrue = false;
    priceTrue = false;
    detailTrue = false;
  }

  // table에 data 추가
  const addTr = newArray.map((x) => {
    x.price = Number(x.price);
    let localPrice = x.price.toLocaleString("ko-KR");

    return `<tr id="${x.id}" class="sortTr">
          <td class="imgCont"><img src="${x.img}" alt="keyboard_${x.id}" class="sizeDown"></td>
          <td class="nameCont">${x.name}</td>
          <td class="priceCont">${localPrice}</td>
          <td class="detailCont">${x.detail}</td>
          <td>
            <button data-id="${x.id}" class="correctBtn" onclick="correctData('${x.id}')">수정</button>
            <button class="delTr" onclick="deleteData(${x.id})">삭제</button>
          </td>
        </tr>`;
  });

  inputData.innerHTML = addTr.join("");

  // 저장 버튼 다시 막히게
  saveData.disabled = true;
};
saveData.addEventListener("click", localStorageSave);

// '수정' 유효성 체크 변수 생성
let nameTrue02 = true;
let priceTrue02 = true;
let detailTrue02 = true;

// '수정' 버튼 누르면 table 내용 + 로컬스토리지 수정
const correctData = (id) => {
  // 로컬스토리지에서 내용 수정하려고 꺼냄
  let newLang = JSON.parse(localStorage.getItem("userInfo"));

  // filter쓸 때 typeof 잘 확인
  // const correctArray = newLang.filter((x) => x.id === id);

  // 정적요소를 이용하여 동적요소 선택
  const nameCont = document.querySelector(`.inputData > tr[id="${id}"] > td.nameCont`);
  const priceCont = document.querySelector(`.inputData > tr[id="${id}"] > td.priceCont`);
  console.log(priceCont);
  const detailCont = document.querySelector(`.inputData > tr[id="${id}"] > td.detailCont`);
  const correctBtn = document.querySelector(`.inputData > tr[id="${id}"] > td > button[data-id="${id}"]`);

  if (correctBtn.textContent === "수정") {
    correctBtn.textContent = "수정완료";
    // name input 생성
    const nameElem = document.createElement("input");
    nameElem.value = nameCont.textContent;

    nameCont.innerHTML = "";
    nameCont.appendChild(nameElem);
    const name_input = document.querySelector(`.inputData > tr[id="${id}"] > td.nameCont > input`);
    // name 없으면 표시할 div 생성
    const nameDiv = document.createElement("div");

    // price input 생성
    const priceElem = document.createElement("input");
    priceElem.setAttribute("type", "number");
    // 문자열 전체에서 ','찾는 정규식 추가 후 value로 추가
    const replacePriceCont = priceCont.textContent.replace(/,/g, "");
    priceElem.value = replacePriceCont;

    priceCont.innerHTML = "";
    priceCont.appendChild(priceElem);
    const price_input = document.querySelector(`.inputData > tr[id="${id}"] > td.priceCont > input`);
    // price 없으면 표시할 div 생성
    const priceDiv = document.createElement("div");

    // detail input 생성
    const detailElem = document.createElement("input");
    detailElem.value = detailCont.textContent;
    detailElem.classList.add("edit-input"); // 필요있음?
    // detailCont html지우고 그 자리에 input 추가
    detailCont.innerHTML = "";
    detailCont.appendChild(detailElem);
    const detail_input = document.querySelector(`.inputData > tr[id="${id}"] > td.detailCont > input`);
    // detail 없으면 표시할 div생성
    const inputDiv = document.createElement("div");

    // name 비어있는지 체크
    const nameCheck = () => {
      if (name_input.value !== "") {
        nameDiv.remove();
        nameTrue02 = true;
      } else {
        nameCont.appendChild(nameDiv);
        nameDiv.innerText = "상품명을 입력해주세요.";
        nameTrue02 = false;
      }
    };
    nameElem.addEventListener("input", nameCheck);

    // price 비어있는지 체크
    const priceCheck = () => {
      if (price_input.value === "") {
        priceCont.appendChild(priceDiv);
        priceDiv.innerText = "가격을 입력해주세요.";
        priceTrue02 = false;
      } else {
        priceDiv.remove();
        priceTrue02 = true;
      }
    };
    priceElem.addEventListener("input", priceCheck);

    // detail 비어있는지 체크
    const detailCheck = () => {
      if (detail_input.value == "") {
        detailCont.appendChild(inputDiv);
        inputDiv.innerText = "내용을 입력해주세요.";
        detailTrue02 = false;
      } else {
        inputDiv.remove();
        detailTrue02 = true;
      }
    };
    detail_input.addEventListener("input", detailCheck);

    // 모두 true이면 disabled 풀기
    const ifTrue02 = () => {
      if (nameTrue02 && priceTrue02 && detailTrue02) {
        correctBtn.disabled = false;
      } else if (!nameTrue02 || !priceTrue02 || !detailTrue02) {
        correctBtn.disabled = true;
      }
    };
    name_input.addEventListener("input", ifTrue02);
    price_input.addEventListener("input", ifTrue02);
    detail_input.addEventListener("input", ifTrue02);
  } else if (correctBtn.textContent === "수정완료") {
    correctBtn.textContent = "수정";
    // const detail_input = document.querySelector(".edit-input");
    const name_input = document.querySelector(`.inputData > tr[id="${id}"] > td:nth-child(2) > input`);
    const price_input = document.querySelector(`.inputData > tr[id="${id}"] > td:nth-child(3) > input`);
    const detail_input = document.querySelector(`.inputData > tr[id="${id}"] > td:nth-child(4) > input`);

    // textContent가 원래 있던 input을 덮음
    detailCont.textContent = detail_input.value;
    priceCont.textContent = Number(price_input.value).toLocaleString("ko-KR");
    nameCont.textContent = name_input.value;
    // 로컬스토리지 내용 수정
    const mapCorrectArray = newLang.map((x) => {
      if (x.id === id) {
        return {
          id: x.id,
          img: x.img,
          name: name_input.value,
          price: price_input.value,
          detail: detail_input.value,
          like: x.like,
          count: x.count,
        };
      }
      return x;
    });
    newArray = mapCorrectArray;
    localStorage.setItem("userInfo", JSON.stringify(newArray));
  }
};

// '삭제' 버튼 누르면 테이블 행 + 로컬스토리지 삭제
const deleteData = (id) => {
  // table에서 tr삭제
  const delTr = document.querySelector(`.inputData > tr[id="${id}"]`);
  // console.log(delTr);
  delTr.remove();

  // 로컬스토리지 삭제
  let newLang = JSON.parse(localStorage.getItem("userInfo"));

  if (newLang.length > 1) {
    const mapDelTr = newLang.filter((x) => {
      if (x.id != id) {
        // id가 같지 않은 것들만 return -> id가 같은 tr은 쏙 빠진 배열이 return됨
        return x;
      }
    });
    newArray = mapDelTr;
    localStorage.setItem("userInfo", JSON.stringify(newArray));
  } else {
    localStorage.removeItem("userInfo"); // 로컬스토리지 삭제
    newArray = [];
  }
  // console.log(newLang.length);
};
