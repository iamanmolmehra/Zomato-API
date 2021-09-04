const express = require('express');
const ejs = require('ejs')
const zomato = require("zomato")
const bodyParser = require('body-parser')
const app = express()
app.use(express.static(__dirname + '/view'))
const client = zomato.createClient({ userKey: '70f1de8cd147f576208e6ec6e8f507a4' });

app.set('view engine', ejs)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/view/search.html')
})

app.post('/locations', (req, res) => {
    console.log('i am locations');
    const search = req.body.search
    // console.log(search);
    client.getLocations({ query: search }, (err, result) => {
        if (err) {
            res.send('<center><h1>404 Error! City not found')
        }
        else {
            let newData = JSON.parse(result).location_suggestions;
            let longitude = JSON.stringify(newData[0].longitude);
            // console.log(longitude);
            let latitude = JSON.stringify(newData[0].latitude);
            // console.log(latitude);
            client.getGeocode({ lat: latitude, long: longitude }, (err, result) => {
                if (!err) {
                    let data = JSON.parse(result).nearby_restaurants;
                    let data_list = []
                    let list = { }
                    for (var i of data) {
                        list["Name"] = i.restaurant.name
                        list["Address"] = i.restaurant.location.address
                        list["cuisines"] = i.restaurant.cuisines
                        list["average_cost_for_two"] = i.restaurant.average_cost_for_two
                        list["price_range"] = i.restaurant.price_range
                        list["Image"] = i.restaurant.featured_image
                        list["has_online_delivery"] = i.restaurant.has_online_delivery
                        list["url"] = i.restaurant.url
                        data_list.push(list)
                    }
                    console.log(data_list);
                    res.send(data_list)
                    // res.sendFile(__dirname + "/view/zomato.html")
                    // res.render(__dirname + '/view/zomato.ejs', { data: data_list })
                }
                else {
                    console.log(err, '<center><h1>404 Error! City not found');
                }
            })
        }
    })
})

const PORT = 4000
app.listen(PORT, () => {
    console.log(`Connected to PORT ${PORT}`);
});