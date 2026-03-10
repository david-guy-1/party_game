// outer : scale +0.9, color *192
// inner : scale +0.4, color *128
// o -> i
for(let petal_index =0; petal_index < 10; petal_index ++){ 
    let points = [[248.66500938028724,460.28885739509934],[235.87376721541148,456.6065301052108],[232.38135269268747,453.0917803573212],[233.02737502424685,447.27757937328676],[234.15791410447576,441.78638955503203],[241.4941614999781,438.38870035523627],[245.5641021888022,441.8772209456569],[249.56265951834013,444.3629809185467],[252.75096720829833,452.7982840344127],[254.8413155048715,456.51446295773957]]

    let center = [252, 456]

    let random_n = Math.random() * 0.2 + 0.9

    let new_points = points.map(x => lerp(x, center, random_n))

    let points_centered = new_points.map(x => Mv([[1, 0, -center[0]], [0, 1, -center[1]], [0,0,1]], [x[0], x[1], 1]).slice(0, 2))

    let x_scale = Math.random() * 0.3 + 0.4
    let y_scale = Math.random() * 0.3 + 0.4

    let points_scaled = points_centered.map(x => Mv([[x_scale, 0,0], [0, y_scale, 0], [0,0,1]], [x[0], x[1], 1]).slice(0, 2))

    let angle = 0.3*petal_index-0.5

    let rotated_points = points_scaled.map(x => Mv( [[Math.cos(angle), -Math.sin(angle), 0], [Math.sin(angle), Math.cos(angle), 0], [0,0,1]], [x[0], x[1], 1]).slice(0, 2))


    let points_restored = rotated_points.map(x => Mv([[1, 0, center[0]], [0, 1, center[1]], [0,0,1]], [x[0], x[1], 1]).slice(0, 2))

    // move points 
    points_restored = points_restored.map(x => Mv([[1, 0, 60], [0, 1, 10], [0,0,1]], [x[0], x[1], 1]  ).slice(0, 2))

    
    points_restored = points_restored.map(x => Mv([[1, 0, 60], [0, 1, 0], [0,0,1]], [x[0], x[1], 1]  ).slice(0, 2))
    
    points_restored = points_restored.map(x => Mv([[1, 0, 60], [0, 1, -10], [0,0,1]], [x[0], x[1], 1]  ).slice(0, 2))
    // add points 

    let words = []
    for(let point of points_restored){
        let word = display.points.length.toString()
        display.points.push([word, point[0], point[1]])
        words.push(word);
    }


    // add shape
    let stop_1 = Math.random() * 128 + 64
    let stop_2 = stop_1 * 0.7
    display.layers[2].shapes.push({
        "parent_layer": "flowers",
        "type": "bezier shape",
        "points": words.map(x => [x, 0, 0]),
        "name": "petal5i " + petal_index.toString(),
        "outline_visible": true,
        "visible": true,
        "tag": [],
        "fill": {
        "type": "fill_linear",
        "p0": words[0],
        "p1": words[4],
        "colorstops": [
            [
                0,
                point_to_color([stop_1, stop_2, stop_2])
            ],
            [
                1,
                point_to_color([255, stop_2, stop_2])
            ]
        ]
    }
    })
}