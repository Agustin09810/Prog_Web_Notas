var idActual = null;

function ultimaCol(){
    const last = Array.from(document.getElementsByClassName('col-md-4')).pop()
    return last;
}

function ultimoID(){
    const last = Array.from(document.getElementsByClassName('card mt-3')).pop()
    if(last === undefined){
        return 0;
    }
    return parseInt(last.id);
}

function eliminarIDArray(id){
    const indice = cardsArray.indexOf(id);
    cardsArray.splice(indice,1);
}

function agregarIDArray(id){
    cardsArray.push(id);
}

function editarNota(id){
    populateDropdown('CiudadEditar');
    let idTexto = "cText" + id[id.length - 1]
    recuperarTexto(idTexto);
    idActual = idTexto;
    return
}

function recuperarTexto(id){
    let texto = document.getElementById(id).textContent;
    document.getElementById('textoNota').value = texto;
    return
}

function editarNota_aux(){
    let text = document.getElementById('textoNota').value;
    document.getElementById(idActual).textContent = text;
}

async function mockPost(texto, fecha, hora, ciudad, temperatura){

    var result = await fetch('http://localhost:81/note', {
    method: 'POST',
    body: JSON.stringify({
      title: texto,
      date: fecha,
      time: hora,
      city: ciudad,
      temp: temperatura
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  .then((response) => response.json());
  console.log(result);
}

async function agregarNota(){
    let nuevaID = ultimoID()+1;
    document.getElementById('agregarBtnInterior').onclick = async function(e){
        let city = document.getElementById('CiudadAgregar');
        city = city.options[city.selectedIndex].text;
        let texto = document.getElementById('textoAgregar').value;
        let date = document.getElementById('datePicker').value;
        let hora = document.getElementById('timePicker').value;
        let temp =  await getTemp(hora, date, city)
        if (temp === undefined){
            console.log(`temp es undefined`)
        }
        
        mockPost(texto, date, hora, city, temp)
        ultimaCol().insertAdjacentHTML('afterend', '<div class="col-md-4" id ="col-'+nuevaID+'"><div class="card mt-3" id ="'+nuevaID+'"><div class="card-body" id="cBody'+nuevaID+'" data-bs-toggle="modal" data-bs-target="#modal-editar" onclick="editarNota(this.id)"><p class="card-text" id="cText'+nuevaID+'">'+texto+'</p></div> <div><label>Ciudad: '+ city +'</label></div> <div><label>Temperatura: '+ temp +' °C</label></div> <div><label>Fecha: '+ date +'</label></div> <div><label>Hora: '+ hora +'</label></div> <div class="card-footer"><div class="d-flex flex-row-reverse"><img class="papelera" id="cFoot'+nuevaID+'" src="trash.png" data-bs-toggle="modal" data-bs-target="#modal-eliminar" onclick="eliminarNota(this.id)"> </div></div></div></div>');
        
    }
    
}

function eliminarNota(id) {
    const idElemento = "col-"+id.substring(5,id.length);
    console.log(idElemento);
    const elemento = document.getElementById(idElemento);
    const padre = document.getElementById("fila1");
    document.getElementById('eliminarBtnInterior').onclick = function(e){
        padre.removeChild(elemento);
    }
}

function modoNocturno(){
        if(document.getElementById('modoOscuro').checked){
            document.getElementById('navSup').classList.remove('bg-light');
            document.getElementById('navSup').classList.add('bg-secondary');
            document.getElementById('navSup').classList.add('text-white');
            document.getElementById('footer').classList.remove('bg-light');
            document.getElementById('footer').classList.add('bg-secondary');
            document.getElementById('navbar-inf-text').classList.add('text-white');
            document.getElementById('body').classList.add('bg-light');
            document.getElementById('nav-link-a').classList.remove('active');
            document.getElementById('nav-link-a').classList.add('text-white');
            document.getElementById('body').classList.remove('bg-transparent');
            document.getElementById('body').classList.add('bg-dark');
            document.getElementById('switchMN').classList.add('text-white');
            document.getElementById('botonA').classList.remove('btn-outline-dark');
            document.getElementById('botonA').classList.add('btn-outline-light');
        }else{
            document.getElementById('navSup').classList.add('bg-light');
            document.getElementById('navSup').classList.remove('bg-secondary');
            document.getElementById('navSup').classList.remove('text-white');
            document.getElementById('footer').classList.add('bg-light');
            document.getElementById('footer').classList.remove('bg-secondary');
            document.getElementById('navbar-inf-text').classList.remove('text-white');
            document.getElementById('body').classList.remove('bg-light');
            document.getElementById('nav-link-a').classList.add('active');
            document.getElementById('nav-link-a').classList.remove('text-white');
            document.getElementById('body').classList.add('bg-transparent');
            document.getElementById('body').classList.remove('bg-dark');
            document.getElementById('switchMN').classList.remove('text-white');
            document.getElementById('botonA').classList.add('btn-outline-dark');
            document.getElementById('botonA').classList.remove('btn-outline-light');
        }
}

var cities = {
    "Montevideo" : [-34.8941,-56.0675],
    "Lima" : [-12.0931,-77.0465],
    "Santiago de Chile" :  [-33.4691,-70.6420],
    "Washington" : [38.8921,-77.0241],
    "Nueva York" : [40.71,-74.01],
    "Berlin" : [52.52,13.41],
    "Paris" : [48.8567,2.3510],
    "Londres" : [51.5002,-0.1262],
    "Madrid" : [40.4167,-3.7033],
    "Viena" : [48.2092, 16.3728]
}
 
populateDropdown("CiudadAgregar");
function populateDropdown(id) {
    var opciones = document.getElementById(id);
    Object.keys(cities).forEach((clave) => {
        var opt = document.createElement('option');
        opt.textContent = clave;
        opt.value = cities[clave];
        opciones.appendChild(opt);
    });
}


async function getJSONFromFetch(latitude,longitude,day)
{
	const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude='+latitude+'&longitude='+longitude+'&start_date='+day+'&end_date='+day+'&hourly=temperature_2m');
    return await response.json();
}

function getHourFromJSON(hour,json)
{
	 return json.hourly.temperature_2m[hour];
}


async function getTemp(hour, date, city){
    if(!(city in cities)){
        return "The specified city is not valid. Try again.";
    }
    else{
            let realHour = parseInt(hour);
            let lat = cities[city][0];
            let lon = cities[city][1];
            const JSON = await getJSONFromFetch(lat,lon,date);
            const temp = getHourFromJSON(realHour,JSON);
            return temp;
    }

}

function getActualDate(){
    let actualDate = new Date();
    let actualDay = actualDate.getDate();
    let actualMonth = actualDate.getMonth();
    let actualYear = actualDate.getFullYear();

    if(actualMonth < 10){
        actualMonth = "0" + actualMonth;
    }
    if(actualDay < 10){
        actualDay = "0" + actualDay;
    }
    return actualYear + "-" + actualMonth + "-" + actualDay;
} 

async function mockGet(id){
    let content = await fetch(`http://localhost:81/note`).then(response => response.json());
    content = content.map(element => element.title);
    const date = getActualDate();
    arrCards ={};
    

    for(let i = 0; i < content.length; i++){
        let citySelectedKey = Math.floor(Math.random() * 10);
        const citiesToSelect = Object.keys(cities)[citySelectedKey];
        const minutes = Math.floor(Math.random() * 60);
        const hour = Math.floor(Math.random() * 24);
        const completeHour = hour + ":" + minutes;
        const nuevaID = ultimoID()+1;
        let temp =  await getTemp(hour, date, citiesToSelect);
        arrCards[i] = ultimaCol().insertAdjacentHTML('afterend', '<div class="col-md-4" id ="col-'+nuevaID+'"><div class="card mt-3" id ="'+nuevaID+'"><div class="card-body" id="cBody'+nuevaID+'" data-bs-toggle="modal" data-bs-target="#modal-editar" onclick="editarNota(this.id)"><p class="card-text" id="cText'+nuevaID+'">'+content[i]+'</p></div> <div><label>Ciudad: '+ citiesToSelect +'</label></div> <div><label>Temperatura: '+ temp +' °C</label></div> <div><label>Fecha: '+ date +'</label></div> <div><label>Hora: '+ completeHour +'</label></div> <div class="card-footer"><div class="d-flex flex-row-reverse"><img class="papelera" id="cFoot'+nuevaID+'" src="trash.png" data-bs-toggle="modal" data-bs-target="#modal-eliminar" onclick="eliminarNota(this.id)"> </div></div></div></div>');
    }

    return arrCards;
}




