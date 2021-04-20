let order = []
const BackstageOrderItem = document.querySelector('.BackstageOrder-item')


function init(){
    getOrderList()
}
init()
//取得訂單資料
function getOrderList(){
    axios.get('https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/rubxx40734/orders',{
    headers: {
        'Authorization': `fy7m4bYPzKYrvMuECEXR38iTclm2`
      }
})
  .then(function(respones){
      order = respones.data.orders
      let str = ''
      order.forEach(function(item,index){
          //組產品字串
          let productStr = ''
          item.products.forEach(function(productItem){
              productStr+=`<p>${productItem.title}*${productItem.quantity}</p>`
          })
          //組訂單字串
          let productStatus = ''
          if(item.paid == true){
              productStatus = '已處理'
          }else{
              productStatus = '未處理'
          }
          //組訂單日期
          const timeStatus = new Date(item.createdAt*1000)
          let orderTime = `${timeStatus.getFullYear()}/${timeStatus.getMonth()+1}/${timeStatus.getDate()}`
          str+=`<tr>
          <td style="width: 10%;">${item.id}</td>
          <td style="width: 9%;">${item.user.name}<br>${item.user.tel}</td>
          <td style="width: 15%;">${item.user.address}</td>
          <td style="width: 18%;">${item.user.email}</td>
          <td style="width: 24%;">${productStr}</td>
          <td style="width: 10%;">${orderTime}</td>
          <td style="width: 8%;" ><a href="#" data-status=${item.paid} data-id=${item.id} class='orderStatus'>${productStatus}</a></td>
          <td style="width: 8%;"><input type="button" value="刪除" class="deleteSelf-btn js-orderDelete" data-id=${item.id}></td>
      </tr>`
      })
      BackstageOrderItem.innerHTML = str
      renC3Lv2()
  })
 
}


BackstageOrderItem.addEventListener('click',function(e){
    e.preventDefault()
    const targetClass = e.target.getAttribute('class')
    let id = (e.target.getAttribute('data-id'))
    if(targetClass == 'orderStatus'){
    let status = (e.target.getAttribute('data-status'))
    orderStatusItem(status,id)
       return

    }


    if(targetClass == 'deleteSelf-btn js-orderDelete'){
       deleteSelf(id)
       return
    }
})
//修改訂單狀態

function orderStatusItem(status,id){
    console.log(typeof status,id)
    let newStatus;
    if (status == 'true'){
        newStatus = false
    }else{
        newStatus = true
    }
    axios.put('https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/rubxx40734/orders',{
        "data": {
            "id": id,
            "paid": newStatus
          }
    },{
        headers: {
            'Authorization': `fy7m4bYPzKYrvMuECEXR38iTclm2`
          }
    })
    .then(function(respones){
        alert('修改訂單成功')
        console.log(respones)
        getOrderList()
        
    })
} 

//刪除特定資料

function deleteSelf(id){
     axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/rubxx40734/orders/${id}`,{
        headers: {
            'Authorization': `fy7m4bYPzKYrvMuECEXR38iTclm2`
          }
     })
     .then(function(respones){
         alert('刪除單筆成功')
         getOrderList()
     })
}

//刪除全部訂單
const deleteALL = document.querySelector('.deleteALL-item')
deleteALL.addEventListener('click',function(e){
    e.preventDefault()
    axios.delete('https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/rubxx40734/orders',{
        headers: {
            'Authorization': `fy7m4bYPzKYrvMuECEXR38iTclm2`
          }
    })
    .then(function(respones){
        console.log(respones)
        alert('訂單全部刪除成功')
        getOrderList()
    })
})

//整理出C3

function renderC3(){
    console.log(order)
    let orderObj = {}
    order.forEach(function(item){
        item.products.forEach(function(productItem){
            if(orderObj[productItem.title] == undefined){
                orderObj[productItem.title] = productItem.price*productItem.quantity
            }else{
                orderObj[productItem.title] += productItem.price*productItem.quantity
            }
        })
    })
    console.log(orderObj)
    let orderAry = Object.keys(orderObj)
    console.log(orderAry)

    let newData = []
    orderAry.forEach(function(item){
        let add = []
        add.push(item)
        add.push(orderObj[item])
        newData.push(add)
    })
    console.log(newData)
    //圖表生成
    const chart = c3.generate({
        bindto: ".c3Pct",
        data: {
          columns: newData,
          type : 'pie',
        },
        donut: {
          title: "全部地區比例"
        }
      });

}
function renC3Lv2(){
    console.log(order)
    let orderObj = {}
    order.forEach(function(item){
        item.products.forEach(function(productItem){
            if(orderObj[productItem.title] == undefined){
                orderObj[productItem.title] = productItem.price*productItem.quantity
            }else{
                orderObj[productItem.title] += productItem.price*productItem.quantity
            }
        })
    })
    console.log(orderObj)
    let orderAry = Object.keys(orderObj)
    console.log(orderAry)

    let newData = []
    orderAry.forEach(function(item){
        let add = []
        add.push(item)
        add.push(orderObj[item])
        newData.push(add)
    })


    //比大小  把第四名以後加總起來 獨立成其他
    newData.sort(function(a,b){
        return b[1] - a[1]
    })
    console.log(newData)
    // 超過四筆就整理成其他
    if(newData.length >3 ){
        let otherTotal = 0
        newData.forEach(function(item,index){
            if(index >2 ){
                otherTotal += newData[index][1]
            }
        })
        newData.splice(3, newData.length - 1 )
        newData.push(['其他',otherTotal])
    }
    //圖表
    const chart = c3.generate({
        bindto: ".c3Pct",
        data: {
          columns: newData,
          type : 'pie',
        },
        donut: {
          title: "全部地區比例"
        }
      });
}