install dependencies:
```
npm i
cd client && npm i && cd ..
```

Run the application:
```
npm start
```

Todo:
* make current location dynamic? now its hard-coded as office in both API and map center
* add refresh button or setInterval to refresh api call to keep driver locations updated?
* add bearing, eta and driver_id info on UI?
* user zoom-out might show lesser cars, slider to reflect?
* add tests