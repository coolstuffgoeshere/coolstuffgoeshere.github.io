// Data.js is Step #1 of Loading & Drawing the App from its' data.  These functions call each other and the rest of the app depends on them from here.

console.log('Begin Loading Maps')

const { createClient } = supabase;
supabase = createClient(
    'https://iipfkaeymrjaulaazoph.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNjQ5OTcyMiwiZXhwIjoxOTQyMDc1NzIyfQ.I8bVXoJTQtQ18xJeKG7Snq4FhVTFKQD-533tMED1jLA'
);

const defaultMapUrl = "monaco";
const filterDrawer = document.getElementById('filter-drawer');
const editPinsModeToggle = document.getElementById('edit-pins-mode');

// -----------------------------THE MAPS--------------------------------------------------------
// 1. Fetch all the Maps from the database and then tell the app to show the correct one.

async function fetchMapsFromSupabase () {
    // Get the "Maps" table and select everything inside, then map it to an array of maps like before. Simple!
    const supaFiles = await supabase.from("Maps").select("*");
    // console.log(supaFiles.data);
    state.maps = supaFiles.data.map(item => ({
        name: item.name,
        urlName: item.urlName,
        mapImage: item.mapImage,
    }));
    // console.log("Maps Loaded:" + maps);
    buildMapMenu();
    showMap();

}
fetchMapsFromSupabase();

// Display the Map
function showMap () {
    // console.log(state.maps);
    const mapToShow = state.maps.find(map => map.urlName === defaultMapUrl);
    setMap(mapToShow || state.maps[0]);
}

// ----------------------------MAP DATA FUNCTIONS------------------------------------------------------
// 2. Fetch All Map Data available and then tell the app to show the correct one.
// Multiple Data Sets possible.  Currently just loads 'default' for that map for now as the starting point.

async function fetchMapDataFromSupabase (currentMap) {
    let supaFiles = await supabase.from("MapData").select("*");
    console.log("I found: " + supaFiles.data);
    console.log("Current Map is: " + currentMap);

    const availableDataForMap = supaFiles.data.filter(item => item.mapUsed === currentMap).map(item => ({
        map: item.mapUsed,
        dataName: item.name,
        mapData: item.mapData,
    }));

    availableDataForMap.find(item => item.dataName === 'default').mapData = rawData;

    console.log(availableDataForMap);

    const displayData = availableDataForMap.find(item => item.dataName === 'default');
    if (displayData) {
        data = displayData.mapData;
        console.log("Data Picked To Show: ", data);

        setMapData(data);
    }
}

const rawData = {
    "categories": [
        {
            "name": "Easter Eggs",
            "groups": [
                {
                    "name": "Text",
                    "icon": null,
                    "description": "",
                    "data": [
                        {
                            "name": "S Lies",
                            "type": "point",
                            "points": [[63.17, 57.45]],
                            "image": "https://mywikis-eu-wiki-media.s3.eu-central-2.wasabisys.com/thefinals/20230616171309_1.jpg"
                        }
                    ]
                },
                {
                    "name": "Graffiti",
                    "icon": "/assets/icons/graffiti.png",
                    "description": "",
                    "data": [
                        {
                            "name": "SR.!",
                            "type": "point",
                            "points": [[57.83, 73.89]],
                            "image": "https://mywikis-eu-wiki-media.s3.eu-central-2.wasabisys.com/thefinals/SRspray.jpg"
                        },
                        {
                            "name": "825c",
                            "type": "point",
                            "points": [[61.38, 51.95]],
                            "image": "https://mywikis-eu-wiki-media.s3.eu-central-2.wasabisys.com/thefinals/825.png"
                        },
                        {
                            "name": "1339c",
                            "type": "point",
                            "points": [[27.71, 29.78]],
                            "image": "https://mywikis-eu-wiki-media.s3.eu-central-2.wasabisys.com/thefinals/1339c.png"
                        }
                    ]
                },
                {
                    "name": "Glitch clusters",
                    "icon": "/assets/icons/glitch.png",
                    "description": "",
                    "data": [
                        {
                            "name": "North East - House",
                            "type": "point",
                            "points": [[61.02, 27.93]],
                            "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227819762285809674/image.png?ex=6629cb43&is=66175643&hm=57fd64828926873cf47cd004c8fb91e21651a157bbe4224edea03122a80ea454&"
                        },
                        {
                            "name": "South West - Hut",
                            "type": "point",
                            "points": [[9.19, 58.68]],
                            "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227821077217153044/image.png?ex=6629cc7c&is=6617577c&hm=ef3d6a4f5f05899b375fbfbfdc5dd50af051d4c67ca2671814a82464ff3a005b&"
                        },
                        {
                            "name": "South - by SR.!",
                            "type": "point",
                            "points": [[55.67, 74.50]],
                            "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1228072176138191010/srglitch.png?ex=662ab657&is=66184157&hm=d074db4c83f2b2bd360e804b92e76a669f57958ec710d3874016948a005010bd&"
                        }
                    ]
                },
                {
                    "name": "Power Generators",
                    "icon": "/assets/icons/flash.png",
                    "description": "",
                    "data": [
                        {
                            "name": "Residential",
                            "type": "point",
                            "points": [[54.06, 45.06]],
                            "image": null
                        },
                        {
                            "name": "Forest",
                            "type": "point",
                            "points": [[45.50, 34.00]],
                            "image": null
                        },
                        {
                            "name": "Construction",
                            "type": "point",
                            "points": [[59.62, 57.11]],
                            "image": null
                        },
                        {
                            "name": "Villas",
                            "type": "point",
                            "points": [[67.18, 64.00]],
                            "image": null
                        },
                        {
                            "name": "Park",
                            "type": "point",
                            "points": [[77.17, 68.67]],
                            "image": null
                        },
                        {
                            "name": "Cathedral",
                            "type": "point",
                            "points": [[47.18, 66.44]],
                            "image": null
                        },
                        {
                            "name": "Cliffside",
                            "type": "point",
                            "points": [[17.72, 63.50]],
                            "image": null
                        },
                        {
                            "name": "Royal Plaza",
                            "type": "point",
                            "points": [[10.50, 38.78]],
                            "image": null
                        }
                    ]
                },
                {
                    "name": "Cannons",
                    "icon": "/assets/icons/cannon.png",
                    "description": "",
                    "data": [
                        {
                            "name": "North - Plaza",
                            "type": "point",
                            "points": [[19.2, 25.2]],
                            "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227821112134467714/image.png?ex=6629cc84&is=66175784&hm=2cce4f764adadb450f808c2a9bc6b8d432bff4ab370824c4fd9ef180df1535af&"
                        },
                        {
                            "name": "West - Plaza 1",
                            "type": "point",
                            "points": [[7.07, 35.16]],
                            "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227825807099957290/image.png?ex=6629d0e4&is=66175be4&hm=01efa2c8e481d759979b9dc0e2fdb4b03f314bce450477cee1ad05afefb198dd&"
                        },
                        {
                            "name": "West - Plaza 2",
                            "type": "point",
                            "points": [[5.73, 38.98]],
                            "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227825807099957290/image.png?ex=6629d0e4&is=66175be4&hm=01efa2c8e481d759979b9dc0e2fdb4b03f314bce450477cee1ad05afefb198dd&"
                        },
                        {
                            "name": "South West - Hotels",
                            "type": "point",
                            "points": [[16.12, 60.61]],
                            "image": "https://cdn.discordapp.com/attachments/1228035039695208600/1228073278073995356/image.png?ex=662ab75d&is=6618425d&hm=56634f868b5edd99560c4f27c69d1ad59ba9204280067827009d0531e6d9e65d&"
                        },
                        {
                            "name": "North East - Park",
                            "type": "point",
                            "points": [[72.27, 32.36]],
                            "image": "https://cdn.discordapp.com/attachments/1228035039695208600/1228074720822296656/image.png?ex=662ab8b5&is=661843b5&hm=de899b89ed6785f1e6199f820539df13472e7a2819fe9db022a1fb0f3e03598c&"
                        }
                    ]
                }
            ]
        },
        {
            "name": "Props",
            "groups": [
                {
                    "name": "Fountains",
                    "icon": "/assets/icons/fountain.png",
                    "description": "",
                    "data": [
                        {
                            "title": "East - Pocket Park",
                            "type": "point",
                            "points": [[80.04, 44.64]],
                            "image": "https://cdn.discordapp.com/attachments/1228035039695208600/1228074242747404390/image.png?ex=662ab843&is=66184343&hm=932533db0b3e8db26192354f2d0b33d0c9dfd01ba8a781058cc0f4e832dac1d1&"
                        },
                        {
                            "title": "West - Plaza",
                            "type": "point",
                            "points": [[8.56, 37.70]],
                            "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227782477058412585/image.png?ex=6629a889&is=66173389&hm=1b45dacc290191c48038d22db26f82514664661ac20a359f2918d93f3aa8d132&"
                        },
                        {
                            "title": "South East - Park",
                            "type": "point",
                            "points": [[72.79, 75.22]],
                            "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227820941523025990/image.png?ex=6629cc5c&is=6617575c&hm=1e4cc3e6b6dc42d3efdbca3d9c36aaa305cd28533c16a8a514e8cd24fd7b4f3a&"
                        },
                        {
                            "title": "Center - Shopping",
                            "type": "point",
                            "points": [[37.46, 50.70]],
                            "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227832150158741554/image.png?ex=6629d6cc&is=661761cc&hm=737ebfeb1494a86f4c4e002d5e1d0d8e595948d66f9e63857b0ffe85198d2ef8&"
                        }
                    ]
                },
                {
                    "name": "Statues (Gold Woman)",
                    "icon": "/assets/icons/sculpture.png",
                    "description": "",
                    "data": [
                        {
                            "name": "West - Plaza",
                            "type": "point",
                            "points": [[17.8, 27.1]],
                            "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227784091219263488/image.png?ex=6629aa0a&is=6617350a&hm=7e74f441e6be794b441be8b74e283ab42f130812999f7690215c55d5156655a2&"
                        },
                        {
                            "name": "South East - Park",
                            "type": "point",
                            "points": [[73.23, 82.77]],
                            "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227820917346926624/image.png?ex=6629cc56&is=66175756&hm=7a4e3fcccaf103fc85218cbad557d38050500dbfbf629cb2773f6d37def7ff2c&"
                        },
                        {
                            "name": "East - Pocket Park",
                            "type": "point",
                            "points": [[84.26, 49.46]],
                            "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227820894404087929/image.png?ex=6629cc51&is=66175751&hm=9ddfd59dccd823e00fcb199fc49a04cfaee0638fba019e50e26597e616094465&"
                        },
                        {
                            "name": "Center - Near Cathedral",
                            "type": "point",
                            "points": [[40.26, 63.87]],
                            "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227820199772684418/image.png?ex=6629cbab&is=661756ab&hm=caa56192946592fef3b4707749a4e08adf9f2bac1b5226943d30a68c5aac72f8&"
                        }
                    ]
                },
                {
                    "name": "Statues (Non-Destructible)",
                    "icon": null,
                    "description": "",
                    "data": [
                        {
                            "name": "Thinker",
                            "type": "point",
                            "points": [[35.58, 79.47]],
                            "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227821018257690684/image.png?ex=6629cc6e&is=6617576e&hm=3d71a3c96bfc56f51ba5106f3774d962841187005274872f6e2e741d006c8bd3&"
                        },
                        {
                            "name": "Albert Plaque",
                            "type": "point",
                            "points": [[84.89, 63.71]],
                            "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227821045805875341/image.png?ex=6629cc75&is=66175775&hm=184343b0bda1d137ce7c98ae456d0cc2b86bb725d366bda318a230fc649841de&"
                        },
                        {
                            "name": "Lovers",
                            "type": "point",
                            "points": [[74.84, 77.40]],
                            "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227830939938193519/image.png?ex=6629d5ac&is=661760ac&hm=4504da2da5b85f72e14866a3479b98104cd1e57f632bd219361d5aebde988d10&"
                        }
                    ]
                },
                {
                    "name": "Diamonds",
                    "icon": "/assets/icons/poker.png",
                    "description": "",
                    "data": [
                        {
                            "name": "Oval with crown",
                            "type": "point",
                            "points": [[20.88, 41.21]],
                            "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227782995692228710/image.png?ex=6629a905&is=66173405&hm=5d1184a4062534a526251c51af92e0c5fa2695b2eab96adee69d2c31d9604ed2&"
                        },
                        {
                            "name": "Sign Post 1",
                            "type": "point",
                            "points": [[23.13, 28.42]],
                            "image": "https://cdn.discordapp.com/attachments/1227782293129793656/1227821127687078030/image.png?ex=6629cc88&is=66175788&hm=72664b417d6f78540e5b9865c5082528f707810bcfb9d1fa3191de2bee18e342&"
                        },
                        {
                            "name": "Sign Post 4",
                            "type": "point",
                            "points": [[61.18, 33.54]],
                            "image": "https://cdn.discordapp.com/attachments/1227968583112327198/1228034228344721550/image.png?ex=662a92ff&is=66181dff&hm=79c6505f017917a84420c8b417f79e1992016f765f7f90e944472eddae7988d0&"
                        },
                        {
                            "name": "Sign Post 3",
                            "type": "point",
                            "points": [[53.10, 35.35]],
                            "image": "https://cdn.discordapp.com/attachments/1227968583112327198/1228034520121610361/image.png?ex=662a9345&is=66181e45&hm=59d4dc42d30b9b81cc87317dae0ef5afddc59231c404c7df94bfd1070fa750f1&"
                        },
                        {
                            "name": "Sign Post 5",
                            "type": "point",
                            "points": [[65.84, 32.34]],
                            "image": "https://cdn.discordapp.com/attachments/1227968583112327198/1228033981220388915/20240411182442_1.jpg?ex=662a92c4&is=66181dc4&hm=dcc9a11515f76cdf7d4b26d655ad78754dab4ba995f4da45d3c75027d127ccf4&"
                        },
                        {
                            "name": "Sign Post 2",
                            "type": "point",
                            "points": [[46.50, 34.34]],
                            "image": "https://cdn.discordapp.com/attachments/1227968583112327198/1228034520121610361/image.png?ex=662a9345&is=66181e45&hm=59d4dc42d30b9b81cc87317dae0ef5afddc59231c404c7df94bfd1070fa750f1&"
                        }
                    ]
                }
            ]
        }
    ]
}