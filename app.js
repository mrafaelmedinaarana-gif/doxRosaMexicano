import { db, collection, addDoc, getDocs, deleteDoc, doc } from "./firebase.js"

let mesaActual=0
let pedido=[]
let total=0
let mesasEstado=[false,false,false,false,false,false,false]

function ocultar(){
document.querySelectorAll(".panel").forEach(p=>p.style.display="none")
}

window.login=()=>{

let u=document.getElementById("user").value
let p=document.getElementById("pass").value

if(
(u==="Mauro" && p==="123") ||
(u==="mesero1" && p==="1234") ||
(u==="mesero2" && p==="1234") ||
(u==="mesero3" && p==="1234")
){

document.getElementById("login").style.display="none"
document.getElementById("panel").style.display="block"

crearMesas()

}else{

alert("Usuario incorrecto")

}

}

window.logout=()=>{
location.reload()
}

window.abrirMesas=()=>{
ocultar()
document.getElementById("mesasPanel").style.display="block"
}

window.volverPanel=()=>{
ocultar()
document.getElementById("panel").style.display="block"
}

window.volverMesas=()=>{
ocultar()
document.getElementById("mesasPanel").style.display="block"
}

function crearMesas(){

let cont=document.getElementById("mesas")

cont.innerHTML=""

for(let i=1;i<=7;i++){

let estado=mesasEstado[i-1]?"ocupada":"libre"

cont.innerHTML+=`
<div class="mesa ${estado}" onclick="abrirMesa(${i})">
Mesa ${i}
</div>
`

}

}

window.abrirMesa=async(num)=>{

mesaActual=num
pedido=[]
total=0

mesasEstado[num-1]=true

crearMesas()

document.getElementById("mesaTitulo").innerText="Mesa "+num

ocultar()
document.getElementById("comanda").style.display="block"

cargarMenu()

}

async function cargarMenu(){

let cont=document.getElementById("menu")
cont.innerHTML=""

const querySnapshot = await getDocs(collection(db,"platillos"))

querySnapshot.forEach((docu)=>{

let data=docu.data()

cont.innerHTML+=`

<div class="platillo" onclick="agregarPedido('${data.nombre}',${data.precio})">

<span>${data.nombre}</span>

<span>$${data.precio}</span>

</div>

`

})

}

window.agregarPedido=(nombre,precio)=>{

pedido.push({nombre,precio})

total+=precio

renderPedido()

}

function renderPedido(){

let cont=document.getElementById("pedido")

cont.innerHTML=""

pedido.forEach(p=>{
cont.innerHTML+=`<div>${p.nombre} $${p.precio}</div>`
})

document.getElementById("total").innerText=total

}

window.cerrarMesa=async()=>{

mesasEstado[mesaActual-1]=false

await addDoc(collection(db,"ventas"),{
mesa:mesaActual,
pedido:pedido,
total:total,
fecha:new Date().toISOString()
})

crearMesas()

alert("Venta guardada")

volverMesas()

}

window.imprimir=()=>{

let fecha=new Date()

let ticketHTML=`

<div class="ticket">

<center>

<b>ROSA MEXICANO</b><br>
Cocina Mexicana<br>

RFC: AAHR771117LJ7<br>

C. Tuxtla Gutiérrez 1222 Local 14<br>
Mexicali B.C.<br>

Tel: 6865554664<br>

Mesa ${mesaActual}<br>

${fecha.toLocaleString()}

</center>

<hr>

`

pedido.forEach(p=>{
ticketHTML+=`${p.nombre} $${p.precio}<br>`
})

ticketHTML+=`

<hr>

<b>TOTAL $${total}</b>

<br><br>

<center>

Gracias por su visita<br>
Escanea el QR ⭐

<div id="qrcode"></div>

</center>

</div>

`

document.getElementById("ticket").innerHTML=ticketHTML

new QRCode(document.getElementById("qrcode"),{
text:"https://share.google/O7ulwfIVxuKicPYmN",
width:120,
height:120
})

setTimeout(()=>{window.print()},500)

}

window.abrirAdmin=()=>{
ocultar()
document.getElementById("admin").style.display="block"
cargarPlatillosAdmin()
}

window.agregarPlatillo=async()=>{

let nombre=document.getElementById("nombrePlatillo").value
let precio=parseFloat(document.getElementById("precioPlatillo").value)

await addDoc(collection(db,"platillos"),{
nombre:nombre,
precio:precio
})

cargarPlatillosAdmin()

}

async function cargarPlatillosAdmin(){

let cont=document.getElementById("listaPlatillos")
cont.innerHTML=""

const querySnapshot = await getDocs(collection(db,"platillos"))

querySnapshot.forEach((docu)=>{

let data=docu.data()

cont.innerHTML+=`

<div class="platillo">

${data.nombre} $${data.precio}

<button onclick="eliminarPlatillo('${docu.id}')">Eliminar</button>

</div>

`

})

}

window.eliminarPlatillo=async(id)=>{

await deleteDoc(doc(db,"platillos",id))

cargarPlatillosAdmin()

}

window.abrirReportes=async()=>{

ocultar()

document.getElementById("reportes").style.display="block"

let cont=document.getElementById("reporteVentas")

cont.innerHTML=""

let totalDia=0

const querySnapshot = await getDocs(collection(db,"ventas"))

querySnapshot.forEach((docu)=>{

let data=docu.data()

totalDia+=data.total

cont.innerHTML+=`

<div>

Mesa ${data.mesa}  
$${data.total}

</div>

`

})

cont.innerHTML+=`<h2>Total del día $${totalDia}</h2>`

}