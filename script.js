"use strict";

//* Header
const nav = document.querySelector(".nav");
const products = document.querySelector("#products");
// Add products
const priceTotal = document.querySelector(".price__total");
const countTotal = document.querySelector(".cart__count");
const alertMessage = document.querySelector(".cart__alert");
const cartItems = document.getElementById("cart__items");
// 刪除按鈕是動態新增的，所以一開始會抓不到放到actDeleteBtn()裡面
// const btnDelete = document.querySelectorAll(".btn__delete");
// Cart Modal
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close__modal");
const btnOpenModal = document.querySelector(".cart__btn");
const btnCheckout = document.querySelector(".btn__checkout");

// Sticky navigation
const initialCoords = products.getBoundingClientRect();

// 設定element在切換過渡時為滑順
window.addEventListener("scroll", function () {
  // console.log(window.scrollY); // 目前螢幕的位置
  if (window.scrollY >= initialCoords.top) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
});

// 當網頁加載時，從 localStorage 中讀取購物車資料並顯示
window.onload = function () {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  // 顯示購物車中的商品數量等資訊
  countTotal.textContent = cart.length;
};

// Add product to cart
// 直接和HTML的按鈕連結: onclick="addToCart('name', price)"
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const addToCart = function (name, price) {
  const existItem = cart.find((item) => item.Name === name);
  // console.log(existItem);
  existItem
    ? (existItem.Quantity += 1)
    : cart.push({ Name: name, Price: price, Quantity: 1 });
  // console.log(cart);
  localStorage.setItem("cart", JSON.stringify(cart));

  // countTotal
  countTotal.textContent = cart.length;

  // warning: success
  alertMessage.classList.remove("show__alert");
  setTimeout(function () {
    alertMessage.classList.add("show__alert");
  }, 1000);
};

// 新增商品明細<tbody>資料
const addItemToTable = function () {
  cartItems.innerHTML = ""; //移除舊有的<tbody>資料
  cart.forEach((item, i) => {
    // 將宣告變數放到forEach裡面才不會每按一次購物車就會重複寫cartItems
    const newRow = cartItems.insertRow();
    const index = newRow.insertCell();
    const itemName = newRow.insertCell();
    const unitPrice = newRow.insertCell();
    const quantity = newRow.insertCell();
    const totPrice = newRow.insertCell();
    const deleteBtn = newRow.insertCell();
    index.textContent = i + 1;
    itemName.textContent = item.Name;
    unitPrice.textContent = item.Price;
    // quantity.textContent = item.Quantity;
    // quantity.innerHTML = `<input type="number" min="1" value="${item.Quantity}">`;
    quantity.innerHTML = `<div class="table__quantity"> <button class="btn__count__minus"> - </button> 
    ${item.Quantity} <button class="btn__count__plus"> + </button> </div> `;
    totPrice.textContent = item.Price * item.Quantity;
    deleteBtn.innerHTML = `<button class="btn__delete">X</button>`;
  });
};

// 商品數量增/減/刪除並且重新更新table(透過修改cart[])
//1. 修改<tbody>資料
const resetCart = function () {
  addItemToTable();
  totalPrice();
  // 重新綁定按鈕
  actDeleteBtn();
  actMinusBtn();
  actPlusBtn();
  countTotal.textContent = cart.length; // icon__count
};

//2. 減少商品按鈕
const actMinusBtn = function () {
  const btnMinusList = document.querySelectorAll(".btn__count__minus");
  btnMinusList.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      if (cart[i].Quantity > 1) cart[i].Quantity--;
      resetCart();
      // 將更新後的購物車資料存儲到 localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
    });
  });
};

//3. 增加商品按鈕
const actPlusBtn = function () {
  const btnPlusList = document.querySelectorAll(".btn__count__plus");
  btnPlusList.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      cart[i].Quantity++;
      resetCart();
      localStorage.setItem("cart", JSON.stringify(cart));
    });
  });
};

//4. 刪除商品
const actDeleteBtn = function () {
  const btnDeleteList = document.querySelectorAll(".btn__delete"); // 確保元素存在並且'每個All'是有效的按鈕元素
  // 使用 forEach 遍歷 NodeList，為'每個'按鈕添加點擊事件監聽器
  btnDeleteList.forEach((btn) => {
    btn.addEventListener("click", () => {
      let row = btn.closest("tr"); // 獲取要刪除的行（<tr>）
      if (row) row.remove(); // 從表格中刪除該行
      const indexToDelete = row.cells[0].textContent - 1; // 獲取要刪除的行的索引index
      cart.splice(indexToDelete, 1); // 更新目前的cart[]
      // console.log(cart);
      resetCart();
      localStorage.setItem("cart", JSON.stringify(cart));
    });
  });
};

//5. 計算商品的總價格
const totalPrice = function () {
  let total = 0;
  //?? 不知道為什麼刪除最後一個商品時，價格不會變成0，明明有let total = 0;而且cart已經是空的了，所以這邊多加if判斷式
  if (cart.length !== 0) {
    cart.forEach((item) => {
      const eachPrice = item.Price * item.Quantity;
      total += eachPrice;
      // console.log(eachPrice);
      priceTotal.textContent = total;
      // console.log(priceTotal.textContent);
    });
  } else {
    priceTotal.textContent = 0;
  }
};

// Cart: Modal window
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// btnOpenModal.addEventListener('click', openModal);
btnOpenModal.addEventListener("click", function (e) {
  // console.log('Button clicked');
  e.preventDefault(); //預防預設跳轉至頂部
  openModal();

  addItemToTable();
  actMinusBtn();
  actPlusBtn();
  actDeleteBtn();
  totalPrice();
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

btnCheckout.addEventListener("click", function () {
  alert("Thank you for your purchase!");
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart)); // 將清空後的購物車資料存儲到 localStorage
  addItemToTable();
  totalPrice();
  closeModal();
  countTotal.textContent = cart.length;
});
// Q: 跳轉別的頁面後再點擊回原本頁面結果購物車資料都不見了，如何做到即使網頁重新加載而購物車資料則會被保留。
// A1: 將購物車資料存儲在 Session Storage 中，這樣即使跳轉到其他頁面，購物車資料仍然可以保留。
// A2: URL 參數： 將購物車資料作為 URL 參數傳遞，這樣在跳轉到其他頁面後，可以通過 URL 參數將購物車資料帶回原始頁面。

/*
  //笨笨的嘗試集
  // Detail of products 
   let details = [];
   cart.forEach((item, index) => {
     details.push(`${index + 1}: ${item.Name} * ${item.Quantity}\n`);
   });
   cartItems.textContent = details.join(" "); // join(): 為了不要有逗號

//! 我原本嘗試用find->incliudes->findindex->some，後來還是用find因為我所加入的物品是一個object/array element
const addToCart = function (name, price) {
    // console.log(`I buy ${name} and it costs ${price}.`);
    // const index = cart.findIndex(item => item.itemName === name); // No!!
    if (cart.some(item => item.itemName === name)) {
        cart.push({ itemName: name, itemPrice: price, itemQuantity: 1 });
    }
    else {
        cart.find(name === itemName).itemQuantity += 1;
        // cart.element[0].includes(name)
    }
    // console.log(cart.findIndex(itemName));
    console.log(cart);
};

// Count total price
const total = 0;
cart.forEach(item => {
    const eachPrice = item.itemPrice * item.itemQuantity;
    total += eachPrice;
    // console.log(eachPrice);
    priceTotal.textContent = total;
    console.log(priceTotal.textContent);
});
*/
