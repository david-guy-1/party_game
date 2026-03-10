// 235, 316 start
//427, 443, end

for(let i=0; i<100; i++){
    let coords =[ lerp([235], [427], Math.random())[0], lerp([316], [443], Math.random())[0]]
    let size = [Math.random() * 2 + 2,Math.random() * 2 + 2]
    let color = point_to_color([Math.random() * 128 + 128,Math.random() * 128 + 128,Math.random() * 128 + 128])
    let points = [[coords[0], coords[1]],[coords[0] + size[0], coords[1]], [coords[0], coords[1]+size[1]]]
    let midpoint = lincomb(1, coords, -0.5, size);
    let words = []
    for(let point of points){
        let word = display.points.length.toString()
        display.points.push([word, point[0], point[1]])
        words.push(word);
    }

    let midpoint_word = display.points.length.toString()
    display.points.push([midpoint_word, midpoint[0], midpoint[1]])
    // add the ellipse

    display.layers[3].shapes.push({
    "parent_layer": "cake spots",
    "type": "ellipse",
    "points": words.map(x => [x,0,0]),
    "name": "cake spot " + i,
    "outline_visible": true,
    "visible": true,
    "tag": [],
    "fill": {
        "type": "fill_radial",
        "p0": midpoint_word,
        "p1": midpoint_word,
        "r0": 0,
        "r1": 4,
        "colorstops": [
            [
                0,
                "white"
            ],
            [
                1,
                color
            ]
        ]
    }
})
}