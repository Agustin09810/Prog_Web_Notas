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

async function mockGet(){
    let content = await fetch(`https://jsonplaceholder.typicode.com/posts`).then(response => response.json());
    content = content.map(element => element.title);
    const date = getActualDate();
    arrCards ={};
    
    for(let i = 0; i < 6; i++){
        let citySelectedKey = Math.floor(Math.random() * 10);
        const citiesToSelect = Object.keys(cities)[citySelectedKey];
        const minutes = Math.floor(Math.random() * 60);
        const hour = Math.floor(Math.random() * 24);
        const completeHour = hour + ":" + minutes;
        const nuevaID = ultimoID()+1;
        let temp =  await getTemp(hour, date, citiesToSelect);
        arrCards[i] = ultimaCol().insertAdjacentHTML('afterend', '<div class="col-md-4" id ="col-'+nuevaID+'"><div class="card mt-3" id ="'+nuevaID+'"><div class="card-body" id="cBody'+nuevaID+'" data-bs-toggle="modal" data-bs-target="#modal-editar" onclick="editarNota(this.id)"><p class="card-text" id="cText'+nuevaID+'">'+content[0]+'</p></div> <div><label>Ciudad: '+ citiesToSelect +'</label></div> <div><label>Temperatura: '+ temp +' °C</label></div> <div><label>Fecha: '+ date +'</label></div> <div><label>Hora: '+ completeHour +'</label></div> <div class="card-footer"><div class="d-flex flex-row-reverse"><img class="papelera" id="cFoot'+nuevaID+'" src="trash.png" data-bs-toggle="modal" data-bs-target="#modal-eliminar" onclick="eliminarNota(this.id)"> </div></div></div></div>');
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

//ultimaCol().insertAdjacentHTML('afterend', '<div class="col-md-4" id ="col-'+nuevaID+'"><div class="card mt-3" id ="'+nuevaID+'"><div class="card-body" id="cBody'+nuevaID+'" data-bs-toggle="modal" data-bs-target="#modal-editar" onclick="editarNota(this.id)"><p class="card-text" id="cText'+nuevaID+'">'+texto+'</p></div> <div><label>Ciudad: '+ city +'</label></div> <div><label>Temperatura: '+ temp +' °C</label></div> <div><label>Fecha: '+ date +'</label></div> <div><label>Hora: '+ hora +'</label></div> <div class="card-footer"><div class="d-flex flex-row-reverse"><img class="papelera" id="cFoot'+nuevaID+'" src="trash.png" data-bs-toggle="modal" data-bs-target="#modal-eliminar" onclick="eliminarNota(this.id)"> </div></div></div></div>');


