
    const URL = './tso-data-pb.json';

    const model = {
        data: null,
        arrTSO: null,
        userLatitude: null,
        userLongitude: null,

        getUserPosition(){
            navigator.geolocation.getCurrentPosition( result => {
                this.userLatitude = result.coords.latitude;
                this.userLongitude = result.coords.longitude;
                this.loadData();
            }, error => {
                tsoList.innerHTML = error.message;
                console.log('Error', error);
            }, {enableHighAccuracy: true}
            );
        },

        async loadData(){
            this.data = await fetch(URL);
            this.data = await this.data.json();
            this.render();
        },

        haversineFormula(item){
            let toRad = num => num * Math.PI / 180;
            const r = 6371; // Еarth radius in km

            let Lat1 = toRad(this.userLatitude);
            let Lon1 = toRad(this.userLongitude);
            let Lat2 = toRad(item.longitude);
            let Lon2 = toRad(item.latitude);

            let d = 2 * r * Math.asin(Math.sqrt(Math.sin((Lat2 - Lat1) / 2)**2 + Math.cos(Lat1) * Math.cos(Lat2) * Math.sin((Lon2 - Lon1) / 2)**2));

            item.distance = d * 1000;
        },

        getArr(){
            this.data.devices.forEach(item => this.haversineFormula(item));
            this.data.devices.sort((a,b) => a.distance - b.distance);

            this.arrTSO = this.data.devices.slice(0,5);
        },

        render(){
            this.getArr();

            tsoList.innerHTML = this.arrTSO.map(item => `

                <li class="list-group-item">Адреса: ${item.fullAddressUa}
                    <p class="mb-2">Відстань: ${item.distance.toFixed()} м</p>
                </li>
            
            `).join('');

            mapPlace.src = `https://image.maps.api.here.com/mia/1.6/mapview?app_id=oZmMWRV4tAjQmgkxBvF0&app_code=x5pKHqifhw1mnS_zBTIFsA&w=800&h=500&z=15&c=${this.arrTSO[0].longitude},${this.arrTSO[0].latitude}`;
        }

    }

    model.getUserPosition();





    

