document.addEventListener('DOMContentLoaded', () => {

const overlay = document.getElementById('overlay');
const rectangleOverlays = [];
// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add OrbitControls to pivot around the sphere when dragging
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.rotateSpeed = 0.5;
controls.enableZoom = false;

const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Load the star texture
const starTexture = new THREE.TextureLoader().load('star.png', () => {}, undefined, error => console.error(error));

// Create a star background
const starGeometry = new THREE.BufferGeometry();
const starPositions = [];
const starColors = [];
for (let i = 0; i < 1000; i++) {
  const x = THREE.Math.randFloatSpread(200);
  const y = THREE.Math.randFloatSpread(200);
  const z = THREE.Math.randFloatSpread(200);
  starPositions.push(x, y, z);

  const r = THREE.Math.randFloat(0.8, 1.2);
  const g = THREE.Math.randFloat(0.8, 1.2);
  const b = THREE.Math.randFloat(0.8, 1.2);
  starColors.push(r, g, b);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
const starMaterial = new THREE.PointsMaterial({
  size: 0.3,
  vertexColors: true,
  map: starTexture,
  transparent: true,
  alphaTest: 0.5
});
const starField = new THREE.Points(starGeometry, starMaterial);
scene.add(starField);

// Load the face texture
const loader = new THREE.TextureLoader();
loader.load('face.jpg', texture => {
  // Create a sphere with the face texture
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const sphereMaterial = new THREE.MeshPhongMaterial({ map: texture }); // Use MeshPhongMaterial instead of MeshBasicMaterial
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphere);

  // Add rectangles as frames
  const numRectangles = 6; // number of rectangles to create
  const radius = 2; // radius of circular path
  const rectangleSize = 0.4; // size of each rectangle
  const rectAngle = (Math.PI * 2) / numRectangles; // angle between rectangles

  const frameTextures = []; // array to hold frame textures
  const frameFiles = ['frame-1.jpg', 'frame-2.jpg', 'frame-3.jpg', 'frame-4.jpg', 'frame-5.jpg', 'frame-6.jpg'];
  
  const rectangles = [];
  const texts = [];
  
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
    raycaster.setFromCamera(mouse, camera);
  
    const intersects = raycaster.intersectObjects(rectangles);
  
    rectangles.forEach((rect, index) => {
      rect.scale.set(1, 1, 1);
      texts[index].visible = false;
    });
  
    if (intersects.length > 0) {
      const intersectedRect = intersects[0].object;
      intersectedRect.scale.set(1.2, 1.2, 1.2);
      const textIndex = rectangles.indexOf(intersectedRect);
      texts[textIndex].visible = true;
    }
  }

    // Add this function to create overlay elements
    function createRectangleOverlay(rect, index, text, link) {
      const div = document.createElement('div');
      div.className = 'rectangle-overlay';
      div.tabIndex = 0;
      div.setAttribute('aria-label', `Rectangle ${index + 1}`);
      div.style.width = '32px';
      div.style.height = '32px';
      // div.style.border = '1px solid white';
      // div.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      div.addEventListener('focus', () => {
        mouse.x = ((div.offsetLeft + div.offsetWidth / 2) / window.innerWidth) * 2 - 1;
        mouse.y = -((div.offsetTop + div.offsetHeight / 2) / window.innerHeight) * 2 + 1;
    
        raycaster.setFromCamera(mouse, camera);
    
        const intersects = raycaster.intersectObjects(rectangles);
    
        rectangles.forEach((rect, index) => {
          rect.scale.set(1, 1, 1);
          texts[index].visible = false;
        });
    
        if (intersects.length > 0) {
          const intersectedRect = intersects[0].object;
          intersectedRect.scale.set(1.2, 1.2, 1.2);
          const textIndex = rectangles.indexOf(intersectedRect);
          texts[textIndex].visible = true;
        }
      });
    
      // Add keydown event listener for Enter key
      div.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
          window.location.href = link;
        }
      });
    
      overlay.appendChild(div);
      return div;
    }
    
  
  window.addEventListener('mousemove', onMouseMove, false);
  

  const customTexts = [
    'Text 1',
    'Text 2',
    'Text 3',
    'Text 4',
    'Text 5',
    'Text 6'
  ];
  
  const rectangleData = [
    { text: "Skot's portolio: (no SSL (live dangerous.))", link: 'https://skotivanwalker.com/' },
    { text: 'Sylvester Skot 1', link: 'https://youtube.com/shorts/_CS6r0BMFu8?feature=share' },
    { text: 'Sylvester Skot 2', link: 'https://youtube.com/shorts/BDWxglIiw00?feature=share' },
    { text: 'WCAG 2 Overview', link: 'https://www.w3.org/WAI/standards-guidelines/wcag/' },
    { text: 'Muppets', link: 'https://muppets.disney.com/' },
    { text: 'Napolean Dynamite on HBOMax', link: 'https://play.hbomax.com/feature/urn:hbo:feature:GWtYjjw84z3STNQEAAAEX?source=googleHBOMAX&action=play' },
  ];

  function onMouseClick(event) {
    raycaster.setFromCamera(mouse, camera);
  
    const intersects = raycaster.intersectObjects(rectangles);
  
    if (intersects.length > 0) {
      const intersectedRect = intersects[0].object;
      const linkIndex = rectangles.indexOf(intersectedRect);
      window.open(rectangleData[linkIndex].link, '_blank');
    }
  }
  
  window.addEventListener('click', onMouseClick, false);


  // load frame textures
const frameLoader = new THREE.TextureLoader();
frameFiles.forEach(file => {
  frameLoader.load(file, texture => {
    frameTextures.push(texture);

    if (frameTextures.length === frameFiles.length) {
      for (let i = 0; i < numRectangles; i++) {
        // create rectangle mesh with texture
        const rectGeometry = new THREE.BoxGeometry(rectangleSize, rectangleSize * 1.2, 0.05);
        const rectMaterial = new THREE.MeshBasicMaterial({ map: frameTextures[i] });
        const rect = new THREE.Mesh(rectGeometry, rectMaterial);

        const rectAngleOffset = i * rectAngle;
        rect.position.set(radius * Math.cos(rectAngleOffset), radius * Math.sin(rectAngleOffset), 0);

        rect.rotation.x = Math.random() * Math.PI;
        rect.rotation.y = Math.random() * Math.PI;
        rect.rotation.z = Math.random() * Math.PI;

        const animateRect = (rect, index) => {
          requestAnimationFrame(() => animateRect(rect, index));
          rect.rotation.x += 0.01;
          rect.rotation.y += 0.01;
        
          const rectAngleOffset = index * rectAngle;
          rect.position.x = radius * Math.cos(rectAngleOffset + rect.rotation.y);
          rect.position.y = radius * Math.sin(rectAngleOffset + rect.rotation.y);
        
          renderer.render(scene, camera);
        };
        animateRect(rect, i);

        scene.add(rect);
        rectangles.push(rect);
        // Load a font for the text
        const createText = (text, rect) => {
          const fontLoader = new THREE.FontLoader();
          fontLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json', font => {
            const textGeometry = new THREE.TextGeometry(text, {
              font: font,
              size: 0.15,
              height: 0.01,
            });
        
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.visible = false;
        
            textMesh.position.set(rect.position.x, rect.position.y - 0.5, rect.position.z);
        
            scene.add(textMesh);
            texts.push(textMesh);
          });
        };
        createText(rectangleData[i].text, rect);

        // Create an overlay element for each rectangle
        const rectOverlay = createRectangleOverlay(rect, i, rectangleData[i].text, rectangleData[i].link);
        rectangleOverlays.push(rectOverlay);
      }
    }
  });
});

  let rotationSpeed = 0.005; // set the rotation speed

  // Add an animation loop to spin the planet
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    
    sphere.rotation.y += rotationSpeed;

    // Update the position of the text elements
    rectangles.forEach((rect, index) => {
      const textMesh = texts[index];
  
      // Check if the text element exists before updating its position and rotation
      if (textMesh) {
        textMesh.position.set(rect.position.x, rect.position.y - 0.5, rect.position.z);
        textMesh.rotation.y = rect.rotation.y;
      }
    
      // Sync the overlay elements with the 3D rectangles
      const overlayElement = rectangleOverlays[index];

      // Check if the overlay element exists before updating its position
      if (overlayElement) {
        const vector = rect.position.clone().project(camera);
        overlayElement.style.left = `${(vector.x + 1) / 2 * window.innerWidth - overlayElement.offsetWidth / 2}px`;
        overlayElement.style.top = `${-(vector.y - 1) / 2 * window.innerHeight - overlayElement.offsetHeight / 2}px`;
      }
    });

    renderer.render(scene, camera);
  };
  
  animate();

  window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
  
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  
    renderer.setSize(width, height);
  });
});
});