for(let i=0; i <370; i++){
    let point = [rescale(0, 1, -326, 1003, Math.random()) , rescale(0, 1, 122, 699, Math.random())]; 
    let r1 = 10 + Math.random() * 3
    let r2 = 5 + Math.random() * 2
    let angle = Math.random() * 2 * Math.PI;
    let points = []
    for(let i=0; i< 10; i++){
        points.push(lincomb(1, point, i%2 == 0 ? r1 : r2, unit_vector(angle + i * Math.PI / 5))); 
    }
    let words = []
    // add point to display
    for(let pt of points){
        let name = display.points.length.toString(); 
        display.points.push([name, pt[0], pt[1]])
        words.push(name); 
    }
    let center_name = display.points.length.toString(); 
    display.points.push([center_name, point[0], point[1]]); 
    let shape = {
    "parent_layer": "decorations",
    "type": "polygon",
    "points": words.map(x => [x,0,0]),
    "name": "star shape " + i,
    "outline_visible": true,
    "visible": true,
    "tag": [],
    "fill": {
        "type": "fill_radial",
        "p0": center_name,
        "p1": center_name,
        "r0": 0,
        "r1": r1,
        "colorstops": [
            [
                0,
                `hsl(${Math.random() * 360}, 80%,80%)`
            ],
            [
                1,
                `hsl(${Math.random() * 360}, 80%,80%)`
            ]
        ]
    }}
    
    display.layers[4].shapes.push(shape);
}

