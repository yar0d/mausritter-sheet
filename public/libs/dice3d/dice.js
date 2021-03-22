/* eslint-disable no-undef */
"use strict";

(function () {

  let random_storage = [];
  this.use_true_random = true;
  this.frame_rate = 1 / 60;

  function prepare_rnd(callback) {
    if (!random_storage.length && $diceCore.dice.use_true_random) {
      try {
        $diceCore.rpc({ method: "random", n: 512 },
          function(random_responce) {
            if (!random_responce.error)
              random_storage = random_responce.result.random.data;
            else $diceCore.dice.use_true_random = false;
            callback();
          });
        return;
      } catch (e) { $diceCore.dice.use_true_random = false; }
    }
    callback();
  }

  function rnd() {
    return random_storage.length ? random_storage.pop() : Math.random();
  }

  function create_shape(vertices, faces, radius) {
    let cv = new Array(vertices.length),
      cf = new Array(faces.length);
    let i
    for (i = 0; i < vertices.length; ++i) {
      let v = vertices[i];
      cv[i] = new CANNON.Vec3(v.x * radius, v.y * radius, v.z * radius);
    }
    for (i = 0; i < faces.length; ++i) {
      cf[i] = faces[i].slice(0, faces[i].length - 1);
    }
    return new CANNON.ConvexPolyhedron(cv, cf);
  }

  function make_geom(vertices, faces, radius, tab, af) {
    let geom = new THREE.Geometry();
    let i
    for (i = 0; i < vertices.length; ++i) {
      let vertex = vertices[i].multiplyScalar(radius);
      vertex.index = geom.vertices.push(vertex) - 1;
    }
    for (i = 0; i < faces.length; ++i) {
      let ii = faces[i],
        fl = ii.length - 1;
      let aa = Math.PI * 2 / fl;
      for (let j = 0; j < fl - 2; ++j) {
        geom.faces.push(new THREE.Face3(ii[0], ii[j + 1], ii[j + 2], [geom.vertices[ii[0]],
          geom.vertices[ii[j + 1]], geom.vertices[ii[j + 2]]
        ], 0, ii[fl] + 1));
        geom.faceVertexUvs[0].push([
          new THREE.Vector2((Math.cos(af) + 1 + tab) / 2 / (1 + tab),
            (Math.sin(af) + 1 + tab) / 2 / (1 + tab)),
          new THREE.Vector2((Math.cos(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab),
            (Math.sin(aa * (j + 1) + af) + 1 + tab) / 2 / (1 + tab)),
          new THREE.Vector2((Math.cos(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab),
            (Math.sin(aa * (j + 2) + af) + 1 + tab) / 2 / (1 + tab))
        ]);
      }
    }
    geom.computeFaceNormals();
    geom.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);
    return geom;
  }

  function chamfer_geom(vectors, faces, chamfer) {
    let chamfer_vectors = [],
      chamfer_faces = [],
      corner_faces = new Array(vectors.length);
    let i, j
    for (i = 0; i < vectors.length; ++i) corner_faces[i] = [];
    for (i = 0; i < faces.length; ++i) {
      let ii = faces[i],
        fl = ii.length - 1;
      let center_point = new THREE.Vector3();
      let face = new Array(fl);
      for (j = 0; j < fl; ++j) {
        let vv = vectors[ii[j]].clone();
        center_point.add(vv);
        corner_faces[ii[j]].push(face[j] = chamfer_vectors.push(vv) - 1);
      }
      center_point.divideScalar(fl);
      for (j = 0; j < fl; ++j) {
        let vv = chamfer_vectors[face[j]];
        vv.subVectors(vv, center_point).multiplyScalar(chamfer).addVectors(vv, center_point);
      }
      face.push(ii[fl]);
      chamfer_faces.push(face);
    }
    for (i = 0; i < faces.length - 1; ++i) {
      for (j = i + 1; j < faces.length; ++j) {
        let pairs = [],
          lastm = -1;
        for (let m = 0; m < faces[i].length - 1; ++m) {
          let n = faces[j].indexOf(faces[i][m]);
          if (n >= 0 && n < faces[j].length - 1) {
            if (lastm >= 0 && m != lastm + 1) pairs.unshift([i, m], [j, n]);
            else pairs.push([i, m], [j, n]);
            lastm = m;
          }
        }
        if (pairs.length != 4) continue;
        chamfer_faces.push([chamfer_faces[pairs[0][0]][pairs[0][1]],
          chamfer_faces[pairs[1][0]][pairs[1][1]],
          chamfer_faces[pairs[3][0]][pairs[3][1]],
          chamfer_faces[pairs[2][0]][pairs[2][1]], -1
        ]);
      }
    }
    for (i = 0; i < corner_faces.length; ++i) {
      let cf = corner_faces[i],
        face = [cf[0]],
        count = cf.length - 1;
      while (count) {
        for (let m = faces.length; m < chamfer_faces.length; ++m) {
          let index = chamfer_faces[m].indexOf(face[face.length - 1]);
          if (index >= 0 && index < 4) {
            if (--index == -1) index = 3;
            let next_vertex = chamfer_faces[m][index];
            if (cf.indexOf(next_vertex) >= 0) {
              face.push(next_vertex);
              break;
            }
          }
        }
        --count;
      }
      face.push(-1);
      chamfer_faces.push(face);
    }
    return { vectors: chamfer_vectors, faces: chamfer_faces };
  }

  function create_geom(vertices, faces, radius, tab, af, chamfer) {
    let vectors = new Array(vertices.length);
    for (let i = 0; i < vertices.length; ++i) {
      vectors[i] = (new THREE.Vector3).fromArray(vertices[i]).normalize();
    }
    let cg = chamfer_geom(vectors, faces, chamfer);
    let geom = make_geom(cg.vectors, cg.faces, radius, tab, af);
    //let geom = make_geom(vectors, faces, radius, tab, af); // Without chamfer
    geom.cannon_shape = create_shape(vectors, faces, radius);
    return geom;
  }

  this.standart_d20_dice_face_labels = [' ', '0', '1', '2', '3', '4', '5', '6', '7', '8',
    '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'
  ];
  this.standart_d100_dice_face_labels = [' ', '00', '10', '20', '30', '40', '50',
    '60', '70', '80', '90'
  ];

  function calc_texture_size(approx) {
    return Math.pow(2, Math.floor(Math.log(approx) / Math.log(2)));
  }

  this.create_dice_materials = function(face_labels, size, margin) {
    function create_text_texture(text, color, back_color) {
      if (text == undefined) return null;
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      let ts = calc_texture_size(size + size * 2 * margin) * 2;
      canvas.width = canvas.height = ts;
      context.font = ts / (1 + 2 * margin) + "pt Arial";
      context.fillStyle = back_color;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = color;
      context.fillText(text, canvas.width / 2, canvas.height / 2);
      if (text == '6' || text == '9') {
        context.fillText('  .', canvas.width / 2, canvas.height / 2);
      }
      let texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    }
    let materials = [];
    for (let i = 0; i < face_labels.length; ++i)
      materials.push(new THREE.MeshPhongMaterial($diceCore.copyto(this.material_options, { map: create_text_texture(face_labels[i], this.label_color, this.dice_color) })));
    return materials;
  }

  let d4_labels = [
    [
      [],
      [0, 0, 0],
      [2, 4, 3],
      [1, 3, 4],
      [2, 1, 4],
      [1, 2, 3]
    ],
    [
      [],
      [0, 0, 0],
      [2, 3, 4],
      [3, 1, 4],
      [2, 4, 1],
      [3, 2, 1]
    ],
    [
      [],
      [0, 0, 0],
      [4, 3, 2],
      [3, 4, 1],
      [4, 2, 1],
      [3, 1, 2]
    ],
    [
      [],
      [0, 0, 0],
      [4, 2, 3],
      [1, 4, 3],
      [4, 1, 2],
      [1, 3, 2]
    ]
  ];

  this.create_d4_materials = function(size, margin, labels) {
    function create_d4_text(text, color, back_color) {
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      let ts = calc_texture_size(size + margin) * 2;
      canvas.width = canvas.height = ts;
      context.font = (ts - margin) / 1.5 + "pt Arial";
      context.fillStyle = back_color;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = color;
      for (let i in text) {
        context.fillText(text[i], canvas.width / 2,
          canvas.height / 2 - ts * 0.3);
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate(Math.PI * 2 / 3);
        context.translate(-canvas.width / 2, -canvas.height / 2);
      }
      let texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    }
    let materials = [];
    for (let i = 0; i < labels.length; ++i)
      materials.push(new THREE.MeshPhongMaterial($diceCore.copyto(this.material_options, { map: create_d4_text(labels[i], this.label_color, this.dice_color) })));
    return materials;
  }

  this.create_d4_geometry = function(radius) {
    let vertices = [
      [1, 1, 1],
      [-1, -1, 1],
      [-1, 1, -1],
      [1, -1, -1]
    ];
    let faces = [
      [1, 0, 2, 1],
      [0, 1, 3, 2],
      [0, 3, 2, 3],
      [1, 2, 3, 4]
    ];
    return create_geom(vertices, faces, radius, -0.1, Math.PI * 7 / 6, 0.96);
  }

  this.create_d6_geometry = function(radius) {
    let vertices = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1]
    ];
    let faces = [
      [0, 3, 2, 1, 1],
      [1, 2, 6, 5, 2],
      [0, 1, 5, 4, 3],
      [3, 7, 6, 2, 4],
      [0, 4, 7, 3, 5],
      [4, 5, 6, 7, 6]
    ];
    return create_geom(vertices, faces, radius, 0.1, Math.PI / 4, 0.96);
  }

  this.create_d8_geometry = function(radius) {
    let vertices = [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1]
    ];
    let faces = [
      [0, 2, 4, 1],
      [0, 4, 3, 2],
      [0, 3, 5, 3],
      [0, 5, 2, 4],
      [1, 3, 4, 5],
      [1, 4, 2, 6],
      [1, 2, 5, 7],
      [1, 5, 3, 8]
    ];
    return create_geom(vertices, faces, radius, 0, -Math.PI / 4 / 2, 0.965);
  }

  this.create_d10_geometry = function(radius) {
    let a = Math.PI * 2 / 10,
      // k = Math.cos(a),
      h = 0.105,
      v = -1;
    let vertices = [];
    for (let i = 0, b = 0; i < 10; ++i, b += a)
      vertices.push([Math.cos(b), Math.sin(b), h * (i % 2 ? 1 : -1)]);
    vertices.push([0, 0, -1]);
    vertices.push([0, 0, 1]);
    let faces = [
      [5, 7, 11, 0],
      [4, 2, 10, 1],
      [1, 3, 11, 2],
      [0, 8, 10, 3],
      [7, 9, 11, 4],
      [8, 6, 10, 5],
      [9, 1, 11, 6],
      [2, 0, 10, 7],
      [3, 5, 11, 8],
      [6, 4, 10, 9],
      [1, 0, 2, v],
      [1, 2, 3, v],
      [3, 2, 4, v],
      [3, 4, 5, v],
      [5, 4, 6, v],
      [5, 6, 7, v],
      [7, 6, 8, v],
      [7, 8, 9, v],
      [9, 8, 0, v],
      [9, 0, 1, v]
    ];
    return create_geom(vertices, faces, radius, 0, Math.PI * 6 / 5, 0.945);
  }

  this.create_d12_geometry = function(radius) {
    let p = (1 + Math.sqrt(5)) / 2,
      q = 1 / p;
    let vertices = [
      [0, q, p],
      [0, q, -p],
      [0, -q, p],
      [0, -q, -p],
      [p, 0, q],
      [p, 0, -q],
      [-p, 0, q],
      [-p, 0, -q],
      [q, p, 0],
      [q, -p, 0],
      [-q, p, 0],
      [-q, -p, 0],
      [1, 1, 1],
      [1, 1, -1],
      [1, -1, 1],
      [1, -1, -1],
      [-1, 1, 1],
      [-1, 1, -1],
      [-1, -1, 1],
      [-1, -1, -1]
    ];
    let faces = [
      [2, 14, 4, 12, 0, 1],
      [15, 9, 11, 19, 3, 2],
      [16, 10, 17, 7, 6, 3],
      [6, 7, 19, 11, 18, 4],
      [6, 18, 2, 0, 16, 5],
      [18, 11, 9, 14, 2, 6],
      [1, 17, 10, 8, 13, 7],
      [1, 13, 5, 15, 3, 8],
      [13, 8, 12, 4, 5, 9],
      [5, 4, 14, 9, 15, 10],
      [0, 12, 8, 10, 16, 11],
      [3, 19, 7, 17, 1, 12]
    ];
    return create_geom(vertices, faces, radius, 0.2, -Math.PI / 4 / 2, 0.968);
  }

  this.create_d20_geometry = function(radius) {
    let t = (1 + Math.sqrt(5)) / 2;
    let vertices = [
      [-1, t, 0],
      [1, t, 0],
      [-1, -t, 0],
      [1, -t, 0],
      [0, -1, t],
      [0, 1, t],
      [0, -1, -t],
      [0, 1, -t],
      [t, 0, -1],
      [t, 0, 1],
      [-t, 0, -1],
      [-t, 0, 1]
    ];
    let faces = [
      [0, 11, 5, 1],
      [0, 5, 1, 2],
      [0, 1, 7, 3],
      [0, 7, 10, 4],
      [0, 10, 11, 5],
      [1, 5, 9, 6],
      [5, 11, 4, 7],
      [11, 10, 2, 8],
      [10, 7, 6, 9],
      [7, 1, 8, 10],
      [3, 9, 4, 11],
      [3, 4, 2, 12],
      [3, 2, 6, 13],
      [3, 6, 8, 14],
      [3, 8, 9, 15],
      [4, 9, 5, 16],
      [2, 4, 11, 17],
      [6, 2, 10, 18],
      [8, 6, 7, 19],
      [9, 8, 1, 20]
    ];
    return create_geom(vertices, faces, radius, -0.2, -Math.PI / 4 / 2, 0.955);
  }

  this.material_options = {
    specular: 0x172022,
    color: 0xf0f0f0,
    shininess: 40,
    shading: THREE.FlatShading,
  };
  this.label_color = '#aaaaaa';
  this.dice_color = '#202020';
  this.ambient_light_color = 0xf0f5fb;
  this.spot_light_color = 0xefdfd5;
  this.selector_back_colors = { color: 0x404040, shininess: 0, emissive: 0x858787 };
  this.desk_color = 0xdfdfdf;
  this.use_shadows = true;

  this.known_types = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];
  this.dice_face_range = {
    'd4': [1, 4],
    'd6': [1, 6],
    'd8': [1, 8],
    'd10': [0, 9],
    'd12': [1, 12],
    'd20': [1, 20],
    'd100': [0, 9]
  };
  this.dice_mass = { 'd4': 300, 'd6': 300, 'd8': 340, 'd10': 350, 'd12': 350, 'd20': 400, 'd100': 350 };
  this.dice_inertia = { 'd4': 5, 'd6': 13, 'd8': 10, 'd10': 9, 'd12': 8, 'd20': 6, 'd100': 9 };

  this.scale = 50;

  this.create_d4 = function() {
    if (!this.d4_geometry) this.d4_geometry = this.create_d4_geometry(this.scale * 1.2);
    if (!this.d4_material) this.d4_material = new THREE.MeshFaceMaterial(
      this.create_d4_materials(this.scale / 2, this.scale * 2, d4_labels[0]));
    return new THREE.Mesh(this.d4_geometry, this.d4_material);
  }

  this.create_d6 = function() {
    if (!this.d6_geometry) this.d6_geometry = this.create_d6_geometry(this.scale * 0.9);
    if (!this.dice_material) this.dice_material = new THREE.MeshFaceMaterial(
      this.create_dice_materials(this.standart_d20_dice_face_labels, this.scale / 2, 1.0));
    return new THREE.Mesh(this.d6_geometry, this.dice_material);
  }

  this.create_d8 = function() {
    if (!this.d8_geometry) this.d8_geometry = this.create_d8_geometry(this.scale);
    if (!this.dice_material) this.dice_material = new THREE.MeshFaceMaterial(
      this.create_dice_materials(this.standart_d20_dice_face_labels, this.scale / 2, 1.2));
    return new THREE.Mesh(this.d8_geometry, this.dice_material);
  }

  this.create_d10 = function() {
    if (!this.d10_geometry) this.d10_geometry = this.create_d10_geometry(this.scale * 0.9);
    if (!this.dice_material) this.dice_material = new THREE.MeshFaceMaterial(
      this.create_dice_materials(this.standart_d20_dice_face_labels, this.scale / 2, 1.0));
    return new THREE.Mesh(this.d10_geometry, this.dice_material);
  }

  this.create_d12 = function() {
    if (!this.d12_geometry) this.d12_geometry = this.create_d12_geometry(this.scale * 0.9);
    if (!this.dice_material) this.dice_material = new THREE.MeshFaceMaterial(
      this.create_dice_materials(this.standart_d20_dice_face_labels, this.scale / 2, 1.0));
    return new THREE.Mesh(this.d12_geometry, this.dice_material);
  }

  this.create_d20 = function() {
    if (!this.d20_geometry) this.d20_geometry = this.create_d20_geometry(this.scale);
    if (!this.dice_material) this.dice_material = new THREE.MeshFaceMaterial(
      this.create_dice_materials(this.standart_d20_dice_face_labels, this.scale / 2, 1.0));
    return new THREE.Mesh(this.d20_geometry, this.dice_material);
  }

  this.create_d100 = function() {
    if (!this.d10_geometry) this.d10_geometry = this.create_d10_geometry(this.scale * 0.9);
    if (!this.d100_material) this.d100_material = new THREE.MeshFaceMaterial(
      this.create_dice_materials(this.standart_d100_dice_face_labels, this.scale / 2, 1.5));
    return new THREE.Mesh(this.d10_geometry, this.d100_material);
  }

  this.parse_notation = function(notation) {
    let no = notation.split('@');
    // let dr0 = /\s*(\d*)([a-z]+)(\d+)(\s*(\+|\-)\s*(\d+)){0,1}\s*(\+|$)/gi;
    let dr0 = /\s*(\d*)([a-z]+)(\d+)(\s*(\+|-)\s*(\d+)){0,1}\s*(\+|$)/gi;
    let dr1 = /(\b)*(\d+)(\b)*/gi;
    let ret = { set: [], constant: 0, result: [], error: false },
      res;
    // eslint-disable-next-line no-cond-assign
    while (res = dr0.exec(no[0])) {
      let command = res[2];
      if (command != 'd') { ret.error = true; continue; }
      let count = parseInt(res[1]);
      if (res[1] == '') count = 1;
      let type = 'd' + res[3];
      if (this.known_types.indexOf(type) == -1) { ret.error = true; continue; }
      while (count--) ret.set.push(type);
      if (res[5] && res[6]) {
        if (res[5] == '+') ret.constant += parseInt(res[6]);
        else ret.constant -= parseInt(res[6]);
      }
    }
    // eslint-disable-next-line no-cond-assign
    while (res = dr1.exec(no[1])) {
      ret.result.push(parseInt(res[2]));
    }
    return ret;
  }

  this.stringify_notation = function(nn) {
    let dict = {},
      notation = '';
    for (let i in nn.set)
      if (!dict[nn.set[i]]) dict[nn.set[i]] = 1;
      else ++dict[nn.set[i]];
    for (let i in dict) {
      if (notation.length) notation += ' + ';
      notation += (dict[i] > 1 ? dict[i] : '') + i;
    }
    if (nn.constant) {
      if (nn.constant > 0) notation += ' + ' + nn.constant;
      else notation += ' - ' + Math.abs(nn.constant);
    }
    return notation;
  }

  let that = this;

  this.dice_box = function(container, dimensions) {
    this.use_adapvite_timestep = true;
    this.animate_selector = true;

    this.dices = [];
    this.scene = new THREE.Scene();
    this.world = new CANNON.World();

    this.renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer({ antialias: true, alpha: true }) : new THREE.CanvasRenderer({ antialias: true });
    container.appendChild(this.renderer.domElement);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    // this.renderer.setClearColor(0xffffff, 1);
    this.renderer.setClearColor(0xffffff, 0); // white = transparent

    this.reinit(container, dimensions);

    this.world.gravity.set(0, 0, -9.8 * 800);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.solver.iterations = 16;

    let ambientLight = new THREE.AmbientLight(that.ambient_light_color);
    this.scene.add(ambientLight);

    this.dice_body_material = new CANNON.Material();
    let desk_body_material = new CANNON.Material();
    let barrier_body_material = new CANNON.Material();
    this.world.addContactMaterial(new CANNON.ContactMaterial(
      desk_body_material, this.dice_body_material, 0.01, 0.5));
    this.world.addContactMaterial(new CANNON.ContactMaterial(
      barrier_body_material, this.dice_body_material, 0, 1.0));
    this.world.addContactMaterial(new CANNON.ContactMaterial(
      this.dice_body_material, this.dice_body_material, 0, 0.5));

    this.world.add(new CANNON.RigidBody(0, new CANNON.Plane(), desk_body_material));
    let barrier;
    barrier = new CANNON.RigidBody(0, new CANNON.Plane(), barrier_body_material);
    barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
    barrier.position.set(0, this.h * 0.93, 0);
    this.world.add(barrier);

    barrier = new CANNON.RigidBody(0, new CANNON.Plane(), barrier_body_material);
    barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    barrier.position.set(0, -this.h * 0.93, 0);
    this.world.add(barrier);

    barrier = new CANNON.RigidBody(0, new CANNON.Plane(), barrier_body_material);
    barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
    barrier.position.set(this.w * 0.93, 0, 0);
    this.world.add(barrier);

    barrier = new CANNON.RigidBody(0, new CANNON.Plane(), barrier_body_material);
    barrier.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
    barrier.position.set(-this.w * 0.93, 0, 0);
    this.world.add(barrier);

    this.last_time = 0;
    this.running = false;

    this.renderer.render(this.scene, this.camera);
  }

  this.dice_box.prototype.reinit = function(container, dimensions) {
    this.cw = container.clientWidth / 2;
    this.ch = container.clientHeight / 2;
    if (dimensions) {
      this.w = dimensions.w;
      this.h = dimensions.h;
    } else {
      this.w = this.cw;
      this.h = this.ch;
    }
    this.aspect = Math.min(this.cw / this.w, this.ch / this.h);
    that.scale = Math.sqrt(this.w * this.w + this.h * this.h) / 13;

    this.renderer.setSize(this.cw * 2, this.ch * 2);

    this.wh = this.ch / this.aspect / Math.tan(10 * Math.PI / 180);
    if (this.camera) this.scene.remove(this.camera);
    this.camera = new THREE.PerspectiveCamera(20, this.cw / this.ch, 1, this.wh * 1.3);
    this.camera.position.z = this.wh;

    let mw = Math.max(this.w, this.h);
    if (this.light) this.scene.remove(this.light);
    this.light = new THREE.SpotLight(that.spot_light_color, 2.0);
    this.light.position.set(-mw / 2, mw / 2, mw * 2);
    this.light.target.position.set(0, 0, 0);
    this.light.distance = mw * 5;
    this.light.castShadow = true;
    this.light.shadowCameraNear = mw / 10;
    this.light.shadowCameraFar = mw * 5;
    this.light.shadowCameraFov = 50;
    this.light.shadowBias = 0.001;
    this.light.shadowDarkness = 1.1;
    this.light.shadowMapWidth = 1024;
    this.light.shadowMapHeight = 1024;
    this.scene.add(this.light);

    if (this.desk) this.scene.remove(this.desk);
    // this.desk = new THREE.Mesh(new THREE.PlaneGeometry(this.w * 2, this.h * 2, 1, 1), new THREE.MeshPhongMaterial({ color: that.desk_color, opacity: that.desk_opacity }));
    // this.desk = new THREE.Mesh(new THREE.PlaneGeometry(this.w * 2, this.h * 2, 1, 1), new THREE.MeshBasicMaterial({ color: that.desk_color, opacity: that.desk_opacity }));
    // this.desk.receiveShadow = that.use_shadows;
    // this.scene.add(this.desk);

    this.renderer.render(this.scene, this.camera);
  }

  function make_random_vector(vector) {
    let random_angle = rnd() * Math.PI / 5 - Math.PI / 5 / 2;
    let vec = {
      x: vector.x * Math.cos(random_angle) - vector.y * Math.sin(random_angle),
      y: vector.x * Math.sin(random_angle) + vector.y * Math.cos(random_angle)
    };
    if (vec.x == 0) vec.x = 0.01;
    if (vec.y == 0) vec.y = 0.01;
    return vec;
  }

  this.dice_box.prototype.generate_vectors = function(notation, vector, boost) {
    let vectors = [];
    for (let i in notation.set) {
      let vec = make_random_vector(vector);
      let pos = {
        x: this.w * (vec.x > 0 ? -1 : 1) * 0.9,
        y: this.h * (vec.y > 0 ? -1 : 1) * 0.9,
        z: rnd() * 200 + 200
      };
      let projector = Math.abs(vec.x / vec.y);
      if (projector > 1.0) pos.y /= projector;
      else pos.x *= projector;
      let velvec = make_random_vector(vector);
      let velocity = { x: velvec.x * boost, y: velvec.y * boost, z: -10 };
      let inertia = that.dice_inertia[notation.set[i]];
      let angle = {
        x: -(rnd() * vec.y * 5 + inertia * vec.y),
        y: rnd() * vec.x * 5 + inertia * vec.x,
        z: 0
      };
      let axis = { x: rnd(), y: rnd(), z: rnd(), a: rnd() };
      vectors.push({ set: notation.set[i], pos: pos, velocity: velocity, angle: angle, axis: axis });
    }
    return vectors;
  }

  this.dice_box.prototype.create_dice = function(type, pos, velocity, angle, axis) {
    let dice = that['create_' + type]();
    dice.castShadow = true;
    dice.dice_type = type;
    dice.body = new CANNON.RigidBody(that.dice_mass[type],
      dice.geometry.cannon_shape, this.dice_body_material);
    dice.body.position.set(pos.x, pos.y, pos.z);
    dice.body.quaternion.setFromAxisAngle(new CANNON.Vec3(axis.x, axis.y, axis.z), axis.a * Math.PI * 2);
    dice.body.angularVelocity.set(angle.x, angle.y, angle.z);
    dice.body.velocity.set(velocity.x, velocity.y, velocity.z);
    dice.body.linearDamping = 0.1;
    dice.body.angularDamping = 0.1;
    this.scene.add(dice);
    this.dices.push(dice);
    this.world.add(dice.body);
  }

  this.dice_box.prototype.check_if_throw_finished = function() {
    let res = true;
    let e = 6;
    if (this.iteration < 10 / that.frame_rate) {
      for (let i = 0; i < this.dices.length; ++i) {
        let dice = this.dices[i];
        if (dice.dice_stopped === true) continue;
        let a = dice.body.angularVelocity,
          v = dice.body.velocity;
        if (Math.abs(a.x) < e && Math.abs(a.y) < e && Math.abs(a.z) < e &&
          Math.abs(v.x) < e && Math.abs(v.y) < e && Math.abs(v.z) < e) {
          if (dice.dice_stopped) {
            if (this.iteration - dice.dice_stopped > 3) {
              dice.dice_stopped = true;
              continue;
            }
          } else dice.dice_stopped = this.iteration;
          res = false;
        } else {
          dice.dice_stopped = undefined;
          res = false;
        }
      }
    }
    return res;
  }

  function get_dice_value(dice) {
    let vector = new THREE.Vector3(0, 0, dice.dice_type == 'd4' ? -1 : 1);
    let closest_face, closest_angle = Math.PI * 2;
    for (let i = 0, l = dice.geometry.faces.length; i < l; ++i) {
      let face = dice.geometry.faces[i];
      if (face.materialIndex == 0) continue;
      let angle = face.normal.clone().applyQuaternion(dice.body.quaternion).angleTo(vector);
      if (angle < closest_angle) {
        closest_angle = angle;
        closest_face = face;
      }
    }
    let matindex = closest_face.materialIndex - 1;
    if (dice.dice_type == 'd100') matindex *= 10;
    if (dice.dice_type == 'd10' && matindex == 0) matindex = 10;
    return matindex;
  }

  function get_dice_values(dices) {
    let values = [];
    for (let i = 0, l = dices.length; i < l; ++i) {
      values.push(get_dice_value(dices[i]));
    }
    return values;
  }

  this.dice_box.prototype.emulate_throw = function() {
    while (!this.check_if_throw_finished()) {
      ++this.iteration;
      this.world.step(that.frame_rate);
    }
    return get_dice_values(this.dices);
  }

  this.dice_box.prototype.__animate = function(threadid) {
    let time = (new Date()).getTime();
    let time_diff = (time - this.last_time) / 1000;
    if (time_diff > 3) time_diff = that.frame_rate;
    ++this.iteration;
    if (this.use_adapvite_timestep) {
      while (time_diff > that.frame_rate * 1.1) {
        this.world.step(that.frame_rate);
        time_diff -= that.frame_rate;
      }
      this.world.step(time_diff);
    } else {
      this.world.step(that.frame_rate);
    }
    for (let i in this.scene.children) {
      let interact = this.scene.children[i];
      if (interact.body != undefined) {
        interact.position.copy(interact.body.position);
        interact.quaternion.copy(interact.body.quaternion);
      }
    }
    this.renderer.render(this.scene, this.camera);
    this.last_time = this.last_time ? time : (new Date()).getTime();
    if (this.running == threadid && this.check_if_throw_finished()) {
      this.running = false;
      if (this.callback) this.callback.call(this, get_dice_values(this.dices));
    }
    if (this.running == threadid) {
      (function(t, tid, uat) {
        if (!uat && time_diff < that.frame_rate) {
          setTimeout(function() { requestAnimationFrame(function() { t.__animate(tid); }); },
            (that.frame_rate - time_diff) * 1000);
        } else requestAnimationFrame(function() { t.__animate(tid); });
      })(this, threadid, this.use_adapvite_timestep);
    }
  }

  this.dice_box.prototype.clear = function() {
    this.running = false;
    let dice;
    // eslint-disable-next-line no-cond-assign
    while (dice = this.dices.pop()) {
      this.scene.remove(dice);
      if (dice.body) this.world.remove(dice.body);
    }
    if (this.pane) this.scene.remove(this.pane);
    this.renderer.render(this.scene, this.camera);
    let box = this;
    setTimeout(function() { box.renderer.render(box.scene, box.camera); }, 100);
  }

  this.dice_box.prototype.prepare_dices_for_roll = function(vectors) {
    this.clear();
    this.iteration = 0;
    for (let i in vectors) {
      this.create_dice(vectors[i].set, vectors[i].pos, vectors[i].velocity,
        vectors[i].angle, vectors[i].axis);
    }
  }

  function shift_dice_faces(dice, value, res) {
    let r = that.dice_face_range[dice.dice_type];
    if (dice.dice_type == 'd10' && value == 10) value = 0;
    if (!(value >= r[0] && value <= r[1])) return;
    let num = value - res;
    let geom = dice.geometry.clone();
    for (let i = 0, l = geom.faces.length; i < l; ++i) {
      let matindex = geom.faces[i].materialIndex;
      if (matindex == 0) continue;
      matindex += num - 1;
      while (matindex > r[1]) matindex -= r[1];
      while (matindex < r[0]) matindex += r[1];
      geom.faces[i].materialIndex = matindex + 1;
    }
    if (dice.dice_type == 'd4' && num != 0) {
      if (num < 0) num += 4;
      dice.material = new THREE.MeshFaceMaterial(
        that.create_d4_materials(that.scale / 2, that.scale * 2, d4_labels[num]));
    }
    dice.geometry = geom;
  }

  this.dice_box.prototype.roll = function(vectors, values, callback) {
    this.prepare_dices_for_roll(vectors);
    if (values != undefined && values.length) {
      this.use_adapvite_timestep = false;
      let res = this.emulate_throw();
      this.prepare_dices_for_roll(vectors);
      for (let i in res)
        shift_dice_faces(this.dices[i], values[i], res[i]);
    }
    this.callback = callback;
    this.running = (new Date()).getTime();
    this.last_time = 0;
    this.__animate(this.running);
  }

  this.dice_box.prototype.__selector_animate = function(threadid) {
    let time = (new Date()).getTime();
    let time_diff = (time - this.last_time) / 1000;
    if (time_diff > 3) time_diff = that.frame_rate;
    let angle_change = 0.3 * time_diff * Math.PI * Math.min(24000 + threadid - time, 6000) / 6000;
    if (angle_change < 0) this.running = false;
    for (let i in this.dices) {
      this.dices[i].rotation.y += angle_change;
      this.dices[i].rotation.x += angle_change / 4;
      this.dices[i].rotation.z += angle_change / 10;
    }
    this.last_time = time;
    this.renderer.render(this.scene, this.camera);
    if (this.running == threadid) {
      (function(t, tid) {
        requestAnimationFrame(function() { t.__selector_animate(tid); });
      })(this, threadid);
    }
  }

  this.dice_box.prototype.search_dice_by_mouse = function(ev) {
    let m = $diceCore.get_mouse_coords(ev);
    let intersects = (new THREE.Raycaster(this.camera.position,
      (new THREE.Vector3((m.x - this.cw) / this.aspect,
        1 - (m.y - this.ch) / this.aspect, this.w / 9))
      .sub(this.camera.position).normalize())).intersectObjects(this.dices);
    if (intersects.length) return intersects[0].object.userData;
  }

  this.dice_box.prototype.draw_selector = function() {
    this.clear();
    let step = this.w / 4.5;
    this.pane = new THREE.Mesh(new THREE.PlaneGeometry(this.w * 6, this.h * 6, 1, 1),
      new THREE.MeshPhongMaterial(that.selector_back_colors));
    this.pane.receiveShadow = true;
    this.pane.position.set(0, 0, 1);
    this.scene.add(this.pane);

    // let mouse_captured = false;

    for (let i = 0, pos = -3; i < that.known_types.length; ++i, ++pos) {
      let dice = $diceCore.dice['create_' + that.known_types[i]]();
      dice.position.set(pos * step, 0, step * 0.5);
      dice.castShadow = true;
      dice.userData = that.known_types[i];
      this.dices.push(dice);
      this.scene.add(dice);
    }

    this.running = (new Date()).getTime();
    this.last_time = 0;
    if (this.animate_selector) this.__selector_animate(this.running);
    else this.renderer.render(this.scene, this.camera);
  }

  function throw_dices(box, vector, boost, dist, notation_getter, before_roll, after_roll) {
    let uat = $diceCore.dice.use_adapvite_timestep;

    function roll(request_results) {
      if (after_roll) {
        box.clear();
        box.roll(vectors, request_results || notation.result, function(result) {
          if (after_roll) after_roll.call(box, notation, result);
          box.rolling = false;
          $diceCore.dice.use_adapvite_timestep = uat;
        });
      }
    }
    vector.x /= dist;
    vector.y /= dist;
    let notation = notation_getter.call(box);
    if (notation.set.length == 0) return;
    let vectors = box.generate_vectors(notation, vector, boost);
    box.rolling = true;
    if (before_roll) before_roll.call(box, vectors, notation, roll);
    else roll();
  }

  this.dice_box.prototype.bind_mouse = function(container, notation_getter, before_roll, after_roll) {
    let box = this;
    $diceCore.bind(container, ['mousedown', 'touchstart'], function(ev) {
      ev.preventDefault();
      box.mouse_time = (new Date()).getTime();
      box.mouse_start = $diceCore.get_mouse_coords(ev);
    });
    $diceCore.bind(container, ['mouseup', 'touchend'], function(ev) {
      if (box.rolling) return;
      if (box.mouse_start == undefined) return;
      ev.stopPropagation();
      let m = $diceCore.get_mouse_coords(ev);
      let vector = { x: m.x - box.mouse_start.x, y: -(m.y - box.mouse_start.y) };
      box.mouse_start = undefined;
      let dist = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
      if (dist < Math.sqrt(box.w * box.h * 0.01)) return;
      let time_int = (new Date()).getTime() - box.mouse_time;
      if (time_int > 2000) time_int = 2000;
      let boost = Math.sqrt((2500 - time_int) / 2500) * dist * 2;
      prepare_rnd(function() {
        throw_dices(box, vector, boost, dist, notation_getter, before_roll, after_roll);
      });
    });
  }

  this.dice_box.prototype.bind_throw = function(button, notation_getter, before_roll, after_roll) {
    let box = this;
    $diceCore.bind(button, ['mouseup', 'touchend'], function(ev) {
      ev.stopPropagation();
      box.start_throw(notation_getter, before_roll, after_roll);
    });
  }

  this.dice_box.prototype.start_throw = function(notation_getter, before_roll, after_roll) {
    let box = this;
    if (box.rolling) return;
    prepare_rnd(function() {
      let vector = { x: (rnd() * 2 - 1) * box.w, y: -(rnd() * 2 - 1) * box.h };
      let dist = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
      let boost = (rnd() + 3) * dist;
      throw_dices(box, vector, boost, dist, notation_getter, before_roll, after_roll);
    });
  }

}).apply(diceCore.dice = diceCore.dice || {});