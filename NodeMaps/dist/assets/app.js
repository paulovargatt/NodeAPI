window.onload = () => {
    let card = document.querySelector('#card');
    let button = document.querySelector('.btn-add');

    button.addEventListener('click', save);
    read();
};

var  grids = document.querySelector('.grids');

function templateCard(address, image) {
    return `
    <div class="col m3">
       <div class="card">
     <div class="card-image waves-effect waves-block waves-light">
       <img class="activator" src="${image}">
          </div>
             <div class="card-content">
                    <p>${address}</p>
             </div>
          <div class="card-reveal">
              <span class="card-title grey-text text-darken-4">Card Title<i class="material-icons right">close</i></span>
              <p>${address}</p>
          </div>
            </div>
        </div>
`
}

function read() {
    axios
        .get("/all")
        .then(response => {
            response.data.forEach(element => {
                let grid = templateCard(element.address, element.image);
                card.innerHTML += grid;
            });
        })
        .catch(error => {

        });
}

function save() {
    if(!navigator.geolocation){
        alert('Browser não suporta geolocalização. Atualize');
        return
    }

    navigator.geolocation.getCurrentPosition(success, error, {
       enableHighAccuracy: true
    });
    
    function success(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const spinner = document.querySelector('.spiner-position');
        spinner.classList.add('active');

        axios
            .post("/geocode",{lat,lng})
            .then(response => {
                let card = templateCard(response.data.address, response.data.image);
                card.innerHTML += card;
                grids.innerHTML = '';
                read();
                spinner.classList.remove('active');
            })
            .catch(error => {
                spinner.classList.remove('active');
            });
    }

    function error(err) {
        alert(err)
    }

}