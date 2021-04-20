// =============這是swiper===============
const mySwiper = new Swiper('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    speed:1000,
    effect:"horizontal",

  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
  });


// rubxx40734  API
// fy7m4bYPzKYrvMuECEXR38iTclm2  UID 
let data = []
let cardData = []
let total ;
const productList = document.querySelector('.productList')
const productChoose = document.querySelector('.productChoose')
const myshoopingJs = document.querySelector('.myshoopingJs')
const totalPrice = document.querySelector('.totalPrice')

function init(){
    render()
    renderCar()
}
init()

function render(){
    axios.get('https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/rubxx40734/products')
    .then(function(respones){
     data = (respones.data.products)
     getProductList()
  })
}


// 取得產品列表
function getProductList(){
    
    let str = ''
    data.forEach(function(item){
        str+=`<li>
        <div class="img">
          <p class="newLogo">新品</p>
          <img src="${item.images}" alt="">
          <input type="button" class="js-addCard btn" value="加入購物車" data-id='${item.id}'>
        </div>
        <div class="info">
          <p class="item">${item.title}</p>
          <p class="price">NT$${toCurrency(item.origin_price)}</p>
          <p class="sell">NT$${toCurrency(item.price)}</p>
        </div>
      </li>`
    })
    productList.innerHTML = str
}
//篩選家具
productChoose.addEventListener('change',function(e){
    if(e.target.value == '全部'){
        getProductList()
        return
    }
    let str = ''
    data.forEach(function(item){
        if(e.target.value == item.category){
           str+= `<li>
           <div class="img">
             <p class="newLogo">新品</p>
             <img src="${item.images}" alt="">
             <input type="button" class="js-addCard btn" value="加入購物車" data-id='${item.id}'>
           </div>
           <div class="info">
             <p class="item">${item.title}</p>
             <p class="price">NT$${item.origin_price}</p>
             <p class="sell">NT$${item.price}</p>
           </div>
         </li>`
        }
    })
    productList.innerHTML = str
})
//取得購物車
function renderCar(){
    axios.get('https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/rubxx40734/carts')
  .then(function(respones){
      cardData = (respones.data.carts)
      total = (respones.data.finalTotal)
      renderfinalTotal()
      renderCarList()
  })
}
function renderCarList(){
    let str = ''
   cardData.forEach(function(item){
       str+=` <tr>
       <td>
         <div class="myshooping-item">
          <img src="${item.product.images}" alt="">
          <p>${item.product.title}</p>
         </div>
       </td>
       <td class="setting">NT$ ${toCurrency(item.product.price)}</td>
       <td class="setting">${item.quantity}</td>
       <td class="setting">NT$${toCurrency(item.product.price*item.quantity)}</td>
       <td><input type="button" class="deleteSelf" data-id="${item.id}" value='刪除'></td>
     </tr>`
   })
   myshoopingJs.innerHTML = str
}
//取得總價格
function renderfinalTotal(){
    totalPrice.innerHTML = `<p>總金額</p>
    <p>NT $ ${toCurrency(total)}</p>`
}
//刪除所有品項
const deleteALL = document.querySelector('.deleteALL')

deleteALL.addEventListener('click',function(e){
    axios.delete('https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/rubxx40734/carts')
      .then(function(response){
          alert('購物車刪除成功')
          renderCar()
      })
      .catch(function(erroe){
          alert('購物車已經沒資料了!')
      })
})

//刪除特定品項
myshoopingJs.addEventListener('click',function(e){

    let cardId = (e.target.getAttribute('data-id'))
     if(cardId == null){
         return
     }
    axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/rubxx40734/carts/${cardId}`)
      .then(function(respones){
          alert('刪除成功!')
          renderCar()
      })
})

// 新增購物車 (老師寫的)
// productList.addEventListener('click',function(e){
//     let productId = e.target.getAttribute('data-id')
//     if(productId == null){
//         return
//     }
//     addCartItem(productId);
// })
// function addCartItem(id){
//     let numCheck = 1;
//     cardData.forEach(function(item){
//       if (item.product.id === id) {
//         numCheck = item.quantity += 1;
//       }
//     })
//     axios.post(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/rubxx40734/carts`,{
//       data: {
//         "productId": id,
//         "quantity": numCheck
//       }
//     }).
//       then(function (response) {
//         alert("加入購物車成功");
//         renderCar();
//       })
  
//   }
productList.addEventListener('click',function(e){
 let cardId = (e.target.getAttribute('data-id'))
 if (cardId == null){
   return
 }
   let numCheck = 1
  cardData.forEach(function(item){
    if(cardId === item.product.id){
      numCheck = item.quantity+=1
    }
  })
  axios.post('https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/rubxx40734/carts',{
    "data": {
      "productId": cardId,
      "quantity": numCheck
    }
  })
  .then(function(respones){
    alert('新增成功')
    renderCar()
  })
})

// 訂單送出
const send = document.querySelector('.send')

send.addEventListener('click',function(e){
    e.preventDefault()
    if(cardData.length == 0){
      alert('您購物車是空的')
      return
    }
    const person = document.querySelector('.person-js')
    const phone = document.querySelector('.phone-js')
    const email = document.querySelector('.email-js')
    const local = document.querySelector('.local-js')
    const money = document.querySelector('.money-js')
    if(person.value ==''|| phone.value ==''||email.value ==''||local.value ==''){
      alert('請把資料填寫齊全!')
      return
    }
    axios.post('https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/rubxx40734/orders',{
      "data": {
        "user": {
          "name": person.value,
          "tel": phone.value,
          "email": email.value,
          "address": local.value,
          "payment": money.value
        }
      }
    })
    .then(function(respones){
      alert('訂單送出成功!!')
      person.value ='';
      phone.value =''
      email.value =''
      local.value =''
      money.value = 'ATM'
      renderCar()
    })
    .catch(function(error){
      console.log(error);
    })
  })

// util js
function toCurrency(num){
  var parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}